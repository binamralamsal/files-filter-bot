import { Composer } from "grammy";

import { addUser } from "./private/addUser";
import { startCommand } from "./private/start.command";
import type { BotContext } from "#/types";
import { usersCommand } from "./private/users.command";
import { env } from "#/config/env";
import { broadcastCommand } from "./private/broadcast.command";
import { addChannelCommand } from "./private/add-channel.command";
import { addNewFiles } from "./channel/add-new-files";
import { editFiles } from "./channel/edit-files";
import { deleteChannelCommand } from "./private/del-channel.command";
import { delallCommand } from "./private/delall.command";
import { filterStatsCommand } from "./private/filterstats.command";

const composer = new Composer<BotContext>();

// Private - Only in Bot DMs
const privateFilter = composer.filter(
  (context) => context.chat?.type === "private"
);
privateFilter
  .use(addUser)
  .use(startCommand)
  .filter(isAdminUser)
  .use(usersCommand)
  .use(broadcastCommand)
  .use(addChannelCommand)
  .use(deleteChannelCommand)
  .use(delallCommand)
  .use(filterStatsCommand);
//   .use(checkCaption);

composer.use(addNewFiles).use(editFiles);

function isAdminUser(context: BotContext) {
  if (!context.from) return false;
  return env.AUTHORIZED_USERS.includes(context.from.id);
}

export const handlers = composer;
