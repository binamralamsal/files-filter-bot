import { type CommandContext, Composer } from "grammy";

import { db } from "#/drizzle/db";
import type { BotContext } from "#/types";
import { Commands } from "#/util/commands";

const composer = new Composer<BotContext>();

composer.command("users", async (context: CommandContext<BotContext>) => {
  const totalUsers = await db.query.usersTable.findMany();

  return context.reply(
    context.t("users_scanned", {
      usersLength: totalUsers.length,
    }),
  );
});
Commands.addNewCommand(
  "users",
  "Send the list of all users who are scanned by bot",
);

export const usersCommand = composer;
