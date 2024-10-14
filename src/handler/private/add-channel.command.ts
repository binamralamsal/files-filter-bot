import { Composer } from "grammy";
import type { Message } from "grammy/types";

import type { MessageXFragment } from "@grammyjs/hydrate/out/data/message";

import { eq } from "drizzle-orm";

import { client } from "#/config/telegram-user-client";
import { db } from "#/drizzle/db";
import { filesTable } from "#/drizzle/schema";
import i18n from "#/lib/i18n";
import type { BotContext } from "#/types";
import { insertFilesInChunks } from "#/use-cases/insert-files";
import { cleanChannelID } from "#/util/clean-channel-id";
import { Commands } from "#/util/commands";
import { Logger } from "#/util/logger";

const composer = new Composer<BotContext>();

composer.command("add", async (context) => {
  const { message } = context.update;

  if (!message) return;

  const cleanedChannelId = cleanChannelID(context.match);
  if (!cleanedChannelId)
    return context.reply(context.t("pass_valid_channel_id"));

  if (
    await db.query.filesTable.findFirst({
      where: eq(filesTable.channelId, cleanedChannelId),
    })
  ) {
    return context.reply(context.t("channel_already_exists"));
  }

  const addingMessageText = context.t("adding_channel", {
    channelId: cleanedChannelId,
  });
  Logger.send(addingMessageText);
  const addingMessage = await context.reply(addingMessageText);

  let files;
  try {
    files = await addFiles(cleanedChannelId, addingMessage);
  } catch (error) {
    let errorReason = "Something happened";

    if (error instanceof Error) {
      errorReason = error.message;
    }

    const errorMessage = context.t("error_while_adding_files", {
      errorMessage: errorReason,
    });

    Logger.send(errorMessage);
    return await addingMessage.editText(errorMessage);
  }

  const addingFinishedMessage = context.t("adding_finished", {
    channelId: cleanedChannelId,
    fileLength: files.length,
  });
  Logger.send(addingFinishedMessage);
  await addingMessage.editText(addingFinishedMessage);
});

Commands.addNewCommand("add", "Adds channel to database");

export const addChannelCommand = composer;

export async function addFiles(
  channelId: string,
  addingMessage: Message.CommonMessage & MessageXFragment,
  prefix = "",
) {
  await client.connect();

  const files = [];

  const findingFilesText =
    prefix +
    "\n\n" +
    i18n.t("en", "finding_files_in_channel", {
      channelId,
    });
  addingMessage.editText(findingFilesText);
  Logger.send(findingFilesText);

  for await (const message of client.iterMessages(parseInt(channelId.trim()), {
    limit: 10000000,
  })) {
    if (!message.file?.mimeType?.startsWith("video")) continue;

    if (message.restrictionReason) {
      Logger.send(
        i18n.t("en", "restriction_error", {
          messageId: message.id,
          channelId,
          reason: message.restrictionReason?.toString(),
        }),
      );
      continue;
    }

    if (files.length !== 0 && files.length % 500 === 0) {
      const foundFilesText =
        prefix +
        "\n\n" +
        i18n.t("en", "found_files_in_channel", {
          filesCount: files.length,
          channelId,
        });
      addingMessage.editText(foundFilesText);
      Logger.send(foundFilesText);
    }

    files.push({
      messageId: message.id,
      caption: message.message || (message.file.name as string),
      channelId,
      fileSize: Math.trunc(
        parseInt(message.file.size?.toString() || "") / 1024 / 1024,
      ),
    });
  }

  if (files.length === 0)
    throw new Error("No files found in the given channel!");

  // await client.disconnect();
  await insertFilesInChunks(files);

  return files;
}
