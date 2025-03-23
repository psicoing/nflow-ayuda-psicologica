import { Message, User, InsertUser, Chat, EmotionJournal, InsertEmotionJournal, users, chats, emotionJournals } from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getAllUsers(): Promise<User[]>;
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
  createEmotionJournal(journal: InsertEmotionJournal): Promise<EmotionJournal>;
  getUserEmotionJournals(userId: number): Promise<EmotionJournal[]>;
  getEmotionJournal(id: number): Promise<EmotionJournal | undefined>;
  updateEmotionJournal(id: number, journal: Partial<InsertEmotionJournal>): Promise<EmotionJournal>;
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

  async getAllUsers(): Promise<User[]> {
    try {
      return await db
        .select()
        .from(users)
        .orderBy(users.createdAt);
    } catch (error) {
      console.error('Error en getAllUsers:', error);
      throw error;
    }
  }

  async createEmotionJournal(journal: InsertEmotionJournal): Promise<EmotionJournal> {
    try {
      const [newJournal] = await db
        .insert(emotionJournals)
        .values({
          ...journal,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      return newJournal;
    } catch (error) {
      console.error('Error al crear entrada del diario:', error);
      throw error;
    }
  }

  async getUserEmotionJournals(userId: number): Promise<EmotionJournal[]> {
    try {
      return await db
        .select()
        .from(emotionJournals)
        .where(eq(emotionJournals.userId, userId))
        .orderBy(desc(emotionJournals.createdAt));
    } catch (error) {
      console.error('Error al obtener entradas del diario:', error);
      throw error;
    }
  }

  async getEmotionJournal(id: number): Promise<EmotionJournal | undefined> {
    try {
      const [journal] = await db
        .select()
        .from(emotionJournals)
        .where(eq(emotionJournals.id, id));
      return journal;
    } catch (error) {
      console.error('Error al obtener entrada del diario:', error);
      throw error;
    }
  }

  async updateEmotionJournal(id: number, journal: Partial<InsertEmotionJournal>): Promise<EmotionJournal> {
    try {
      const [updatedJournal] = await db
        .update(emotionJournals)
        .set({
          ...journal,
          updatedAt: new Date()
        })
        .where(eq(emotionJournals.id, id))
        .returning();
      return updatedJournal;
    } catch (error) {
      console.error('Error al actualizar entrada del diario:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();