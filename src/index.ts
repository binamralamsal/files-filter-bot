import { Bot } from "grammy";

import { autoRetry } from "@grammyjs/auto-retry";
import { hydrate } from "@grammyjs/hydrate";
import { hydrateReply, parseMode } from "@grammyjs/parse-mode";
import { run } from "@grammyjs/runner";

import { generateUpdateMiddleware } from "telegraf-middleware-console-time";

import { env } from "#/config/env";
import { handlers } from "#/handler";
import i18n from "#/lib/i18n";
import { Commands } from "#/util/commands";
import { Logger } from "#/util/logger";

import { searchClient } from "./lib/meilisearch";
import type { BotContext } from "./types";

const bot = new Bot<BotContext>(env.BOT_TOKEN);

bot.use(i18n);
bot.use(hydrate());
bot.use(hydrateReply);

bot.api.config.use(autoRetry());
bot.api.config.use(parseMode("html"));

bot.use(handlers);
await Commands.setCommands();

run(bot);
Logger.send(i18n.t("en", "bot_started"));

if (env.BOT_TOKEN !== "production") {
  bot.use(generateUpdateMiddleware());
}

await searchClient
  .index(env.MEILISEARCH_INDEX)
  .updateFilterableAttributes(["channelId", "messageId"]);

await searchClient.index(env.MEILISEARCH_INDEX).updateTypoTolerance({
  minWordSizeForTypos: {
    oneTypo: 3,
    twoTypos: 8,
  },
});
