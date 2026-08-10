import {
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
import { assessmentResponses } from "./assessment-response";
import { organizations } from "./organization";
import { templateQuestions } from "./template-question";

export const assessmentResponseScores = pgTable(
  "assessment_response_scores",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id").notNull(),

    assessmentId: uuid("assessment_id").notNull(),

    assessmentResponseId: uuid("assessment_response_id").notNull(),

    questionId: uuid("question_id").notNull(),

    rawScore: numeric("raw_score", {
      precision: 12,
      scale: 4,
    }),

    maximumScore: numeric("maximum_score", {
      precision: 12,
      scale: 4,
    }),

    normalizedScore: numeric("normalized_score", {
      precision: 12,
      scale: 4,
    }),

    questionWeight: numeric("question_weight", {
      precision: 12,
      scale: 4,
    }),

    weightedScore: numeric("weighted_score", {
      precision: 12,
      scale: 4,
    }),

    scoringStatus: varchar("scoring_status", {
      length: 30,
    })
      .notNull()
      .default("pending"),

    scoringNotes: text("scoring_notes"),

    calculatedAt: timestamp("calculated_at", {
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
      name: "fk_response_score_organization",
    }),

    foreignKey({
      columns: [table.assessmentId],
      foreignColumns: [assessments.id],
      name: "fk_response_score_assessment",
    }),

    foreignKey({
      columns: [table.assessmentResponseId],
      foreignColumns: [assessmentResponses.id],
      name: "fk_response_score_response",
    }),

    foreignKey({
      columns: [table.questionId],
      foreignColumns: [templateQuestions.id],
      name: "fk_response_score_question",
    }),

    uniqueIndex("uq_assessment_response_score").on(
      table.assessmentResponseId,
    ),
  ],
);

export type AssessmentResponseScore =
  typeof assessmentResponseScores.$inferSelect;

export type NewAssessmentResponseScore =
  typeof assessmentResponseScores.$inferInsert;
  