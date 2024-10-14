import { Bot } from "grammy";

import type { BotContext } from "../types.ts";
import { env } from "./env.ts";

export const bot = new Bot<BotContext>(env.BOT_TOKEN);
