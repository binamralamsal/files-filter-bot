import { and, eq, gte, lt, ne } from "drizzle-orm";

import { env } from "#/config/env";
import { db } from "#/drizzle/db";
import { userFilesDownloadsTable } from "#/drizzle/schema";

export function getStartAndEndOfDay() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
}

export async function cleanOldDownloads() {
  const { startOfDay } = getStartAndEndOfDay();

  await db
    .delete(userFilesDownloadsTable)
    .where(lt(userFilesDownloadsTable.downloadTime, startOfDay));
}

export async function getDownloadsToday(userId: string, queryHash: string) {
  const { startOfDay, endOfDay } = getStartAndEndOfDay();

  return db
    .select()
    .from(userFilesDownloadsTable)
    .where(
      and(
        eq(userFilesDownloadsTable.userId, userId),
        gte(userFilesDownloadsTable.downloadTime, startOfDay),
        lt(userFilesDownloadsTable.downloadTime, endOfDay),
        ne(userFilesDownloadsTable.queryHash, queryHash),
      ),
    );
}

export async function recordDownload(userId: string, queryHash: string) {
  await db
    .insert(userFilesDownloadsTable)
    .values({
      userId,
      queryHash,
      downloadTime: new Date(),
    })
    .onConflictDoNothing();
}

export async function handleDownloadLimit(userId: string, queryHash: string) {
  if (env.DOWNLOADS_PER_DAY) {
    await cleanOldDownloads();
    const downloadsToday = await getDownloadsToday(userId, queryHash);

    if (downloadsToday.length >= env.DOWNLOADS_PER_DAY) {
      return true;
    }

    await recordDownload(userId, queryHash);
  }
  return false;
}
