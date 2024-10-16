import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const filesTable = pgTable(
  "files",
  {
    id: serial("id").primaryKey(),
    messageId: integer("message_id").notNull(),
    channelId: varchar("channel_id").notNull(),
    caption: text("caption"),
    fileSize: integer("file_size").notNull(),
  },
  (table) => ({
    captionIdx: index("caption_idx").on(table.caption),
  }),
);

export const usersTable = pgTable("users", {
  chatId: varchar("chat_id").unique().notNull(),
  name: varchar("name").notNull(),
  username: varchar("username"),
});

export const userFilesDownloadsTable = pgTable(
  "user_file_downloads",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").notNull(),
    queryHash: varchar("query_hash").notNull().unique(),
    downloadTime: timestamp("download_time", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      uniqueUserQuery: uniqueIndex("unique_user_query").on(
        table.userId,
        table.queryHash,
      ),
    };
  },
);
