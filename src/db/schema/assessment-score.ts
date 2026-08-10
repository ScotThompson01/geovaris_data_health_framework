import { sql } from "drizzle-orm";

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
import { organizations } from "./organization";
import { templateSections } from "./template-section";

export const assessmentScores = pgTable(
  "assessment_scores",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id").notNull(),

    assessmentId: uuid("assessment_id").notNull(),

    sectionId: uuid("section_id"),

    scoreScope: varchar("score_scope", {
      length: 30,
    }).notNull(),

    rawScore: numeric("raw_score", {
      precision: 14,
      scale: 4,
    }),

    maximumScore: numeric("maximum_score", {
      precision: 14,
      scale: 4,
    }),

    normalizedScore: numeric("normalized_score", {
      precision: 14,
      scale: 4,
    }),

    weightedScore: numeric("weighted_score", {
      precision: 14,
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
      name: "fk_assessment_score_organization",
    }),

    foreignKey({
      columns: [table.assessmentId],
      foreignColumns: [assessments.id],
      name: "fk_assessment_score_assessment",
    }),

    foreignKey({
      columns: [table.sectionId],
      foreignColumns: [templateSections.id],
      name: "fk_assessment_score_section",
    }),

    uniqueIndex("uq_assessment_section_score")
      .on(
        table.assessmentId,
        table.sectionId,
      )
      .where(
        sql`${table.scoreScope} = 'section'`,
      ),

    uniqueIndex("uq_assessment_overall_score")
      .on(table.assessmentId)
      .where(
        sql`${table.scoreScope} = 'overall' AND ${table.sectionId} IS NULL`,
      ),
  ],
);

export type AssessmentScore =
  typeof assessmentScores.$inferSelect;

export type NewAssessmentScore =
  typeof assessmentScores.$inferInsert;
  
