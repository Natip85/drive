CREATE TYPE "public"."user_role" AS ENUM('admin', 'owner', 'user', 'investigator', 'staff', 'paid', 'blocked');--> statement-breakpoint
CREATE TABLE "auth_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "auth_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "auth_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	"roles" "user_role"[] DEFAULT '{"user"}' NOT NULL,
	"phone" varchar(255),
	"last_login" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "auth_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "auth_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "auth_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "drive_files_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"owner_id" text NOT NULL,
	"size" integer NOT NULL,
	"url" text NOT NULL,
	"parent" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "drive_folders_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"parent" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth_account" ADD CONSTRAINT "auth_account_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "auth_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "auth_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "auth_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "verification_token_identifier_idx" ON "auth_verification_token" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "verification_token_expires_idx" ON "auth_verification_token" USING btree ("expires");--> statement-breakpoint
CREATE INDEX "files_parent_index" ON "drive_files_table" USING btree ("parent");--> statement-breakpoint
CREATE INDEX "files_owner_id_index" ON "drive_files_table" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "folder_parent_index" ON "drive_folders_table" USING btree ("parent");--> statement-breakpoint
CREATE INDEX "folder_owner_id_index" ON "drive_folders_table" USING btree ("owner_id");