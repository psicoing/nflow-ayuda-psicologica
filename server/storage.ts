import { Message, User, InsertUser, Chat, users, chats } from "@shared/schema";
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

  // Nuevos métodos para el panel de administración
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
}

export const storage = new DatabaseStorage();