import { I18n } from "@grammyjs/i18n";

import type { BotContext } from "../types";

const i18n = new I18n<BotContext>({
  directory: "locales",
  useSession: true,
  defaultLocale: "en",
});

export default i18n;
