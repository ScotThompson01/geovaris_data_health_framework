CREATE TABLE "template_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"template_version_id" uuid NOT NULL,
	"parent_section_id" uuid,
	"name" varchar(200) NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"weight" numeric(8, 4),
	"is_required" boolean DEFAULT true NOT NULL,
	"status" varchar(30) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "template_sections" ADD CONSTRAINT "fk_template_section_organization" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_sections" ADD CONSTRAINT "fk_template_section_version" FOREIGN KEY ("template_version_id") REFERENCES "public"."assessment_template_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_sections" ADD CONSTRAINT "fk_template_section_parent" FOREIGN KEY ("parent_section_id") REFERENCES "public"."template_sections"("id") ON DELETE no action ON UPDATE no action;