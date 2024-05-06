import { Composer } from "grammy";

import { addUser } from "./private/addUser";

const composer = new Composer();

// Private
const privateFilter = composer.filter(
  (context) => context.chat?.type === "private"
);
privateFilter.use(addUser);
//   .use(start)
//   .use(usersInfo)
//   .use(broadcastMessage)
//   .use(checkCaption);

export const handlers = composer;
