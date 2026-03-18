ALTER TABLE "wbs_tasks" DROP CONSTRAINT "deleted_check";--> statement-breakpoint
ALTER TABLE "wbs_tasks" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "wbs_tasks" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "wbs_tasks" ALTER COLUMN "createdBy" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "wbs_tasks" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "wbs_tasks" ADD COLUMN "deletedBy" uuid;--> statement-breakpoint
ALTER TABLE "wbs_tasks" ADD CONSTRAINT "wbs_tasks_deletedBy_users_id_fk" FOREIGN KEY ("deletedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wbs_tasks" ADD CONSTRAINT "deleted_check" CHECK (("wbs_tasks"."deleted_at" IS NULL AND "wbs_tasks"."deletedBy" IS NULL) OR ("wbs_tasks"."deleted_at" IS NOT NULL AND "wbs_tasks"."deletedBy" IS NOT NULL));