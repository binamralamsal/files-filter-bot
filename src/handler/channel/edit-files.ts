import { Composer } from "grammy";

import { updateFileCaption } from "#/use-cases/update-file-caption";

const composer = new Composer();
composer.on(
  ["edited_channel_post:document", "edited_channel_post:video"],
  async (context) => {
    const {
      message_id: messageId,
      chat,
      caption,
      document,
      video,
    } = context.update.edited_channel_post;
    const channelId = chat.id;

    const fileCaption = caption || document?.file_name || video?.file_name;
    if (!fileCaption) return;

    await updateFileCaption({
      caption: fileCaption,
      channelId: String(channelId),
      messageId,
    });
  },
);

export const editFiles = composer;
