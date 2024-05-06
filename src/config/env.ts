import i18n from "#/lib/i18n";
import { z } from "zod";

const envSchema = z.object({
  BOT_TOKEN: z.string(),
  DATABASE_URL: z.string(),
  WELCOME_MESSAGE: z
    .string()
    .nullish()
    .transform((value) => {
      if (value) return value.replace(/\\n/g, "\n");
      return i18n.t("en", "welcome_message_caption");
    }),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

export const env = envSchema.parse(process.env);
