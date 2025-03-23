import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { processUserMessage } from "./promptHandler";
import { Message, MAX_FREE_MESSAGES } from "@shared/schema";
import cors from "cors";
import express from 'express';
import { db } from "./db"; // Assuming db is imported from somewhere

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

  // Revertir a la versión básica sin sistema premium
  app.post("/api/subscriptions/activate", requireAuth, async (req: Request, res: Response) => {
    try {
      const { subscriptionId, userId } = req.body;

      if (!subscriptionId || !userId) {
        return res.status(400).json({ 
          message: "Se requiere ID de suscripción y usuario" 
        });
      }

      // Actualizar el estado de suscripción del usuario
      await storage.updateUserSubscription(userId, {
        subscriptionId,
        status: 'active',
        provider: 'paypal'
      });

      // Registrar la activación en los logs
      console.log(`Suscripción activada - Usuario: ${userId}, Plan: ${subscriptionId}`);

      res.json({ 
        message: "Suscripción activada correctamente",
        subscriptionId 
      });
    } catch (error: any) {
      console.error('Error al activar suscripción:', error);
      res.status(500).json({ 
        message: "Error al activar la suscripción",
        error: error.message 
      });
    }
  });

  // Rutas existentes de chat
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
      res.json(chat);

    } catch (error: any) {
      console.error('Error al procesar mensaje:', error);
      res.status(500).json({
        message: error.message || "Error al procesar la consulta psicológica"
      });
    }
  });

  // Ruta para obtener usuarios y su estado de suscripción (solo para administradores)
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

  // Ruta para obtener el resumen de suscripciones (solo para administradores)
  app.get("/api/admin/subscription-summary", requireAuth, async (req: Request, res: Response) => {
    try {
      // Verificar si el usuario es administrador
      if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Acceso no autorizado" });
      }

      const [usersList, summary] = await Promise.all([
        db.query(`SELECT * FROM subscription_summary ORDER BY created_at DESC`),
        db.query(`
          SELECT 
            estado_usuario,
            COUNT(*) as total_usuarios,
            SUM(message_count) as total_mensajes,
            ROUND(AVG(message_count)::numeric, 2) as promedio_mensajes,
            COUNT(CASE WHEN puede_enviar_mensajes THEN 1 END) as usuarios_activos
          FROM subscription_summary
          GROUP BY estado_usuario
          ORDER BY 
            CASE estado_usuario
              WHEN 'Suscripción activa' THEN 1
              WHEN 'En período de prueba' THEN 2
              WHEN 'Límite alcanzado' THEN 3
            END
        `)
      ]);

      res.json({
        users: usersList.rows,
        summary: summary.rows
      });
    } catch (error) {
      console.error('Error al obtener resumen de suscripciones:', error);
      res.status(500).json({ message: "Error al obtener el resumen de suscripciones" });
    }
  });

  // Nuevas rutas para el diario emocional
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