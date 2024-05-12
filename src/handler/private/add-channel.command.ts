import { db } from "#/drizzle/db";
import { filesTable } from "#/drizzle/schema";
import type { BotContext } from "#/types";
import { Commands } from "#/util/commands";
import { Logger } from "#/util/logger";
import { eq } from "drizzle-orm";
import { Composer } from "grammy";
import { client } from "#/config/telegram-user-client";
import i18n from "#/lib/i18n";

const composer = new Composer<BotContext>();

composer.command("add", async (context) => {
  const { message } = context.update;

  if (!message) return;

  if (
    await db.query.filesTable.findFirst({
      where: eq(filesTable.channelId, context.match),
    })
  ) {
    return context.reply(context.t("channel_already_exists"));
  }

  const hasNumber = /\d/;
  if (!hasNumber.test(context.match))
    return context.reply(context.t("invalid_channel_id"));

  const addingMessageText = context.t("adding_channel", {
    channelId: context.match,
  });
  Logger.send(addingMessageText);
  const addingMessage = await context.reply(addingMessageText);

  let files;
  try {
    files = await addFiles(context.match, addingMessage);
  } catch (error) {
    let errorReason = "Something happened";
    if (error instanceof Error) {
      errorReason = error.message;
    }

    const errorMessage = context.t("error_while_adding_files", {
      errorMessage: errorReason,
    });

    return await addingMessage.editText(errorMessage);
  }

  const addingFinishedMessage = context.t("adding_finished", {
    channelId: context.match,
    fileLength: files.length,
  });
  Logger.send(addingFinishedMessage);
  await addingMessage.editText(addingFinishedMessage);
});

Commands.addNewCommand("add", "Adds channel to database");

export const addChannelCommand = composer;

async function addFiles(channelId: string, addingMessage: any) {
  await client.connect();

  const files = [];

  addingMessage.editText(
    i18n.t("en", "finding_files_in_channel", { channelId })
  );

  for await (const message of client.iterMessages(parseInt(channelId), {
    limit: 10000000,
  })) {
    if (!message.file?.mimeType?.startsWith("video")) continue;

    if (message.restrictionReason) {
      Logger.send(
        i18n.t("en", "restriction_error", {
          messageId: message.id,
          channelId,
          reason: message.restrictionReason?.toString(),
        })
      );
      continue;
    }

    if (files.length !== 0 && files.length % 500 === 0) {
      addingMessage.editText(
        i18n.t("en", "found_files_in_channel", {
          filesCount: files.length,
          channelId,
        })
      );
    }

    files.push({
      messageId: message.id,
      caption: message.message || message.file.name,
      channelId,
      fileSize: Math.trunc(
        parseInt(message.file.size?.toString() || "") / 1024 / 1024
      ),
    });
  }

  await client.disconnect();
  await db.insert(filesTable).values(files);

  return files;
}
