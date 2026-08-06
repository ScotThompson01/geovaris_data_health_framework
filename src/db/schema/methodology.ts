import {
  foreignKey,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { frameworks } from "./framework";
import { organizations } from "./organization";

export const assessmentMethodologies = pgTable(
  "assessment_methodologies",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id").notNull(),

    frameworkId: uuid("framework_id").notNull(),

    name: varchar("name", { length: 200 }).notNull(),

    code: varchar("code", { length: 50 }).notNull(),

    description: text("description"),

    methodologyType: varchar("methodology_type", {
      length: 50,
    })
      .notNull()
      .default("general"),

    status: varchar("status", { length: 30 })
      .notNull()
      .default("draft"),

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
      name: "fk_assessment_methodology_organization",
    }),

    foreignKey({
      columns: [table.frameworkId],
      foreignColumns: [frameworks.id],
      name: "fk_assessment_methodology_framework",
    }),

    uniqueIndex("uq_methodology_framework_code").on(
      table.frameworkId,
      table.code,
    ),
  ],
);

export type AssessmentMethodology =
  typeof assessmentMethodologies.$inferSelect;

export type NewAssessmentMethodology =
  typeof assessmentMethodologies.$inferInsert;