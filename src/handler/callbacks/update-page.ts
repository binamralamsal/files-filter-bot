import type { CallbackQueryContext } from "grammy";

import type { BotContext } from "#/types";
import { getSearchResultsMessageText } from "#/use-cases/get-search-results";

export async function updatePage(
  context: CallbackQueryContext<BotContext>,
  type: "back" | "next" | "current",
) {
  try {
    if (
      !context.update.callback_query.data ||
      !context.update.callback_query.message?.text
    )
      return;

    const query =
      context.update.callback_query.message.text.match(/\|(.*?)\|/s)?.[1];
    if (!query) return;

    const [, data] = context.update.callback_query.data.split(" ");
    const currentPage = parseInt(data);

    const page =
      type === "back"
        ? currentPage - 1
        : type === "next"
          ? currentPage + 1
          : currentPage;

    const { results, inlineKeyboard } = await getSearchResultsMessageText({
      page,
      query,
      username: context.me.username,
    });

    if (!results) return;

    await context.editMessageText(results, {
      reply_markup: inlineKeyboard,
      link_preview_options: { is_disabled: true },
    });
    await context.answerCallbackQuery();
  } catch {
    await context.answerCallbackQuery({
      show_alert: true,
      text: "Search results expired or not found! Please try searching again",
    });
  }
}
