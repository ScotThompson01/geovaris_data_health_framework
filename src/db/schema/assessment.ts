import {
  date,
  foreignKey,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { assessmentTemplates } from "./assessment-template";
import { assessmentTemplateVersions } from "./assessment-template-version";
import { clients } from "./client";
import { frameworks } from "./framework";
import { assessmentMethodologies } from "./methodology";
import { organizations } from "./organization";

export const assessments = pgTable(
  "assessments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id").notNull(),

    clientId: uuid("client_id").notNull(),

    frameworkId: uuid("framework_id").notNull(),

    methodologyId: uuid("methodology_id").notNull(),

    templateId: uuid("template_id").notNull(),

    templateVersionId: uuid("template_version_id").notNull(),

    assessmentCode: varchar("assessment_code", {
      length: 50,
    }).notNull(),

    name: varchar("name", {
      length: 250,
    }).notNull(),

    description: text("description"),

    status: varchar("status", {
      length: 30,
    })
      .notNull()
      .default("draft"),

    assessmentStartDate: date("assessment_start_date"),

    assessmentDueDate: date("assessment_due_date"),

    submittedAt: timestamp("submitted_at", {
      withTimezone: true,
    }),

    completedAt: timestamp("completed_at", {
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
      name: "fk_assessment_organization",
    }),

    foreignKey({
      columns: [table.clientId],
      foreignColumns: [clients.id],
      name: "fk_assessment_client",
    }),

    foreignKey({
      columns: [table.frameworkId],
      foreignColumns: [frameworks.id],
      name: "fk_assessment_framework",
    }),

    foreignKey({
      columns: [table.methodologyId],
      foreignColumns: [assessmentMethodologies.id],
      name: "fk_assessment_methodology",
    }),

    foreignKey({
      columns: [table.templateId],
      foreignColumns: [assessmentTemplates.id],
      name: "fk_assessment_template",
    }),

    foreignKey({
      columns: [table.templateVersionId],
      foreignColumns: [assessmentTemplateVersions.id],
      name: "fk_assessment_template_version",
    }),

    uniqueIndex("uq_assessment_organization_code").on(
      table.organizationId,
      table.assessmentCode,
    ),
  ],
);

export type Assessment =
  typeof assessments.$inferSelect;

export type NewAssessment =
  typeof assessments.$inferInsert;