import { pgTable, text, serial, timestamp, boolean, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  messageCount: integer("message_count").notNull().default(0),
  subscriptionId: text("subscription_id"),
  subscriptionStatus: text("subscription_status").default("inactive"),
  subscriptionProvider: text("subscription_provider"),
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  messages: jsonb("messages").$type<Message[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export const insertUserSchema = createInsertSchema(users);
export const insertChatSchema = createInsertSchema(chats);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Chat = typeof chats.$inferSelect;

export const UserRoles = {
  USER: "user",
  PROFESSIONAL: "professional",
  ADMIN: "admin",
} as const;

export type UserRole = typeof UserRoles[keyof typeof UserRoles];

export const MAX_FREE_MESSAGES = 3;