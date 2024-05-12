import i18n from "#/lib/i18n";
import { StringSession } from "telegram/sessions";
import { z } from "zod";

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
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

export const env = envSchema.parse(process.env);
