import { type CallbackQueryContext, InlineKeyboard } from "grammy";

import type { BotContext } from "#/types";
import { getSearchResults } from "#/use-cases/get-search-results";

export async function showPagesList(context: CallbackQueryContext<BotContext>) {
  try {
    if (
      !context.update.callback_query.data ||
      !context.update.callback_query.message?.text
    )
      return;

    const query =
      context.update.callback_query.message.text.match(/\|(.*?)\|/s)?.[1];
    if (!query) return;

    const [, encodedData] = context.update.callback_query.data.split(" ");
    const page = parseInt(encodedData);

    const data = await getSearchResults(query, page);

    // @ts-expect-error idk how to get grammy types
    const totalPages = data.totalPages;

    if (totalPages === 1)
      return await context.answerCallbackQuery({
        text: `Pages ${page}/${totalPages}`,
        show_alert: true,
      });

    const inlineKeyboard = new InlineKeyboard();

    for (let i = 1; i <= totalPages; i++) {
      const rawInlineKeyboard = inlineKeyboard.inline_keyboard;
      if (rawInlineKeyboard[rawInlineKeyboard.length - 1].length === 8)
        inlineKeyboard.row();

      inlineKeyboard.text(`${i}`, `gopage ${i}`);
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
