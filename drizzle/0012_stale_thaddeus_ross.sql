CREATE TABLE "assessment_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"assessment_id" uuid NOT NULL,
	"section_id" uuid,
	"score_scope" varchar(30) NOT NULL,
	"raw_score" numeric(14, 4),
	"maximum_score" numeric(14, 4),
	"normalized_score" numeric(14, 4),
	"weighted_score" numeric(14, 4),
	"scoring_status" varchar(30) DEFAULT 'pending' NOT NULL,
	"scoring_notes" text,
	"calculated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assessment_scores" ADD CONSTRAINT "fk_assessment_score_organization" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_scores" ADD CONSTRAINT "fk_assessment_score_assessment" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_scores" ADD CONSTRAINT "fk_assessment_score_section" FOREIGN KEY ("section_id") REFERENCES "public"."template_sections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_assessment_section_score" ON "assessment_scores" USING btree ("assessment_id","section_id") WHERE "assessment_scores"."score_scope" = 'section';--> statement-breakpoint
CREATE UNIQUE INDEX "uq_assessment_overall_score" ON "assessment_scores" USING btree ("assessment_id") WHERE "assessment_scores"."score_scope" = 'overall' AND "assessment_scores"."section_id" IS NULL;