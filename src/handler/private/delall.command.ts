import { Composer } from "grammy";

import { count } from "drizzle-orm";

import { db } from "#/drizzle/db";
import { filesTable } from "#/drizzle/schema";
import type { BotContext } from "#/types";
import { deleteAllFiles } from "#/use-cases/delete-all-files";
import { Commands } from "#/util/commands";
import { Logger } from "#/util/logger";

const composer = new Composer<BotContext>();
// TODO: Ask for confirmations before deleting all channels

composer.command("delall", async (context) => {
  const { message } = context.update;
  if (!message) return;

  const { id: chatId } = message.chat;

  const { count: filesCount } = (
    await db.select({ count: count() }).from(filesTable).limit(1)
  )[0];
  if (filesCount === 0) return context.reply(context.t("no_channels_found"));

  const deletingMessageText = context.t("deleting_all_channels", {
    chatId,
  });
  Logger.send(deletingMessageText);
  const deletingMessage = await context.reply(deletingMessageText);

  try {
    await deleteAllFiles();
  } catch (error) {
    let errorReason = "Something happened";
    if (error instanceof Error) errorReason = error.message;

    const errorMessage = context.t("error_while_deleting_files", {
      errorMessage: errorReason,
    });

    Logger.send(errorMessage);
    await deletingMessage.editText(errorMessage);
  }

  const deletingFinishedMessage = context.t("deleting_all_finished");
  Logger.send(deletingFinishedMessage);
  await deletingMessage.editText(deletingFinishedMessage);
});

Commands.addNewCommand("delall", "Deletes all channel from database");

export const delallCommand = composer;
