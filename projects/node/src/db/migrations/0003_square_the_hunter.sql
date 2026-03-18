CREATE TABLE "wbs_task_histories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"parent_id" uuid,
	"logical_id" uuid NOT NULL,
	"logical_parent_id" uuid,
	"name" text NOT NULL,
	"assignee" text,
	"status" text NOT NULL,
	"planned_effort" double precision NOT NULL,
	"buffer" double precision NOT NULL,
	"actual_effort" double precision NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wbs_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone,
	"createdBy" uuid,
	CONSTRAINT "deleted_check" CHECK (("wbs_tasks"."created_at" IS NULL AND "wbs_tasks"."createdBy" IS NULL) OR ("wbs_tasks"."created_at" IS NOT NULL AND "wbs_tasks"."createdBy" IS NOT NULL))
);
--> statement-breakpoint
ALTER TABLE "wbs_task_histories" ADD CONSTRAINT "wbs_task_histories_task_id_wbs_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."wbs_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wbs_task_histories" ADD CONSTRAINT "wbs_task_histories_parent_id_wbs_task_histories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."wbs_task_histories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wbs_tasks" ADD CONSTRAINT "wbs_tasks_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;