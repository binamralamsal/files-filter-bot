import { Queue, Worker } from "bullmq";

import { bot } from "#/config/bot";
import { env } from "#/config/env";
import { redis } from "#/lib/ioredis";
import { Logger } from "#/util/logger";
import { timeToMilliseconds } from "#/util/time-to-milliseconds";

type DeleteMessageWorkerData = {
  messageId: number;
  chatId: number;
};

export const deleteQueue = new Queue<DeleteMessageWorkerData>(
  `${env.REDIS_WORKER_PREFIX}-deleteQueue`,
  {
    connection: redis,
  },
);

const deleteWorker = new Worker<DeleteMessageWorkerData>(
  `${env.REDIS_WORKER_PREFIX}-deleteQueue`,
  async (job) => {
    const { messageId, chatId } = job.data;

    await bot.api.deleteMessage(chatId, messageId);
  },
  {
    connection: redis,
  },
);

deleteWorker.on("failed", (data) => {
  if (!data) return;
  const { data: payloadData, failedReason } = data;
  Logger.send(
    `${payloadData.chatId}:${payloadData.messageId} has failed with reason ${failedReason}`,
  );
});

deleteWorker.on("error", ({ message }) => {
  Logger.send(message);
});

export async function deleteMessageFromPrivate({
  chatId,
  messageId,
}: DeleteMessageWorkerData) {
  if (!env.DELETE_TIME_IN_DM) return;
  await deleteQueue.add(
    "deleteMessage",
    { chatId, messageId },
    { delay: timeToMilliseconds(env.DELETE_TIME_IN_DM) },
  );
}

export async function deleteMessageFromGroup({
  chatId,
  messageId,
}: DeleteMessageWorkerData) {
  if (!env.DELETE_TIME_IN_GROUP) return;
  await deleteQueue.add(
    "deleteMessage",
    { chatId, messageId },
    { delay: timeToMilliseconds(env.DELETE_TIME_IN_GROUP) },
  );
}
