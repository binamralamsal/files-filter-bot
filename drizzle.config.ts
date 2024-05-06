import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/env";

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  verbose: env.NODE_ENV === "development",
  strict: true,
});
