import { TelegramClient } from "telegram";
import { LogLevel } from "telegram/extensions/Logger";

import { env } from "./env";

export const client = new TelegramClient(
  env.STRING_SESSION,
  env.API_ID,
  env.API_HASH,
  {
    connectionRetries: 5,
  },
);

client.setLogLevel(
  env.NODE_ENV === "development" ? LogLevel.ERROR : LogLevel.NONE,
);
