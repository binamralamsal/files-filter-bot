import { Composer } from "grammy";

import { env } from "#/config/env.js";
import type { BotContext } from "#/types";

import { showPagesList } from "./show-pages-list";
import { updatePage } from "./update-page";

const composer = new Composer<BotContext>();
composer.on("callback_query", async (context) => {
  const { data, message, from } = context.update.callback_query;

  if (!data) return;

  if (
    !env.AUTHORIZED_USERS.includes(from.id) &&
    from.id !== message?.reply_to_message?.from?.id
  )
    return await context.answerCallbackQuery({
      show_alert: true,
      text: "This results are not for you! Search it yourself",
    });

  // @ts-expect-error idk how to get grammy types
  if (data.startsWith("next")) return await updatePage(context, "next");
  // @ts-expect-error idk how to get grammy types
  if (data.startsWith("back")) return await updatePage(context, "back");
  // @ts-expect-error idk how to get grammy types
  if (data.startsWith("gopage")) return await updatePage(context, "current");
  // @ts-expect-error idk how to get grammy types
  if (data.startsWith("pages")) return await showPagesList(context);
});

export const callbacks = composer;
