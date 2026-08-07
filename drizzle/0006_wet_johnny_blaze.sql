CREATE TABLE "template_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"template_version_id" uuid NOT NULL,
	"section_id" uuid NOT NULL,
	"question_code" varchar(50) NOT NULL,
	"question_text" text NOT NULL,
	"guidance_text" text,
	"answer_type" varchar(50) DEFAULT 'single_select' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"weight" numeric(8, 4),
	"is_required" boolean DEFAULT true NOT NULL,
	"allows_not_applicable" boolean DEFAULT false NOT NULL,
	"requires_comment" boolean DEFAULT false NOT NULL,
	"requires_evidence" boolean DEFAULT false NOT NULL,
	"status" varchar(30) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "template_questions" ADD CONSTRAINT "fk_template_question_organization" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_questions" ADD CONSTRAINT "fk_template_question_version" FOREIGN KEY ("template_version_id") REFERENCES "public"."assessment_template_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_questions" ADD CONSTRAINT "fk_template_question_section" FOREIGN KEY ("section_id") REFERENCES "public"."template_sections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_template_question_version_code" ON "template_questions" USING btree ("template_version_id","question_code");