import { Bot } from "grammy";
import { run } from "@grammyjs/runner";
import { hydrate } from "@grammyjs/hydrate";
import { autoRetry } from "@grammyjs/auto-retry";
import { hydrateReply, parseMode } from "@grammyjs/parse-mode";
import { generateUpdateMiddleware } from "telegraf-middleware-console-time";

import type { BotContext } from "./types";

import i18n from "#/lib/i18n";
import { env } from "#/config/env";
import { handlers } from "#/handler";
import { Logger } from "#/util/logger";
import { Commands } from "#/util/commands";

const bot = new Bot<BotContext>(env.BOT_TOKEN);

bot.use(i18n);
bot.use(hydrate());
/* @ts-ignore */
bot.use(hydrateReply);

bot.api.config.use(autoRetry());
bot.api.config.use(parseMode("MarkdownV2"));

bot.use(handlers);
await Commands.setCommands();
console.log(env.WELCOME_MESSAGE);

run(bot);
Logger.send(i18n.t("en", "bot_started"));

if (env.BOT_TOKEN !== "production") {
  bot.use(generateUpdateMiddleware());
}
