import { pgTable, text, serial, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  messages: json("messages").$type<Message[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertChatSchema = createInsertSchema(chats);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Chat = typeof chats.$inferSelect;
