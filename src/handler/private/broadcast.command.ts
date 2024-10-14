import { Composer } from "grammy";

import { eq } from "drizzle-orm";

import { db } from "#/drizzle/db";
import { usersTable } from "#/drizzle/schema";
import type { BotContext } from "#/types";
import { Commands } from "#/util/commands";
import { formatDuration } from "#/util/format-duration";
import { Logger } from "#/util/logger";

const composer = new Composer<BotContext>();

composer.command("broadcast", async (context) => {
  const { message } = context.update;

  const messageToForward = message?.reply_to_message?.message_id;
  if (!messageToForward || !message) {
    return context.reply(context.t("no_message_to_broadcast"));
  }

  const users = await db.query.usersTable.findMany();

  if (users.length === 0) {
    return context.reply(context.t("no_users_to_broadcast"));
  }

  const broadcastingMessageText = context.t("broadcasting_message", {
    length: users.length,
  });
  Logger.send(broadcastingMessageText);
  const broadcastingMessage = await context.reply(broadcastingMessageText);

  let unknownErrorCount = 0;
  let blockedCount = 0;
  let doneCount = 0;

  const startTime = new Date();
  let endTime: Date;

  for (const user of users) {
    try {
      await context.api.copyMessage(
        user.chatId,
        message.chat.id,
        messageToForward,
      );
    } catch (error) {
      let errorMessage = "Something Occured!";
      if (error instanceof Error) errorMessage = error.message;

      if (error instanceof Error && error.message.includes("blocked")) {
        blockedCount++;
      } else {
        unknownErrorCount++;
      }

      Logger.send(
        `Failed to copy message to user ${user.chatId}: ${errorMessage}`,
      );

      await db.delete(usersTable).where(eq(usersTable.chatId, user.chatId));
      continue;
    } finally {
      doneCount++;

      endTime = new Date();

      const doneTime = endTime.getTime() - startTime.getTime();
      const totalEstimatedTime = (doneTime / doneCount) * users.length;
      const estimatedTimeRemaining = totalEstimatedTime - doneTime;

      if (doneCount % 50 === 0) {
        const broadcastingProgressMessageText = context.t(
          "broadcasting_progress",
          {
            length: users.length,
            successCount: doneCount - unknownErrorCount - blockedCount,
            blockedCount,
            unknownErrorCount,
            estimatedTime: formatDuration(estimatedTimeRemaining),
            doneCount,
          },
        );

        Logger.send(broadcastingProgressMessageText);
        await broadcastingMessage.editText(broadcastingProgressMessageText);
      }
    }
  }

  endTime = new Date();

  const broadcastCompletedMessage = context.t("broadcast_complete", {
    length: users.length,
    successCount: users.length - unknownErrorCount - blockedCount,
    blockedCount,
    doneCount,
    unknownErrorCount,
    time: formatDuration(endTime.getTime() - startTime.getTime()),
  });
  Logger.send(broadcastCompletedMessage);
  await broadcastingMessage.editText(broadcastCompletedMessage);
});

Commands.addNewCommand(
  "broadcast",
  "Broadcast a message to all users (Mention a message to broadcast)",
);

export const broadcastCommand = composer;
