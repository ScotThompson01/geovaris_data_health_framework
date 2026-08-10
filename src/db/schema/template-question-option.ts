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
import { templateQuestions } from "./template-question";

export const templateQuestionOptions = pgTable(
  "template_question_options",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id").notNull(),

    questionId: uuid("question_id").notNull(),

    optionCode: varchar("option_code", {
      length: 50,
    }).notNull(),

    optionLabel: varchar("option_label", {
      length: 250,
    }).notNull(),

    optionDescription: text("option_description"),

    optionValue: varchar("option_value", {
      length: 100,
    }),

    scoreValue: numeric("score_value", {
      precision: 10,
      scale: 4,
    }),

    displayOrder: integer("display_order")
      .notNull()
      .default(0),

    isNotApplicable: boolean("is_not_applicable")
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
      name: "fk_question_option_organization",
    }),

    foreignKey({
      columns: [table.questionId],
      foreignColumns: [templateQuestions.id],
      name: "fk_question_option_question",
    }),

    uniqueIndex("uq_question_option_code").on(
      table.questionId,
      table.optionCode,
    ),
  ],
);

export type TemplateQuestionOption =
  typeof templateQuestionOptions.$inferSelect;

export type NewTemplateQuestionOption =
  typeof templateQuestionOptions.$inferInsert;
  