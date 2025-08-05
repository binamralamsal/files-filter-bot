import IORedis from "ioredis";

import { env } from "#/config/env";

export const redis = new IORedis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: "ySyClg0IRrbVydjk24EXSJ6owEWvH6bP",
  maxRetriesPerRequest: null,
});
