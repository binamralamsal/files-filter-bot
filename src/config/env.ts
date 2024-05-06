import i18n from "#/lib/i18n";
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
    .default("")
    .transform((value) => value.split(" ")),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

export const env = envSchema.parse(process.env);
