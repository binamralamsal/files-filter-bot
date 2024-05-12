import { db } from "#/drizzle/db";
import { usersTable } from "#/drizzle/schema";
import type { BotContext } from "#/types";
import { Commands } from "#/util/commands";
import { Logger } from "#/util/logger";
import { eq } from "drizzle-orm";
import { Composer } from "grammy";

const composer = new Composer<BotContext>();

composer.command("broadcast", async (context) => {
  const { message } = context.update;

  const messageToForward = message?.reply_to_message?.message_id || null;
  if (!messageToForward || !message?.reply_to_message?.message_id) {
    return context.reply(context.t("no_message_to_broadcast"));
  }

  const users = await db.query.usersTable.findMany();

  if (users.length === 0) {
    return context.reply(context.t("no_users_to_broadcast"));
  }

  const broadcastingMessage = context.t("broadcasting_message", {
    length: users.length,
  });
  Logger.send(broadcastingMessage);
  const { message_id: messageId } = await context.reply(broadcastingMessage);

  let failedCount = 0;
  for (const user of users) {
    try {
      await context.api.copyMessage(
        user.chatId,
        message.chat.id,
        messageToForward
      );
    } catch (error) {
      let errorMessage = "Something Occured!";
      if (error instanceof Error) errorMessage = "Something Occured";

      failedCount++;

      Logger.send(
        `Failed to copy message to user ${user.chatId}: ${errorMessage}`
      );
      await db.delete(usersTable).where(eq(usersTable.chatId, user.chatId));
      continue;
    }
  }

  const broadcastCompletedMessage = context.t("broadcast_complete", {
    length: users.length,
    successCount: users.length - failedCount,
    failedCount,
  });
  Logger.send(broadcastCompletedMessage);
  await context.api.editMessageText(
    message.chat.id,
    messageId,
    broadcastCompletedMessage
  );
});

Commands.addNewCommand(
  "broadcast",
  "Broadcast a message to all users (Mention a message to broadcast)"
);

export const broadcastCommand = composer;
