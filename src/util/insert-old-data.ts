import { db } from "#/drizzle/db";
import { usersTable } from "#/drizzle/schema";

import data from "./users.json";

type User = {
  id: number;
  chatId: string;
  name: string;
  userName: string | null;
  createdAt: string;
  updatedAt: string;
};

const users = (data as User[]).map((user) => ({
  chatId: user.chatId,
  name: user.name,
  username: user.userName,
}));

await insertUsersInChunk(users);
process.exit(0);

async function insertUsersInChunk(
  users: { chatId: string; name: string; username: string | null }[],
  chunkSize = 10000,
) {
  for (let i = 0; i < users.length; i += chunkSize) {
    const chunk = users.slice(i, i + chunkSize);
    await db.insert(usersTable).values(chunk).onConflictDoNothing();
  }
}
