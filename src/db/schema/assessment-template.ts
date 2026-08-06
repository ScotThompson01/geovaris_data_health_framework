import {
  foreignKey,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  text,
} from "drizzle-orm/pg-core";

import { organizations } from "./organization";
import { assessmentMethodologies } from "./methodology";

export const assessmentTemplates = pgTable(
  "assessment_templates",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id").notNull(),

    methodologyId: uuid("methodology_id").notNull(),

    name: varchar("name", { length: 200 }).notNull(),

    description: text("description"),

    templateScope: varchar("template_scope", {
      length: 30,
    })
      .notNull()
      .default("master"),

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
      name: "fk_assessment_template_organization",
    }),

    foreignKey({
      columns: [table.methodologyId],
      foreignColumns: [assessmentMethodologies.id],
      name: "fk_assessment_template_methodology",
    }),

    uniqueIndex("uq_template_methodology_name").on(
      table.methodologyId,
      table.name,
    ),
  ],
);

export type AssessmentTemplate =
  typeof assessmentTemplates.$inferSelect;

export type NewAssessmentTemplate =
  typeof assessmentTemplates.$inferInsert;