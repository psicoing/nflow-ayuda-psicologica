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
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  messages: jsonb("messages").$type<Message[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emotionJournals = pgTable("emotion_journals", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  weekStart: timestamp("week_start").notNull(),
  mainThought: text("main_thought").notNull(),
  dominantEmotion: text("dominant_emotion").notNull(),
  actionTaken: text("action_taken").notNull(),
  content: text("content").notNull(),
  emotionCodes: text("emotion_codes").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export const insertEmotionJournalSchema = createInsertSchema(emotionJournals).extend({
  emotionCodes: z.array(z.string()).min(1, "Al menos un código emocional es requerido"),
  content: z.string().min(10, "La reflexión debe tener al menos 10 caracteres"),
});

export type InsertEmotionJournal = z.infer<typeof insertEmotionJournalSchema>;
export type EmotionJournal = typeof emotionJournals.$inferSelect;

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