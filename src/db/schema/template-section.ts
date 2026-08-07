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

import { assessmentTemplateVersions } from "./assessment-template-version";
import { organizations } from "./organization";

export const templateSections = pgTable(
  "template_sections",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id").notNull(),

    templateVersionId: uuid("template_version_id").notNull(),

    parentSectionId: uuid("parent_section_id"),

    name: varchar("name", { length: 200 }).notNull(),

    code: varchar("code", { length: 50 }).notNull(),

    description: text("description"),

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

    status: varchar("status", { length: 30 })
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
      name: "fk_template_section_organization",
    }),

    foreignKey({
      columns: [table.templateVersionId],
      foreignColumns: [assessmentTemplateVersions.id],
      name: "fk_template_section_version",
    }),

    foreignKey({
      columns: [table.parentSectionId],
      foreignColumns: [table.id],
      name: "fk_template_section_parent",
    }),

    uniqueIndex("uq_template_section_version_code").on(
      table.templateVersionId,
      table.code,
    ),
  ],
);

export type TemplateSection =
  typeof templateSections.$inferSelect;

export type NewTemplateSection =
  typeof templateSections.$inferInsert;