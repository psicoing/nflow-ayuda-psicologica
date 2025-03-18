import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { generateChatResponse } from "./openai";
import { Message, UserRoles } from "@shared/schema";

// Middleware para verificar rol de profesional
const requireProfessional = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  if (req.user.role !== UserRoles.PROFESSIONAL && req.user.role !== UserRoles.ADMIN) {
    return res.sendStatus(403);
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Rutas existentes
  app.get("/api/chats", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const chats = await storage.getChatHistory(req.user.id);
    res.json(chats);
  });

  app.post("/api/chat", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const { message, history } = req.body;
    if (!message) return res.status(400).send("Message is required");

    try {
      const response = await generateChatResponse(message, history);

      const messages: Message[] = [
        ...history,
        { role: "user", content: message, timestamp: new Date().toISOString() },
        { role: "assistant", content: response, timestamp: new Date().toISOString() }
      ];

      const chat = await storage.saveChat(req.user.id, messages);
      res.json(chat);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Nuevas rutas para el panel de administración
  app.get("/api/chats/unreviewed", requireProfessional, async (req, res) => {
    const chats = await storage.getUnreviewedChats();
    res.json(chats);
  });

  app.post("/api/chats/:id/review", requireProfessional, async (req, res) => {
    const chatId = parseInt(req.params.id);
    const { isApproved, notes } = req.body;

    const chat = await storage.reviewChat(chatId, {
      isReviewed: true,
      isApproved,
      reviewedBy: req.user.id,
      reviewNotes: notes
    });

    res.json(chat);
  });

  const httpServer = createServer(app);
  return httpServer;
}