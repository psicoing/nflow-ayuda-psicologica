import { Message, User, InsertUser, Chat, users, chats, AdminLog, adminLogs } from "@shared/schema";
import { db } from "./db";
import { eq, and, isNull } from "drizzle-orm";
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
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getChatHistory(userId: number): Promise<Chat[]> {
    return db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId));
  }

  async saveChat(userId: number, messages: Message[]): Promise<Chat> {
    const [chat] = await db
      .insert(chats)
      .values({
        userId,
        messages,
        createdAt: new Date(),
      })
      .returning();
    return chat;
  }

  async getUnreviewedChats(): Promise<Chat[]> {
    return db
      .select()
      .from(chats)
      .where(eq(chats.isReviewed, false))
      .orderBy(chats.createdAt);
  }

  async reviewChat(chatId: number, review: {
    isReviewed: boolean;
    isApproved: boolean;
    reviewedBy: number;
    reviewNotes?: string;
  }): Promise<Chat> {
    const [updatedChat] = await db
      .update(chats)
      .set(review)
      .where(eq(chats.id, chatId))
      .returning();
    return updatedChat;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(users.createdAt);
  }

  async getAllChats(): Promise<Chat[]> {
    return db.select().from(chats).orderBy(chats.createdAt);
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateChat(id: number, data: Partial<Chat>): Promise<Chat> {
    const [chat] = await db
      .update(chats)
      .set(data)
      .where(eq(chats.id, id))
      .returning();
    return chat;
  }

  async createAdminLog(adminId: number, action: string, details: any): Promise<AdminLog> {
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
  }
}

export const storage = new DatabaseStorage();