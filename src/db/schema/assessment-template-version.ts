import {
  foreignKey,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { assessmentTemplates } from "./assessment-template";
import { organizations } from "./organization";

export const assessmentTemplateVersions = pgTable(
  "assessment_template_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id").notNull(),

    templateId: uuid("template_id").notNull(),

    versionNumber: integer("version_number").notNull(),

    versionLabel: varchar("version_label", {
      length: 30,
    }).notNull(),

    status: varchar("status", {
      length: 30,
    })
      .notNull()
      .default("draft"),

    changeSummary: text("change_summary"),

    publishedAt: timestamp("published_at", {
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
      name: "fk_template_version_organization",
    }),

    foreignKey({
      columns: [table.templateId],
      foreignColumns: [assessmentTemplates.id],
      name: "fk_template_version_template",
    }),

    uniqueIndex("uq_template_version").on(
      table.templateId,
      table.versionNumber,
    ),
  ],
);

export type AssessmentTemplateVersion =
  typeof assessmentTemplateVersions.$inferSelect;

export type NewAssessmentTemplateVersion =
  typeof assessmentTemplateVersions.$inferInsert;