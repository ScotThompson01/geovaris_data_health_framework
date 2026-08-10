import {
  boolean,
  date,
  foreignKey,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { assessments } from "./assessment";
import { organizations } from "./organization";
import { templateQuestionOptions } from "./template-question-option";
import { templateQuestions } from "./template-question";

export const assessmentResponses = pgTable(
  "assessment_responses",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id").notNull(),

    assessmentId: uuid("assessment_id").notNull(),

    questionId: uuid("question_id").notNull(),

    selectedOptionId: uuid("selected_option_id"),

    textValue: text("text_value"),

    numericValue: numeric("numeric_value", {
      precision: 14,
      scale: 4,
    }),

    booleanValue: boolean("boolean_value"),

    dateValue: date("date_value"),

    respondentComment: text("respondent_comment"),

    assessorComment: text("assessor_comment"),

    status: varchar("status", {
      length: 30,
    })
      .notNull()
      .default("draft"),

    submittedAt: timestamp("submitted_at", {
      withTimezone: true,
    }),

    reviewedAt: timestamp("reviewed_at", {
      withTimezone: true,
    }),

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
      name: "fk_assessment_response_organization",
    }),

    foreignKey({
      columns: [table.assessmentId],
      foreignColumns: [assessments.id],
      name: "fk_assessment_response_assessment",
    }),

    foreignKey({
      columns: [table.questionId],
      foreignColumns: [templateQuestions.id],
      name: "fk_assessment_response_question",
    }),

    foreignKey({
      columns: [table.selectedOptionId],
      foreignColumns: [templateQuestionOptions.id],
      name: "fk_assessment_response_option",
    }),

    uniqueIndex("uq_assessment_response_question").on(
      table.assessmentId,
      table.questionId,
    ),
  ],
);

export type AssessmentResponse =
  typeof assessmentResponses.$inferSelect;

export type NewAssessmentResponse =
  typeof assessmentResponses.$inferInsert;
  