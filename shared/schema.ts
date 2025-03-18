import { pgTable, text, serial, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  isApproved: boolean("is_approved").notNull().default(false),
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  messages: json("messages").$type<Message[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isReviewed: boolean("is_reviewed").notNull().default(false),
  reviewedBy: serial("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
});

export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertChatSchema = createInsertSchema(chats);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Chat = typeof chats.$inferSelect;

// Roles disponibles en el sistema
export const UserRoles = {
  USER: "user",
  PROFESSIONAL: "professional",
  ADMIN: "admin",
} as const;

export type UserRole = typeof UserRoles[keyof typeof UserRoles];