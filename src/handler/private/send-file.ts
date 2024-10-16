import { type CommandContext, InputFile } from "grammy";

import type { BotContext } from "#/types";
import { handleDownloadLimit } from "#/use-cases/download-manager";
import { decodeString } from "#/util/base64-url";

export async function sendFiles(context: CommandContext<BotContext>) {
  const [, data] = context.match.split("-");
  const decodedData = decodeString<{ q: string; m: number; c: string }>(data);

  if (!context.from) return;

  const userId = String(context.from.id);

  const limitReached = await handleDownloadLimit(userId, decodedData.q);
  if (limitReached) {
    return context.replyWithPhoto(
      new InputFile("src/assets/images/limit-reached.jpg"),
      { caption: context.t("downloads_limit_reached") },
    );
  }

  await context.api.copyMessage(context.chat.id, decodedData.c, decodedData.m);
}
