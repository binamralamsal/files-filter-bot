import type { HydrateFlavor } from "@grammyjs/hydrate";
import type { I18nFlavor } from "@grammyjs/i18n";
import type { Context } from "grammy";

export type BotContext = HydrateFlavor<Context & I18nFlavor>;
