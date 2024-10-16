CREATE TABLE IF NOT EXISTS "user_file_downloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"query_hash" varchar NOT NULL,
	"download_time" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "id";