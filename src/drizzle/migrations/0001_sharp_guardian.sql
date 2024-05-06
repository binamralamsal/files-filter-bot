CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"username" varchar
);
