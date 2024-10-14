import { env } from "#/config/env";
import { db } from "#/drizzle/db";
import { filesTable } from "#/drizzle/schema";
import { generateFileId } from "#/lib/generate-file-id";
import { searchClient } from "#/lib/meilisearch";

type File = {
  messageId: number;
  caption: string;
  channelId: string;
  fileSize: number;
};

export type FileResult = {
  id: string;
  text: string;
  channelId: string;
  messageId: number;
  fileSize: number;
};

export async function insertFiles(files: File[]) {
  await db.insert(filesTable).values(files);

  const transformedFiles = files.map((file) => ({
    id: generateFileId(file.channelId, file.messageId),
    text: file.caption,
    channelId: file.channelId,
    messageId: file.messageId,
    fileSize: file.fileSize,
  }));

  await searchClient
    .index(env.MEILISEARCH_INDEX)
    .addDocuments(transformedFiles, { primaryKey: "id" });
}

export async function insertFilesInChunks(files: File[], chunkSize = 10000) {
  for (let i = 0; i < files.length; i += chunkSize) {
    const chunk = files.slice(i, i + chunkSize);
    await insertFiles(chunk);
  }
}
