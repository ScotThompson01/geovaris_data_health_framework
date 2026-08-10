CREATE TABLE "assessment_response_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"assessment_id" uuid NOT NULL,
	"assessment_response_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"raw_score" numeric(12, 4),
	"maximum_score" numeric(12, 4),
	"normalized_score" numeric(12, 4),
	"question_weight" numeric(12, 4),
	"weighted_score" numeric(12, 4),
	"scoring_status" varchar(30) DEFAULT 'pending' NOT NULL,
	"scoring_notes" text,
	"calculated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assessment_response_scores" ADD CONSTRAINT "fk_response_score_organization" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_response_scores" ADD CONSTRAINT "fk_response_score_assessment" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_response_scores" ADD CONSTRAINT "fk_response_score_response" FOREIGN KEY ("assessment_response_id") REFERENCES "public"."assessment_responses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_response_scores" ADD CONSTRAINT "fk_response_score_question" FOREIGN KEY ("question_id") REFERENCES "public"."template_questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_assessment_response_score" ON "assessment_response_scores" USING btree ("assessment_response_id");