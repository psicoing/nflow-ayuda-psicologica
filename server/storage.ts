import { Message, User, InsertUser, Chat, users, chats } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getChatHistory(userId: number): Promise<Chat[]>;
  saveChat(userId: number, messages: Message[]): Promise<Chat>;
  incrementMessageCount(userId: number): Promise<User>;
  getMessageCount(userId: number): Promise<number>;
  updateUserSubscription(userId: number, subscriptionData: {
    subscriptionId: string;
    status: string;
    provider: string;
  }): Promise<User>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error('Error en getUser:', error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error('Error en getUserByUsername:', error);
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values({
          ...insertUser,
          isActive: true,
          createdAt: new Date(),
          messageCount: 0,
          subscriptionStatus: "inactive"
        })
        .returning();
      return user;
    } catch (error) {
      console.error('Error en createUser:', error);
      throw error;
    }
  }

  async updateUserSubscription(userId: number, subscriptionData: {
    subscriptionId: string;
    status: string;
    provider: string;
  }): Promise<User> {
    try {
      const [user] = await db
        .update(users)
        .set({
          subscriptionId: subscriptionData.subscriptionId,
          subscriptionStatus: subscriptionData.status,
          subscriptionProvider: subscriptionData.provider
        })
        .where(eq(users.id, userId))
        .returning();
      return user;
    } catch (error) {
      console.error('Error al actualizar suscripción:', error);
      throw error;
    }
  }

  async getChatHistory(userId: number): Promise<Chat[]> {
    try {
      return db
        .select()
        .from(chats)
        .where(eq(chats.userId, userId))
        .orderBy(chats.createdAt);
    } catch (error) {
      console.error('Error en getChatHistory:', error);
      throw error;
    }
  }

  async saveChat(userId: number, messages: Message[]): Promise<Chat> {
    try {
      const [chat] = await db
        .insert(chats)
        .values({
          userId,
          messages,
          createdAt: new Date(),
        })
        .returning();
      return chat;
    } catch (error) {
      console.error('Error en saveChat:', error);
      throw error;
    }
  }

  async incrementMessageCount(userId: number): Promise<User> {
    try {
      const [user] = await db
        .update(users)
        .set({
          messageCount: sql`${users.messageCount} + 1`
        })
        .where(eq(users.id, userId))
        .returning();
      return user;
    } catch (error) {
      console.error('Error al incrementar contador de mensajes:', error);
      throw error;
    }
  }

  async getMessageCount(userId: number): Promise<number> {
    try {
      const [user] = await db
        .select({ messageCount: users.messageCount })
        .from(users)
        .where(eq(users.id, userId));
      return user?.messageCount || 0;
    } catch (error) {
      console.error('Error al obtener contador de mensajes:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();