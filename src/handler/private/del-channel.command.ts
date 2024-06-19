import { Composer } from "grammy";
import type { BotContext } from "#/types";
import { db } from "#/drizzle/db";
import { filesTable } from "#/drizzle/schema";
import { count, eq } from "drizzle-orm";
import { Commands } from "#/util/commands";
import { Logger } from "#/util/logger";
import { cleanChannelID } from "#/util/clean-channel-id";

const composer = new Composer<BotContext>();
composer.command("del", async (context) => {
  const { message } = context.update;

  if (!message) return;

  const cleanedChannelId = cleanChannelID(context.match);
  if (!cleanedChannelId) context.reply(context.t("pass_valid_channel_id"));

  const { id: chatId } = message.chat;

  const { count: filesCount } = (
    await db.select({ count: count() }).from(filesTable).limit(1)
  )[0];
  if (filesCount === 0) return context.reply(context.t("no_channels_found"));

  const fileFromSameChannel = await db.query.filesTable.findFirst({
    where: eq(filesTable.channelId, cleanedChannelId),
  });
  if (!fileFromSameChannel) {
    return await context.reply(
      context.t("channel_not_found_delete", {
        channelId: cleanedChannelId,
      }),
    );
  }

  const deletingMessageText = context.t("deleting_channel", {
    channelId: cleanedChannelId,
    chatId,
  });
  Logger.send(deletingMessageText);
  const deletingMessage = await context.reply(deletingMessageText);

  try {
    await db
      .delete(filesTable)
      .where(eq(filesTable.channelId, cleanedChannelId));
  } catch (error) {
    let errorReason = "Something happened";
    if (error instanceof Error) {
      errorReason = error.message;
    }
    const errorMessage = context.t("error_while_deleting_files", {
      errorMessage: errorReason,
    });

    Logger.send(errorMessage);
    return await deletingMessage.editText(errorMessage);
  }

  const deletingFinishedMessage = context.t("deleting_finished", {
    channelId: cleanedChannelId,
  });
  Logger.send(deletingFinishedMessage);
  await deletingMessage.editText(deletingFinishedMessage);
});

Commands.addNewCommand("del", "Deletes specific channel from database");

export const deleteChannelCommand = composer;
