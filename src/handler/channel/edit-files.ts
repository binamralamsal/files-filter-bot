import { db } from "#/drizzle/db";
import { filesTable, usersTable } from "#/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { Composer } from "grammy";

const composer = new Composer();
composer.on(
  ["edited_channel_post:document", "edited_channel_post:video"],
  async (context) => {
    const {
      message_id: messageId,
      chat,
      caption,
      document,
      video,
    } = context.update.edited_channel_post;
    const channelId = chat.id;

    const fileCaption = caption || document?.file_name || video?.file_name;
    if (!fileCaption) return;

    await db
      .update(filesTable)
      .set({ caption: fileCaption })
      .where(
        and(
          eq(filesTable.channelId, String(channelId)),
          eq(filesTable.messageId, messageId)
        )
      );
  }
);

export const editFiles = composer;
