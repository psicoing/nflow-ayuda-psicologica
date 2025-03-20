import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { processUserMessage } from "./promptHandler";
import { Message, UserRoles } from "@shared/schema";
import cors from "cors";
import express from 'express';

// Middleware para verificar autenticación
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "No autenticado" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Configurar CORS con opciones específicas
  app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Configurar el manejo de JSON y cookies
  app.use(express.json());

  // Configurar autenticación
  setupAuth(app);

  // Verificar conexión a la base de datos periódicamente
  setInterval(async () => {
    const isConnected = await checkDatabaseConnection();
    console.log('[Health Check] Database connection:', isConnected ? 'OK' : 'ERROR');
  }, 30000);

  // Ruta de estado de la API
  app.get("/api/health", async (_req, res) => {
    const dbConnected = await checkDatabaseConnection();
    res.json({
      status: dbConnected ? "ok" : "database_error",
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    });
  });

  // Rutas de API
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
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Mensaje requerido" });
    }

    try {
      const response = await processUserMessage(message, history);

      const messages: Message[] = [
        ...history,
        { role: "user", content: message, timestamp: new Date().toISOString() },
        { role: "assistant", content: response.content, timestamp: response.timestamp.toISOString() }
      ];

      const chat = await storage.saveChat(req.user!.id, messages);
      res.json(chat);

    } catch (error: any) {
      console.error('Error al procesar mensaje:', error);
      res.status(500).json({
        message: error.message || "Error al procesar la consulta psicológica"
      });
    }
  });

  // Middleware de error general
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