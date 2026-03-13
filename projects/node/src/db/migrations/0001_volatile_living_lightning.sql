CREATE TABLE "wbs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wbs_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wbs_id" uuid NOT NULL,
	"parent_id" uuid,
	"name" text NOT NULL,
	"assignee" text,
	"status" text NOT NULL,
	"effort" double precision NOT NULL,
	"buffer" double precision NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wbs_tasks" ADD CONSTRAINT "wbs_tasks_wbs_id_wbs_id_fk" FOREIGN KEY ("wbs_id") REFERENCES "public"."wbs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wbs_tasks" ADD CONSTRAINT "wbs_tasks_parent_id_wbs_tasks_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."wbs_tasks"("id") ON DELETE no action ON UPDATE no action;