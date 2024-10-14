import MeiliSearch from "meilisearch";

import { env } from "#/config/env";

export const searchClient = new MeiliSearch({
  host: env.MEILISEARCH_HOST,
  apiKey: env.MEILISEARCH_MASTER_KEY,
});
