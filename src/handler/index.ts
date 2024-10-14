import { Composer } from "grammy";

import { env } from "#/config/env";
import type { BotContext } from "#/types";

import { callbacks } from "./callbacks";
import { addNewFiles } from "./channel/add-new-files";
import { editFiles } from "./channel/edit-files";
import { sendFilsList } from "./group/send-files-list";
import { addChannelCommand } from "./private/add-channel.command";
import { addUser } from "./private/addUser";
import { broadcastCommand } from "./private/broadcast.command";
import { deleteChannelCommand } from "./private/del-channel.command";
import { delallCommand } from "./private/delall.command";
import { filterStatsCommand } from "./private/filterstats.command";
import { refreshAllChannelsCommand } from "./private/refresh-all-channels";
import { refreshChannelCommand } from "./private/refresh-channel.command";
import { startCommand } from "./private/start.command";
import { usersCommand } from "./private/users.command";

const composer = new Composer<BotContext>();

// Private - Only in Bot DMs
const privateFilter = composer.filter(
  (context) => context.chat?.type === "private",
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
  .use(filterStatsCommand)
  .use(refreshChannelCommand)
  .use(refreshAllChannelsCommand);

const groupFilter = composer.filter((context) =>
  ["group", "supergroup"].includes(context.chat?.type || ""),
);
groupFilter.use(sendFilsList);

composer.use(addNewFiles).use(editFiles);

function isAdminUser(context: BotContext) {
  if (!context.from) return false;
  return env.AUTHORIZED_USERS.includes(context.from.id);
}

composer.use(callbacks);

export const handlers = composer;
