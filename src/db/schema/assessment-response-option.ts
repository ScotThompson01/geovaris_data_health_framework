import {
  foreignKey,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { assessmentResponses } from "./assessment-response";
import { organizations } from "./organization";
import { templateQuestionOptions } from "./template-question-option";

export const assessmentResponseOptions = pgTable(
  "assessment_response_options",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id").notNull(),

    assessmentResponseId: uuid("assessment_response_id").notNull(),

    questionOptionId: uuid("question_option_id").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
      name: "fk_response_option_organization",
    }),

    foreignKey({
      columns: [table.assessmentResponseId],
      foreignColumns: [assessmentResponses.id],
      name: "fk_response_option_response",
    }),

    foreignKey({
      columns: [table.questionOptionId],
      foreignColumns: [templateQuestionOptions.id],
      name: "fk_response_option_question_option",
    }),

    uniqueIndex("uq_response_question_option").on(
      table.assessmentResponseId,
      table.questionOptionId,
    ),
  ],
);

export type AssessmentResponseOption =
  typeof assessmentResponseOptions.$inferSelect;

export type NewAssessmentResponseOption =
  typeof assessmentResponseOptions.$inferInsert;
  