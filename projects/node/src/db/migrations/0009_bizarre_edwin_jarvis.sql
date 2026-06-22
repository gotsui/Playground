ALTER TABLE "wbs_task_histories" RENAME COLUMN "start_date" TO "planned_start_date";--> statement-breakpoint
ALTER TABLE "wbs_task_histories" RENAME COLUMN "end_date" TO "planned_end_date";--> statement-breakpoint
ALTER TABLE "wbs_task_histories" ADD COLUMN "actual_start_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "wbs_task_histories" ADD COLUMN "actual_end_date" timestamp with time zone;