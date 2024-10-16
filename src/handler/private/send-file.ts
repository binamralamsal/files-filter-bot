import { type CommandContext, InputFile } from "grammy";

import { env } from "#/config/env";
import { deleteMessageFromPrivate } from "#/queues/delete-messages";
import type { BotContext } from "#/types";
import { handleDownloadLimit } from "#/use-cases/download-manager";
import { decodeString } from "#/util/base64-url";
import { timeToWords } from "#/util/time-to-words";
import { toFancyText } from "#/util/to-fancy-text";

export async function sendFiles(context: CommandContext<BotContext>) {
  const [, data] = context.match.split("-");
  const decodedData = decodeString<{ q: string; m: number; c: string }>(data);

  if (!context.from) return;

  const userId = String(context.from.id);

  const limitReached = await handleDownloadLimit(userId, decodedData.q);
  if (limitReached) {
    return context.replyWithPhoto(
      new InputFile("src/assets/images/limit-reached.jpg"),
      { caption: toFancyText(context.t("downloads_limit_reached")) },
    );
  }

  const fileMessage = await context.api.copyMessage(
    context.chat.id,
    decodedData.c,
    decodedData.m,
  );

  if (env.DELETE_TIME_IN_DM) {
    const warningMessage = await context.reply(
      context.t("deleting_warning", {
        time: timeToWords(env.DELETE_TIME_IN_DM),
      }),
    );

    await deleteMessageFromPrivate({
      chatId: context.chat.id,
      messageId: fileMessage.message_id,
    });
    await deleteMessageFromPrivate({
      chatId: context.chat.id,
      messageId: warningMessage.message_id,
    });
  }
}
