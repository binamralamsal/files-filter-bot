import {
  Composer,
  InlineKeyboard,
  InputFile,
  type CommandContext,
} from "grammy";

import type { BotContext } from "#/types";

import { Commands } from "#/util/commands";
import { env } from "#/config/env";

const composer = new Composer<BotContext>();

composer.command("start", async (context) => {
  if (!context.match) return welcomeUser(context);

  const isUserJoinedInRequiredChats = await userInRequiredChats(context);
  if (!isUserJoinedInRequiredChats) {
    const inlineKeyboard = await generateRequiredChatButtons(context);
    inlineKeyboard.url(
      "Try again",
      `t.me/${context.me.username}?start=${context.match}`
    );
    return context.replyWithPhoto(
      new InputFile(`src/assets/images/caution.jpg`),
      {
        caption: context.t("join_required_chats"),
        reply_markup: inlineKeyboard,
      }
    );
  }

  // if (context.match.startsWith("send-")) return sendFiles(context);
  // if (context.match.startsWith("sendall-")) return sendAllFiles(context);
});

Commands.addNewCommand("start", "Start the bot!");

export const startCommand = composer;

const welcomeUser = async (context: CommandContext<BotContext>) => {
  let caption = env.WELCOME_MESSAGE;

  let inlineKeyboard;
  if (env.REQUIRED_CHAT_TO_JOIN.length > 0) {
    caption += `\n${context.i18n.t("join_required_chat_message")}`;

    inlineKeyboard = await generateRequiredChatButtons(context);
  }

  context.replyWithPhoto(new InputFile(`src/assets/images/welcome.jpg`), {
    caption,
    reply_markup: inlineKeyboard,
  });
};

const userInRequiredChats = async (context: CommandContext<BotContext>) => {
  if (!context.from?.id) return false;

  for (const requiredChat of env.REQUIRED_CHAT_TO_JOIN) {
    const chat = await context.api.getChatMember(requiredChat, context.from.id);
    if (chat.status === "left") return false;
  }
  return true;
};

type Channel = { title: string; invite_link: string };

async function generateRequiredChatButtons(
  context: CommandContext<BotContext>
) {
  const inlineKeyboard = new InlineKeyboard();
  for (const requiredChat of env.REQUIRED_CHAT_TO_JOIN) {
    if (!requiredChat) continue;
    const chat = (await context.api.getChat(requiredChat)) as Channel;

    const keyboardArray = inlineKeyboard.inline_keyboard;
    const lastRow = keyboardArray[keyboardArray.length - 1];

    inlineKeyboard.url(chat.title, chat.invite_link);
    if (lastRow.length === 2) {
      inlineKeyboard.row();
    }
  }
  // inlineKeyboard.url("Donate US", "https://shrs.link/XG7zfz");
  return inlineKeyboard;
}
