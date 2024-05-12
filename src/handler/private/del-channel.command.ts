import { Composer } from "grammy";
import type { BotContext } from "#/types";
import { db } from "#/drizzle/db";
import { filesTable } from "#/drizzle/schema";
import { count, eq } from "drizzle-orm";
import { Commands } from "#/util/commands";
import { Logger } from "#/util/logger";

const composer = new Composer<BotContext>();
composer.command("del", async (context) => {
  const { message } = context.update;

  if (!message) return;

  const { id: chatId } = message.chat;

  const { count: filesCount } = (
    await db.select({ count: count() }).from(filesTable).limit(1)
  )[0];
  if (filesCount === 0) return context.reply(context.t("no_channels_found"));

  const fileFromSameChannel = await db.query.filesTable.findFirst({
    where: eq(filesTable.channelId, context.match),
  });
  if (!fileFromSameChannel) {
    context.reply(
      context.t("channel_not_found_delete", {
        channelId: context.match,
      })
    );
  }

  const deletingMessageText = context.t("deleting_channel", {
    channelId: context.match,
    chatId,
  });
  Logger.send(deletingMessageText);
  const deletingMessage = await context.reply(deletingMessageText);

  try {
    await db.delete(filesTable).where(eq(filesTable.channelId, context.match));
  } catch (error) {
    let errorReason = "Something happened";
    if (error instanceof Error) {
      errorReason = error.message;
    }
    const errorMessage = context.t("error_while_deleting_files", {
      errorMessage: errorReason,
    });

    return await deletingMessage.editText(errorMessage);
  }

  const deletingFinishedMessage = context.t("deleting_finished", {
    channelId: context.match,
  });
  Logger.send(deletingFinishedMessage);
  await deletingMessage.editText(deletingFinishedMessage);
});

Commands.addNewCommand("del", "Deletes specific channel from database");

export const deleteChannelCommand = composer;
