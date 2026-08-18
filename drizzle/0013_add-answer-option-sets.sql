CREATE TABLE "answer_option_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"status" varchar(30) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "answer_option_set_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"answer_option_set_id" uuid NOT NULL,
	"option_code" varchar(50) NOT NULL,
	"option_label" varchar(250) NOT NULL,
	"option_description" text,
	"option_value" varchar(100),
	"score_value" numeric(10, 4),
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_not_applicable" boolean DEFAULT false NOT NULL,
	"requires_comment" boolean DEFAULT false NOT NULL,
	"requires_evidence" boolean DEFAULT false NOT NULL,
	"status" varchar(30) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "answer_option_sets" ADD CONSTRAINT "fk_answer_option_set_organization" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answer_option_set_items" ADD CONSTRAINT "fk_answer_option_set_item_set" FOREIGN KEY ("answer_option_set_id") REFERENCES "public"."answer_option_sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_answer_option_set_organization_code" ON "answer_option_sets" USING btree ("organization_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_answer_option_set_item_code" ON "answer_option_set_items" USING btree ("answer_option_set_id","option_code");