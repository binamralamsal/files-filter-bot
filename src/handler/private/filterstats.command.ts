import { db } from "#/drizzle/db";
import { filesTable } from "#/drizzle/schema";
import type { BotContext } from "#/types";
import { Commands } from "#/util/commands";
import { Logger } from "#/util/logger";
import { count } from "drizzle-orm";
import { Composer } from "grammy";

const composer = new Composer<BotContext>();
composer.command("filterstats", async (context) => {
  const { message } = context.update;

  const { count: filesCount } = (
    await db.select({ count: count() }).from(filesTable).limit(1)
  )[0];
  if (filesCount === 0) return context.reply(context.t("no_channels_found"));

  let infoMessage = "> All channels added to this group are:\n";

  const data = (
    await db
      .selectDistinct({ channelId: filesTable.channelId })
      .from(filesTable)
  ).map((v) => v.channelId);

  for (const [index, channel] of data.entries()) {
    try {
      const data = await context.api.getChat(channel);
      infoMessage += `${+index + 1}\\\) ${data.title} \`${data.id}\`\n`;
    } catch (error) {
      let errorMessage = "Something Happened";
      if (error instanceof Error) errorMessage = error.message;

      Logger.send(errorMessage);
      infoMessage += `${+index + 1}\) ${channel}}\n`;
    }
  }
  context.reply(infoMessage);
});

Commands.addNewCommand("filterstats", "Send list of all channels added");

export const filterStatsCommand = composer;
