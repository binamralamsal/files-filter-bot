import { db } from "#/drizzle/db";
import { filesTable } from "#/drizzle/schema";
import type { BotContext } from "#/types";
import { eq } from "drizzle-orm";
import { Composer } from "grammy";

const composer = new Composer<BotContext>();
composer.on(
  ["channel_post:document", "channel_post:video"],
  async (context) => {
    const {
      message_id: messageId,
      chat,
      caption,
      document,
      video,
    } = context.update.channel_post;

    const channelId = chat.id;

    const file = await db.query.filesTable.findFirst({
      where: eq(filesTable.channelId, String(channelId)),
    });
    if (!file) return;

    const fileSizeInBytes = document?.file_size || video?.file_size;
    if (!fileSizeInBytes) return;

    const fileSizeInMb = Math.trunc(fileSizeInBytes / 1024 / 1024);

    const fileCaption = caption || document?.file_name || video?.file_name;
    if (!fileCaption) return;

    await db.insert(filesTable).values({
      messageId,
      channelId: String(channelId),
      fileSize: fileSizeInMb,
      caption: fileCaption,
    });
  }
);

export const addNewFiles = composer;
