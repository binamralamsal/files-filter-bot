import { and, eq } from "drizzle-orm";

import { env } from "#/config/env";
import { db } from "#/drizzle/db";
import { filesTable } from "#/drizzle/schema";
import { generateFileId } from "#/lib/generate-file-id";
import { searchClient } from "#/lib/meilisearch";

export async function updateFileCaption(data: {
  channelId: string;
  messageId: number;
  caption: string;
}) {
  await db
    .update(filesTable)
    .set({ caption: data.caption })
    .where(
      and(
        eq(filesTable.channelId, data.channelId),
        eq(filesTable.messageId, data.messageId),
      ),
    );

  await searchClient.index(env.MEILISEARCH_INDEX).updateDocuments([
    {
      id: generateFileId(data.channelId, data.messageId),
      text: data.caption,
    },
  ]);
}
