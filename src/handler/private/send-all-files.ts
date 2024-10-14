import type { CommandContext } from "grammy";

import { env } from "#/config/env";
import type { BotContext } from "#/types";
import { getSearchResults } from "#/use-cases/get-search-results";
import { decodeString } from "#/util/base64-url";

export async function sendAllFiles(context: CommandContext<BotContext>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, page, data] = context.match.split("-");
  const decodedData = decodeString<string>(data, false);

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
