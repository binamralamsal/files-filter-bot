import { StringSession } from "telegram/sessions";
import { z } from "zod";

import i18n from "#/lib/i18n";

const envSchema = z.object({
  BOT_TOKEN: z.string(),
  DATABASE_URL: z.string(),
  WELCOME_MESSAGE: z
    .string()
    .optional()
    .transform((value) => {
      if (value) return value.replace(/\\n/g, "\n");
      return i18n.t("en", "welcome_message_caption");
    }),
  REQUIRED_CHATS_TO_JOIN: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return [];
      return value.split(" ");
    }),
  AUTHORIZED_USERS: z
    .string()
    .min(1, "Authorized users are required to use the bot")
    .transform((value) => {
      return value.split(" ").map((v) => Number(v));
    }),
  API_ID: z.string().transform((value) => Number(value)),
  API_HASH: z.string(),
  STRING_SESSION: z
    .string()
    .trim()
    .transform((value) => new StringSession(value)),
  LOG_CHANNEL: z.string().optional(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  MEILISEARCH_HOST: z.string().default("http://localhost:7700"),
  MEILISEARCH_MASTER_KEY: z.string(),
  MEILISEARCH_INDEX: z.string().transform((value) => `${value}_files`),
  RESULTS_PER_PAGE: z.coerce.number().default(10),
  SENDALL_PER_PAGE: z.coerce.boolean().default(true),
  BLOCKED_WORDS: z
    .string()
    .default("")
    .transform((value) => value.split(" ")),
  AUTHORIZED_CHAT_IDS: z.string().transform((value) => value.split(" ")),
});

export const env = envSchema.parse(process.env);
