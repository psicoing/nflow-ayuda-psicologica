import { Message, User, InsertUser, Chat, users, chats, AdminLog, adminLogs } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
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
  getUnreviewedChats(): Promise<Chat[]>;
  reviewChat(chatId: number, review: {
    isReviewed: boolean;
    isApproved: boolean;
    reviewedBy: number;
    reviewNotes?: string;
  }): Promise<Chat>;
  sessionStore: session.Store;
  getAllUsers(): Promise<User[]>;
  getAllChats(): Promise<Chat[]>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  updateChat(id: number, data: Partial<Chat>): Promise<Chat>;
  createAdminLog(adminId: number, action: string, details: any): Promise<AdminLog>;
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
        .select({
          id: users.id,
          username: users.username,
          password: users.password,
          role: users.role,
          isActive: users.isActive,
          createdAt: users.createdAt,
        })
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
        .select({
          id: users.id,
          username: users.username,
          password: users.password,
          role: users.role,
          isActive: users.isActive,
          createdAt: users.createdAt,
        })
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
        })
        .returning();
      return user;
    } catch (error) {
      console.error('Error en createUser:', error);
      throw error;
    }
  }

  async getChatHistory(userId: number): Promise<Chat[]> {
    try {
      return db
        .select()
        .from(chats)
        .where(eq(chats.userId, userId));
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

  async getUnreviewedChats(): Promise<Chat[]> {
    try {
      return db
        .select()
        .from(chats)
        .where(eq(chats.isReviewed, false))
        .orderBy(chats.createdAt);
    } catch (error) {
      console.error('Error en getUnreviewedChats:', error);
      throw error;
    }
  }

  async reviewChat(chatId: number, review: {
    isReviewed: boolean;
    isApproved: boolean;
    reviewedBy: number;
    reviewNotes?: string;
  }): Promise<Chat> {
    try {
      const [updatedChat] = await db
        .update(chats)
        .set(review)
        .where(eq(chats.id, chatId))
        .returning();
      return updatedChat;
    } catch (error) {
      console.error('Error en reviewChat:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return db
        .select({
          id: users.id,
          username: users.username,
          password: users.password,
          role: users.role,
          isActive: users.isActive,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(users.createdAt);
    } catch (error) {
      console.error('Error en getAllUsers:', error);
      throw error;
    }
  }

  async getAllChats(): Promise<Chat[]> {
    try {
      return db.select().from(chats).orderBy(chats.createdAt);
    } catch (error) {
      console.error('Error en getAllChats:', error);
      throw error;
    }
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    try {
      const [user] = await db
        .update(users)
        .set(data)
        .where(eq(users.id, id))
        .returning();
      return user;
    } catch (error) {
      console.error('Error en updateUser:', error);
      throw error;
    }
  }

  async updateChat(id: number, data: Partial<Chat>): Promise<Chat> {
    try {
      const [chat] = await db
        .update(chats)
        .set(data)
        .where(eq(chats.id, id))
        .returning();
      return chat;
    } catch (error) {
      console.error('Error en updateChat:', error);
      throw error;
    }
  }

  async createAdminLog(adminId: number, action: string, details: any): Promise<AdminLog> {
    try {
      const [log] = await db
        .insert(adminLogs)
        .values({
          adminId,
          action,
          details,
          createdAt: new Date(),
        })
        .returning();
      return log;
    } catch (error) {
      console.error('Error en createAdminLog:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();