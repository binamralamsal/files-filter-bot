import { type CommandContext, InputFile } from "grammy";

import { env } from "#/config/env";
import type { BotContext } from "#/types";
import { handleDownloadLimit } from "#/use-cases/download-manager";
import {
  generateQueryHash,
  getSearchResults,
} from "#/use-cases/get-search-results";
import { decodeString } from "#/util/base64-url";

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
    await context.api.copyMessage(
      context.chat.id,
      file.channelId,
      file.messageId,
    );
  }
}
