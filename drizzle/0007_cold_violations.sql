CREATE TABLE "template_question_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
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
ALTER TABLE "template_question_options" ADD CONSTRAINT "fk_question_option_organization" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_question_options" ADD CONSTRAINT "fk_question_option_question" FOREIGN KEY ("question_id") REFERENCES "public"."template_questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_question_option_code" ON "template_question_options" USING btree ("question_id","option_code");