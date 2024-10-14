import type { Context } from "grammy";

import type { HydrateFlavor } from "@grammyjs/hydrate";
import type { I18nFlavor } from "@grammyjs/i18n";
import type { ParseModeFlavor } from "@grammyjs/parse-mode";

export type BotContext = ParseModeFlavor<HydrateFlavor<Context & I18nFlavor>>;
