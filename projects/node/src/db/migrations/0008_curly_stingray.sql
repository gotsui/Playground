ALTER TABLE "wbs_task_histories" RENAME COLUMN "createdBy" TO "created_by";--> statement-breakpoint
ALTER TABLE "wbs_task_members" RENAME COLUMN "createdBy" TO "created_by";--> statement-breakpoint
ALTER TABLE "wbs_tasks" RENAME COLUMN "createdBy" TO "created_by";--> statement-breakpoint
ALTER TABLE "wbs_tasks" RENAME COLUMN "deletedBy" TO "deleted_by";--> statement-breakpoint
ALTER TABLE "wbs_tasks" DROP CONSTRAINT "deleted_check";--> statement-breakpoint
ALTER TABLE "wbs_task_histories" DROP CONSTRAINT "wbs_task_histories_createdBy_users_id_fk";
--> statement-breakpoint
ALTER TABLE "wbs_task_members" DROP CONSTRAINT "wbs_task_members_createdBy_users_id_fk";
--> statement-breakpoint
ALTER TABLE "wbs_tasks" DROP CONSTRAINT "wbs_tasks_createdBy_users_id_fk";
--> statement-breakpoint
ALTER TABLE "wbs_tasks" DROP CONSTRAINT "wbs_tasks_deletedBy_users_id_fk";
--> statement-breakpoint
ALTER TABLE "wbs_task_histories" ADD CONSTRAINT "wbs_task_histories_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wbs_task_members" ADD CONSTRAINT "wbs_task_members_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wbs_tasks" ADD CONSTRAINT "wbs_tasks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wbs_tasks" ADD CONSTRAINT "wbs_tasks_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wbs_tasks" ADD CONSTRAINT "deleted_check" CHECK (("wbs_tasks"."deleted_at" IS NULL AND "wbs_tasks"."deleted_by" IS NULL) OR ("wbs_tasks"."deleted_at" IS NOT NULL AND "wbs_tasks"."deleted_by" IS NOT NULL));