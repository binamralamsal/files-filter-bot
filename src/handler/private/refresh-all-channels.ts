import { Composer } from "grammy";

import { count } from "drizzle-orm";

import { db } from "#/drizzle/db";
import { filesTable } from "#/drizzle/schema";
import type { BotContext } from "#/types";
import { deleteAllFiles } from "#/use-cases/delete-all-files";
import { Commands } from "#/util/commands";
import { Logger } from "#/util/logger";

import { addFiles } from "./add-channel.command";

const composer = new Composer<BotContext>();
composer.command("refreshall", async (context) => {
  const { message } = context.update;

  if (!message) return;

  const { id: chatId } = message.chat;

  const { count: filesCount } = (
    await db.select({ count: count() }).from(filesTable).limit(1)
  )[0];
  if (filesCount === 0) return context.reply(context.t("no_channels_found"));

  const channels = (
    await db
      .selectDistinct({ channelId: filesTable.channelId })
      .from(filesTable)
  ).map((v) => v.channelId);

  let refreshingMessageText = context.t("refreshing_all_channels_deleting", {
    totalChannels: channels.length,
    chatId,
  });

  Logger.send(refreshingMessageText);
  const refreshingMessage = await context.reply(refreshingMessageText);

  try {
    await deleteAllFiles();
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

  try {
    for (const [index, channel] of channels.entries()) {
      refreshingMessageText = context.t("refreshing_all_channels_adding", {
        channelId: channel,
        remainingChannels: index + 1,
        totalChannels: channels.length,
      });
      Logger.send(refreshingMessageText);
      await refreshingMessage.editText(refreshingMessageText);

      await addFiles(channel, refreshingMessage, refreshingMessageText);
    }
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

  const refreshingFinishedMessage = context.t("refreshing_all_finished", {
    totalChannels: channels.length,
  });
  Logger.send(refreshingFinishedMessage);
  await refreshingMessage.editText(refreshingFinishedMessage);
});

Commands.addNewCommand("refresh", "Refreshes specific channel from database");

export const refreshAllChannelsCommand = composer;
