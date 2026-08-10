CREATE TABLE "assessment_response_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"assessment_response_id" uuid NOT NULL,
	"question_option_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assessment_response_options" ADD CONSTRAINT "fk_response_option_organization" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_response_options" ADD CONSTRAINT "fk_response_option_response" FOREIGN KEY ("assessment_response_id") REFERENCES "public"."assessment_responses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_response_options" ADD CONSTRAINT "fk_response_option_question_option" FOREIGN KEY ("question_option_id") REFERENCES "public"."template_question_options"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_response_question_option" ON "assessment_response_options" USING btree ("assessment_response_id","question_option_id");