import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { processUserMessage } from "./promptHandler";
import { Message } from "@shared/schema";
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

  // Rutas de chat
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
      const user = req.user!;

      // Verificar límite de mensajes para usuarios gratuitos
      if (user.role === "user") {
        const messageCount = user.messageCount || 0;
        if (messageCount >= MAX_FREE_MESSAGES) {
          return res.status(403).json({
            message: "Has alcanzado el límite de mensajes gratuitos",
            remainingMessages: 0
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

      // Actualizar el contador de mensajes para usuarios gratuitos
      if (user.role === "user") {
        await storage.incrementMessageCount(user.id);
      }

      // Guardar el chat
      const chat = await storage.saveChat(user.id, messages);

      // Obtener el número de mensajes restantes
      const remainingMessages = user.role === "user" 
        ? MAX_FREE_MESSAGES - (user.messageCount + 1)
        : null;

      res.json({ ...chat, remainingMessages });

    } catch (error: any) {
      console.error('Error al procesar mensaje:', error);
      res.status(500).json({
        message: error.message || "Error al procesar la consulta psicológica"
      });
    }
  });

  // Rutas del diario emocional
  app.post("/api/emotion-journals", requireAuth, async (req: Request, res: Response) => {
    try {
      const journalData = {
        ...req.body,
        userId: req.user!.id
      };

      const journal = await storage.createEmotionJournal(journalData);
      res.status(201).json(journal);
    } catch (error: any) {
      console.error('Error al crear entrada del diario:', error);
      res.status(500).json({ 
        message: "Error al crear la entrada del diario",
        error: error.message 
      });
    }
  });

  app.get("/api/emotion-journals", requireAuth, async (req: Request, res: Response) => {
    try {
      const journals = await storage.getUserEmotionJournals(req.user!.id);
      res.json(journals);
    } catch (error: any) {
      console.error('Error al obtener entradas del diario:', error);
      res.status(500).json({ 
        message: "Error al obtener las entradas del diario",
        error: error.message 
      });
    }
  });

  app.get("/api/emotion-journals/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const journal = await storage.getEmotionJournal(parseInt(req.params.id));

      if (!journal) {
        return res.status(404).json({ message: "Entrada no encontrada" });
      }

      if (journal.userId !== req.user!.id) {
        return res.status(403).json({ message: "No autorizado" });
      }

      res.json(journal);
    } catch (error: any) {
      console.error('Error al obtener entrada del diario:', error);
      res.status(500).json({ 
        message: "Error al obtener la entrada del diario",
        error: error.message 
      });
    }
  });

  app.patch("/api/emotion-journals/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const journal = await storage.getEmotionJournal(parseInt(req.params.id));

      if (!journal) {
        return res.status(404).json({ message: "Entrada no encontrada" });
      }

      if (journal.userId !== req.user!.id) {
        return res.status(403).json({ message: "No autorizado" });
      }

      const updatedJournal = await storage.updateEmotionJournal(parseInt(req.params.id), req.body);
      res.json(updatedJournal);
    } catch (error: any) {
      console.error('Error al actualizar entrada del diario:', error);
      res.status(500).json({ 
        message: "Error al actualizar la entrada del diario",
        error: error.message 
      });
    }
  });

  // Añadir la nueva ruta de borrado después de las rutas existentes
  app.delete("/api/user", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      await storage.deactivateUser(userId);

      // Cerrar sesión después de desactivar el usuario
      req.logout((err) => {
        if (err) {
          console.error('Error al cerrar sesión:', err);
          return res.status(500).json({ message: "Error al procesar la baja" });
        }
        res.json({ message: "Usuario dado de baja correctamente" });
      });
    } catch (error: any) {
      console.error('Error al dar de baja al usuario:', error);
      res.status(500).json({ 
        message: "Error al procesar la baja",
        error: error.message 
      });
    }
  });

  // Añadir esta ruta después de las rutas del diario emocional
  app.get("/api/admin/users", requireAuth, async (req: Request, res: Response) => {
    try {
      // Verificar si el usuario es administrador
      if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Acceso no autorizado" });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: "Error al obtener la lista de usuarios" });
    }
  });

  // Nueva ruta de cierre de sesión
  app.post("/api/logout", (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(200); // Ya está desconectado
    }
    req.logout((err) => {
      if (err) {
        console.error('Error durante el cierre de sesión:', err);
        return next(err);
      }
      req.session.destroy((err) => {
        if (err) {
          console.error('Error al destruir la sesión:', err);
          return next(err);
        }
        res.sendStatus(200);
      });
    });
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