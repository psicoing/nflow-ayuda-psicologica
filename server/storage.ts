import { Message, User, InsertUser, Chat } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getChatHistory(userId: number): Promise<Chat[]>;
  saveChat(userId: number, messages: Message[]): Promise<Chat>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chats: Map<number, Chat>;
  sessionStore: session.Store;
  currentId: number;
  currentChatId: number;

  constructor() {
    this.users = new Map();
    this.chats = new Map();
    this.currentId = 1;
    this.currentChatId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getChatHistory(userId: number): Promise<Chat[]> {
    return Array.from(this.chats.values()).filter(
      (chat) => chat.userId === userId,
    );
  }

  async saveChat(userId: number, messages: Message[]): Promise<Chat> {
    const id = this.currentChatId++;
    const chat: Chat = {
      id,
      userId,
      messages,
      createdAt: new Date(),
    };
    this.chats.set(id, chat);
    return chat;
  }
}

export const storage = new MemStorage();
