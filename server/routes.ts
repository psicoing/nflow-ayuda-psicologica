import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { processUserMessage } from "./promptHandler";
import { Message, MAX_FREE_MESSAGES } from "@shared/schema";
import cors from "cors";
import express from 'express';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "No autenticado" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie']
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  setupAuth(app);

  app.get("/api/chats", requireAuth, async (req: Request, res: Response) => {
    try {
      const chats = await storage.getChatHistory(req.user!.id);
      res.json(chats);
    } catch (error) {
      console.error('Error al obtener historial:', error);
      res.status(500).json({ message: "Error al obtener el historial" });
    }
  });

  app.post("/api/chat", requireAuth, async (req: Request, res: Response) => {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Mensaje requerido" });
    }

    try {
      // Verificar límite de mensajes para usuarios gratuitos
      if (req.user!.role === "user") {
        const messageCount = await storage.getMessageCount(req.user!.id);
        console.log('Mensajes enviados:', messageCount, 'de', MAX_FREE_MESSAGES);

        if (messageCount >= MAX_FREE_MESSAGES) {
          return res.status(403).json({
            message: "Has alcanzado el límite de mensajes gratuitos",
            needsSubscription: true
          });
        }
      }

      // Procesar el mensaje
      const response = await processUserMessage(message, history);

      // Crear el array de mensajes
      const messages: Message[] = [
        ...history,
        { 
          role: "user", 
          content: message, 
          timestamp: new Date().toISOString() 
        },
        { 
          role: "assistant", 
          content: response.content, 
          timestamp: response.timestamp.toISOString() 
        }
      ];

      // Guardar el chat
      const chat = await storage.saveChat(req.user!.id, messages);

      // Incrementar contador solo para usuarios gratuitos
      if (req.user!.role === "user") {
        await storage.incrementMessageCount(req.user!.id);
        const newCount = await storage.getMessageCount(req.user!.id);

        res.json({
          ...chat,
          remainingMessages: MAX_FREE_MESSAGES - newCount
        });
      } else {
        res.json(chat);
      }

    } catch (error: any) {
      console.error('Error al procesar mensaje:', error);
      res.status(500).json({
        message: error.message || "Error al procesar la consulta psicológica"
      });
    }
  });

  app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[API Error]', error);
    res.status(500).json({
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}