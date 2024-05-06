import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const filesTable = pgTable("files", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull(),
  channelId: varchar("channel_id").notNull(),
  caption: text("caption"),
  fileSize: integer("file_size").notNull(),
});

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  chatId: varchar("chat_id").notNull(),
  name: varchar("name").notNull(),
  username: varchar("username"),
});
