import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { generateChatResponse } from "./openai";
import { Message } from "@shared/schema";

export async function registerRoutes(app: Express): Server {
  setupAuth(app);

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
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
