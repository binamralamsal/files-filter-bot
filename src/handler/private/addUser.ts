import { Composer } from "grammy";

import { eq } from "drizzle-orm";

import { db } from "#/drizzle/db";
import { usersTable } from "#/drizzle/schema";

const composer = new Composer();

composer.on("message", async (context, next) => {
  const { message } = context.update;

  const chatId = String(message.chat.id);

  const userExists = await db.query.usersTable.findFirst({
    where: eq(usersTable.chatId, chatId),
  });
  if (userExists) return next();

  const { first_name: firstName, last_name: lastName, username } = message.from;
  const name = `${firstName || ""} ${lastName || ""}`;

  await db.insert(usersTable).values({
    name,
    chatId,
    username,
  });
  next();
});

export const addUser = composer;
