import { eq } from "drizzle-orm";

import { env } from "#/config/env";
import { db } from "#/drizzle/db";
import { filesTable } from "#/drizzle/schema";
import { searchClient } from "#/lib/meilisearch";

export async function deleteFilesByChannelId(channelId: string) {
  await db.delete(filesTable).where(eq(filesTable.channelId, channelId));

  await searchClient.index(env.MEILISEARCH_INDEX).deleteDocuments({
    filter: `channelId = ${channelId}`,
  });
}
