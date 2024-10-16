import { Composer } from "grammy";

import { env } from "#/config/env";
import { deleteMessageFromGroup } from "#/queues/delete-messages";
import type { BotContext } from "#/types";
import { getSearchResultsMessageText } from "#/use-cases/get-search-results";

const composer = new Composer<BotContext>();

composer.on(["message:text"], async (context) => {
  const chatId = context.update.message.chat.id;

  if (!isAuthorizedChat(chatId)) {
    return handleUnauthorizedChat(context);
  }

  if (!isSearchQueryValid(context.message.text.toLowerCase())) return;

  const { results, inlineKeyboard } = await getSearchResultsMessageText({
    query: context.message!.text,
    username: context.me.username,
  });

  if (results) {
    const result = await context.reply(results, {
      reply_markup: inlineKeyboard,
      reply_parameters: { message_id: context.msgId },
      link_preview_options: { is_disabled: true },
    });

    await deleteMessageFromGroup({ chatId, messageId: context.msgId });
    await deleteMessageFromGroup({ chatId, messageId: result.message_id });
  }
});

function isSearchQueryValid(searchQuery: string): boolean {
  if (env.BLOCKED_WORDS.length === 0) return true;
  return !env.BLOCKED_WORDS.some((word) =>
    searchQuery.toLowerCase().split(" ").includes(word.toLowerCase()),
  );
}

function isAuthorizedChat(chatId: number): boolean {
  return env.AUTHORIZED_CHAT_IDS.includes(String(chatId));
}

async function handleUnauthorizedChat(context: BotContext): Promise<void> {
  await context.reply(
    "Suno Group ke Logo Is Group Ka Owner Bhen ka Loda hai... Asli AK IMAX Join kro @akimax_02",
  );
  await context.leaveChat();
}

export const sendFilsList = composer;
