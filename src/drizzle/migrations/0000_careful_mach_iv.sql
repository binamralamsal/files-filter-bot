CREATE TABLE IF NOT EXISTS "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" integer NOT NULL,
	"channel_id" varchar NOT NULL,
	"caption" text,
	"file_size" integer NOT NULL
);
