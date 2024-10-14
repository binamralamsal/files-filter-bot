import { env } from "#/config/env";
import { db } from "#/drizzle/db";
import { filesTable } from "#/drizzle/schema";
import { searchClient } from "#/lib/meilisearch";

export async function deleteAllFiles() {
  await db.delete(filesTable);
  await searchClient.index(env.MEILISEARCH_INDEX).deleteAllDocuments();
}
