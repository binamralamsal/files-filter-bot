import type { CallbackQueryContext } from "grammy";

import type { BotContext } from "#/types";
import { getSearchResultsMessageText } from "#/use-cases/get-search-results";
import { decodeString } from "#/util/base64-url";

export async function updatePage(
  context: CallbackQueryContext<BotContext>,
  type: "back" | "next" | "current",
) {
  try {
    if (!context.update.callback_query.data) return;
    const [, data] = context.update.callback_query.data.split(" ");

    const queryData = decodeString<{ page: number; query: string }>(data);

    const page =
      type === "back"
        ? queryData.page - 1
        : type === "next"
          ? queryData.page + 1
          : queryData.page;

    const { results, inlineKeyboard } = await getSearchResultsMessageText({
      page,
      query: queryData.query,
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
