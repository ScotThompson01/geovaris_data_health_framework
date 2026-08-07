import {
  boolean,
  foreignKey,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { organizations } from "./organization";
import { assessmentTemplateVersions } from "./assessment-template-version";
import { templateSections } from "./template-section";

export const templateQuestions = pgTable(
  "template_questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id").notNull(),

    templateVersionId: uuid("template_version_id").notNull(),

    sectionId: uuid("section_id").notNull(),

    questionCode: varchar("question_code", {
      length: 50,
    }).notNull(),

    questionText: text("question_text").notNull(),

    guidanceText: text("guidance_text"),

    answerType: varchar("answer_type", {
      length: 50,
    })
      .notNull()
      .default("single_select"),

    displayOrder: integer("display_order")
      .notNull()
      .default(0),

    weight: numeric("weight", {
      precision: 8,
      scale: 4,
    }),

    isRequired: boolean("is_required")
      .notNull()
      .default(true),

    allowsNotApplicable: boolean("allows_not_applicable")
      .notNull()
      .default(false),

    requiresComment: boolean("requires_comment")
      .notNull()
      .default(false),

    requiresEvidence: boolean("requires_evidence")
      .notNull()
      .default(false),

    status: varchar("status", {
      length: 30,
    })
      .notNull()
      .default("active"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
      name: "fk_template_question_organization",
    }),

    foreignKey({
      columns: [table.templateVersionId],
      foreignColumns: [assessmentTemplateVersions.id],
      name: "fk_template_question_version",
    }),

    foreignKey({
      columns: [table.sectionId],
      foreignColumns: [templateSections.id],
      name: "fk_template_question_section",
    }),

    uniqueIndex("uq_template_question_version_code").on(
      table.templateVersionId,
      table.questionCode,
    ),
  ],
);

export type TemplateQuestion =
  typeof templateQuestions.$inferSelect;

export type NewTemplateQuestion =
  typeof templateQuestions.$inferInsert;
  