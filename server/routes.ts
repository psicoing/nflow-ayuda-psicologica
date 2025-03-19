import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { generateChatResponse } from "./openai";
import { Message, UserRoles } from "@shared/schema";
import Stripe from "stripe";
import { hashPassword } from "./utils";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Falta la clave secreta de Stripe");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Middleware para verificar rol de administrador
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: "No autenticado" });
  if (req.user?.role !== UserRoles.ADMIN) {
    return res.status(403).json({ message: "No autorizado" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

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


  app.post("/api/create-subscription-session", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "No has iniciado sesión" });
    }

    try {
      if (!process.env.STRIPE_PRICE_ID) {
        throw new Error("No se ha configurado STRIPE_PRICE_ID");
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        success_url: `${req.protocol}://${req.get("host")}/chat?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get("host")}/subscriptions?canceled=true`,
        client_reference_id: req.user.id.toString(),
      });

      res.json({ sessionUrl: session.url });
    } catch (error: any) {
      console.error("Error al crear la sesión de suscripción:", error);
      res.status(500).json({
        message: "Error al crear la sesión de suscripción",
        error: error.message
      });
    }
  });

  // Webhook para eventos de Stripe
  app.post("/api/webhook", async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(500).json({ message: "Falta la clave secreta del webhook de Stripe" });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody!,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error("Error al validar el webhook:", err);
      return res.status(400).json({ message: `Error en el webhook: ${err.message}` });
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          if (session.client_reference_id) {
            const userId = parseInt(session.client_reference_id);
            await storage.updateUser(userId, {
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              subscriptionStatus: "active",
              role: UserRoles.PROFESSIONAL,
              questionCount: 0,
            });
          }
          break;
        }
        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          const user = await storage.getUserByStripeCustomerId(subscription.customer as string);
          if (user) {
            await storage.updateUser(user.id, {
              subscriptionStatus: "canceled",
              role: UserRoles.USER,
            });
          }
          break;
        }
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error("Error al procesar el evento del webhook:", err);
      res.status(500).json({ message: `Error al procesar el webhook: ${err.message}` });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}