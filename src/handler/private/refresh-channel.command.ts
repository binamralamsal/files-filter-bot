import { Composer } from "grammy";

import { count, eq } from "drizzle-orm";

import { db } from "#/drizzle/db";
import { filesTable } from "#/drizzle/schema";
import type { BotContext } from "#/types";
import { deleteFilesByChannelId } from "#/use-cases/delete-files-by-channel-id";
import { cleanChannelID } from "#/util/clean-channel-id";
import { Commands } from "#/util/commands";
import { Logger } from "#/util/logger";

import { addFiles } from "./add-channel.command";

const composer = new Composer<BotContext>();
composer.command("refresh", async (context) => {
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
      context.t("channel_not_found_refresh", {
        channelId: cleanedChannelId,
      }),
    );
  }
  let refreshingMessageText = context.t("refreshing_channel_deleting", {
    channelId: cleanedChannelId,
    chatId,
  });

  Logger.send(refreshingMessageText);
  const refreshingMessage = await context.reply(refreshingMessageText);

  try {
    await deleteFilesByChannelId(cleanedChannelId);
  } catch (error) {
    let errorReason = "Something happened";
    if (error instanceof Error) {
      errorReason = error.message;
    }
    const errorMessage = context.t("error_while_deleting_files", {
      errorMessage: errorReason,
    });

    Logger.send(errorMessage);
    return await refreshingMessage.editText(errorMessage);
  }

  refreshingMessageText = context.t("refreshing_channel_adding", {
    channelId: cleanedChannelId,
  });
  Logger.send(refreshingMessageText);
  await refreshingMessage.editText(refreshingMessageText);

  try {
    await addFiles(cleanedChannelId, refreshingMessage, refreshingMessageText);
  } catch (error) {
    let errorReason = "Something happened";
    if (error instanceof Error) {
      errorReason = error.message;
    }

    const errorMessage = context.t("error_while_adding_files", {
      errorMessage: errorReason,
    });

    Logger.send(errorMessage);
    return await refreshingMessage.editText(errorMessage);
  }

  const deletingFinishedMessage = context.t("refreshing_finished", {
    channelId: cleanedChannelId,
  });
  Logger.send(deletingFinishedMessage);
  await refreshingMessage.editText(deletingFinishedMessage);
});

Commands.addNewCommand("refresh", "Refreshes specific channel from database");

export const refreshChannelCommand = composer;
