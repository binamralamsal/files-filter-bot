import type { CommandContext } from "grammy";

import type { BotContext } from "#/types";
import { decodeString } from "#/util/base64-url";

export async function sendFiles(context: CommandContext<BotContext>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, data] = context.match.split("-");
  const decodedData = decodeString<{ q: string; m: number; c: string }>(data);

  await context.api.copyMessage(context.chat.id, decodedData.c, decodedData.m);
}
