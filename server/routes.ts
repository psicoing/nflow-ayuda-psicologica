import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { processUserMessage } from "./promptHandler";
import { Message, UserRoles } from "@shared/schema";
import { hashPassword } from "./utils";
import cors from "cors";
import { checkDatabaseConnection } from "./db";

// Middleware para verificar rol de administrador
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: "No autenticado" });
  if (req.user?.role !== UserRoles.ADMIN) {
    return res.status(403).json({ message: "No autorizado" });
  }
  next();
};

// Middleware para manejar errores de base de datos
const handleDatabaseError = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[API Error]', error);
  if (error.code === '57P01') { // Código de error de Neon para desconexión administrativa
    return res.status(503).json({
      message: "Error temporal de base de datos, por favor intenta de nuevo",
      retryAfter: 5
    });
  }
  next(error);
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Configurar CORS para permitir peticiones desde el panel de administración
  app.use(cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true
  }));

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

  // Rutas protegidas con manejo de errores
  app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
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
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);

      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      // El resto de la lógica de autenticación se maneja en passport
      next();
    } catch (error) {
      next(error);
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

  // Ruta para obtener registros de actividad administrativa
  app.get("/api/admin/activity-logs", requireAdmin, async (_req: Request, res: Response) => {
    const logs = await storage.getAdminLogs();
    res.json(logs);
  });

  // Rutas de API
  app.get("/api/chats", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "No autenticado" });
    try {
      const chats = await storage.getChatHistory(req.user!.id);
      res.json(chats);
    } catch (error) {
      console.error('Error al obtener historial:', error);
      res.status(500).json({ message: "Error al obtener el historial" });
    }
  });

  app.post("/api/chat", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Mensaje requerido" });
    }

    // Verificar límite de mensajes para usuarios gratuitos
    if (req.user!.role === UserRoles.USER) {
      const user = await storage.getUser(req.user!.id);
      if (user && user.questionCount >= 5) {
        return res.status(403).json({
          message: "Has alcanzado el límite de mensajes gratuitos",
          redirectTo: "/subscriptions"
        });
      }
    }

    try {
      // Usar el nuevo procesador de mensajes especializado
      const response = await processUserMessage(message, history);

      const messages: Message[] = [
        ...history,
        { role: "user", content: message, timestamp: new Date().toISOString() },
        { role: "assistant", content: response.content, timestamp: response.timestamp.toISOString() }
      ];

      // Incrementar contador para usuarios gratuitos
      if (req.user!.role === UserRoles.USER) {
        await storage.updateUser(req.user!.id, {
          questionCount: (req.user!.questionCount || 0) + 1
        });
      }

      const chat = await storage.saveChat(req.user!.id, messages);
      res.json(chat);

    } catch (error: any) {
      console.error('Error al procesar mensaje:', error);
      res.status(500).json({ 
        message: error.message || "Error al procesar la consulta psicológica" 
      });
    }
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


  // Middleware de manejo de errores
  app.use(handleDatabaseError);

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