import { type CallbackQueryContext, InlineKeyboard } from "grammy";

import type { BotContext } from "#/types";
import { getSearchResults } from "#/use-cases/get-search-results";
import { decodeString, encodeString } from "#/util/base64-url";

export async function showPagesList(context: CallbackQueryContext<BotContext>) {
  try {
    if (!context.update.callback_query.data) return;
    const [, encodedData] = context.update.callback_query.data.split(" ");

    const decodedData = decodeString<{ page: number; query: string }>(
      encodedData,
    );
    const data = await getSearchResults(decodedData.query, decodedData.page);

    // @ts-expect-error idk how to get grammy types
    const totalPages = data.totalPages;

    if (totalPages === 1)
      return await context.answerCallbackQuery({
        text: `Pages ${decodedData.page}/${totalPages}`,
        show_alert: true,
      });

    const inlineKeyboard = new InlineKeyboard();

    for (let i = 1; i <= totalPages; i++) {
      const rawInlineKeyboard = inlineKeyboard.inline_keyboard;
      if (rawInlineKeyboard[rawInlineKeyboard.length - 1].length === 8)
        inlineKeyboard.row();

      inlineKeyboard.text(
        `${i}`,
        `gopage ${encodeString({ page: i, query: decodedData.query })}`,
      );
    }

    await context.editMessageReplyMarkup({ reply_markup: inlineKeyboard });
    await context.answerCallbackQuery();
  } catch {
    await context.answerCallbackQuery({
      show_alert: true,
      text: "Search results expired or not found! Please try searching again",
    });
  }
}
