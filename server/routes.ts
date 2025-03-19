import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { generateChatResponse } from "./openai";
import { Message, UserRoles } from "@shared/schema";
import { hashPassword } from "./utils";
import cors from "cors";

// Middleware para verificar rol de administrador
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: "No autenticado" });
  if (req.user?.role !== UserRoles.ADMIN) {
    return res.status(403).json({ message: "No autorizado" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Configurar CORS para permitir peticiones desde otros dominios
  app.use(cors({
    origin: process.env.FRONTEND_URL || "*", // URL del frontend o permitir todos en desarrollo
    credentials: true // Necesario para enviar cookies de sesión
  }));

  setupAuth(app);

  // Rutas de API
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Rutas existentes
  app.get("/api/chats", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "No autenticado" });
    const chats = await storage.getChatHistory(req.user!.id);
    res.json(chats);
  });

  app.post("/api/chat", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "No autenticado" });

    const { message, history } = req.body;
    if (!message) return res.status(400).json({ message: "Mensaje requerido" });

    // Verificar el límite de preguntas para usuarios normales
    if (req.user!.role === UserRoles.USER) {
      const user = await storage.getUser(req.user!.id);
      if (user && user.questionCount >= 5) {
        return res.status(403).json({
          message: "Has alcanzado el límite de preguntas gratuitas",
          redirectTo: "/subscriptions"
        });
      }
    }

    try {
      const response = await generateChatResponse(message, history);
      const messages: Message[] = [
        ...history,
        { role: "user", content: message, timestamp: new Date().toISOString() },
        { role: "assistant", content: response, timestamp: new Date().toISOString() }
      ];

      // Incrementar el contador de preguntas para usuarios normales
      if (req.user!.role === UserRoles.USER) {
        await storage.updateUser(req.user!.id, {
          questionCount: (req.user!.questionCount || 0) + 1
        });
      }

      const chat = await storage.saveChat(req.user!.id, messages);
      res.json(chat);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Rutas de administración
  app.get("/api/admin/users", requireAdmin, async (_req: Request, res: Response) => {
    const users = await storage.getAllUsers();
    res.json(users);
  });

  app.get("/api/admin/chats", requireAdmin, async (_req: Request, res: Response) => {
    const chats = await storage.getAllChats();
    res.json(chats);
  });

  app.post("/api/admin/users/:id/activate", requireAdmin, async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const user = await storage.updateUser(userId, { isActive: true });
    await storage.createAdminLog(req.user!.id, "activate_user", { userId });
    res.json(user);
  });

  app.post("/api/admin/users/:id/deactivate", requireAdmin, async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const user = await storage.updateUser(userId, { isActive: false });
    await storage.createAdminLog(req.user!.id, "deactivate_user", { userId });
    res.json(user);
  });

  app.post("/api/admin/users/:id/promote", requireAdmin, async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const { role } = req.body;
    const user = await storage.updateUser(userId, { role });
    await storage.createAdminLog(req.user!.id, "promote_user", { userId, role });
    res.json(user);
  });

  app.post("/api/admin/chats/:id/review", requireAdmin, async (req: Request, res: Response) => {
    const chatId = parseInt(req.params.id);
    const chat = await storage.reviewChat(chatId, {
      isReviewed: true,
      isApproved: true,
      reviewedBy: req.user!.id,
      reviewNotes: "Revisado por administrador"
    });
    await storage.createAdminLog(req.user!.id, "review_chat", { chatId });
    res.json(chat);
  });

  app.post("/api/admin/chats/:id/flag", requireAdmin, async (req: Request, res: Response) => {
    const chatId = parseInt(req.params.id);
    const { flagReason } = req.body;
    const chat = await storage.updateChat(chatId, {
      isFlagged: true,
      flagReason,
    });
    await storage.createAdminLog(req.user!.id, "flag_chat", { chatId, flagReason });
    res.json(chat);
  });

  app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send("El nombre de usuario ya existe");
    }

    const user = await storage.createUser({
      ...req.body,
      password: await hashPassword(req.body.password),
    });

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });


  const httpServer = createServer(app);
  return httpServer;
}