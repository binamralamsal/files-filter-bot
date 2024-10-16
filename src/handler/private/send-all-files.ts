import { type CommandContext, InputFile } from "grammy";

import { env } from "#/config/env";
import { deleteMessageFromPrivate } from "#/queues/delete-messages";
import type { BotContext } from "#/types";
import { handleDownloadLimit } from "#/use-cases/download-manager";
import {
  generateQueryHash,
  getSearchResults,
} from "#/use-cases/get-search-results";
import { decodeString } from "#/util/base64-url";
import { timeToWords } from "#/util/time-to-words";

export async function sendAllFiles(context: CommandContext<BotContext>) {
  const [, page, data] = context.match.split("-");
  const decodedData = decodeString<string>(data, false);

  if (!context.from) return;

  const userId = String(context.from.id);
  const queryHash = generateQueryHash(decodedData);

  const limitReached = await handleDownloadLimit(userId, queryHash);
  if (limitReached) {
    return context.replyWithPhoto(
      new InputFile("src/assets/images/limit-reached.jpg"),
      { caption: context.t("downloads_limit_reached") },
    );
  }

  const results = await getSearchResults(
    decodedData,
    parseInt(page),
    env.SENDALL_PER_PAGE ? undefined : 100,
  );

  if (results.hits.length === 0) return;

  for (const file of results.hits) {
    const result = await context.api.copyMessage(
      context.chat.id,
      file.channelId,
      file.messageId,
    );

    if (env.DELETE_TIME_IN_DM) {
      deleteMessageFromPrivate({
        chatId: context.chat.id,
        messageId: result.message_id,
      });
    }
  }

  if (env.DELETE_TIME_IN_DM) {
    const warningMessage = await context.reply(
      context.t("deleting_warning", {
        time: timeToWords(env.DELETE_TIME_IN_DM),
      }),
    );

    await deleteMessageFromPrivate({
      chatId: context.chat.id,
      messageId: warningMessage.message_id,
    });
  }
}
