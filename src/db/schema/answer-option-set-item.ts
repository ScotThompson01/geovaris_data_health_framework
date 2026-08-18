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

import { answerOptionSets } from "./answer-option-set";

export const answerOptionSetItems = pgTable(
  "answer_option_set_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    answerOptionSetId: uuid(
      "answer_option_set_id",
    ).notNull(),

    optionCode: varchar("option_code", {
      length: 50,
    }).notNull(),

    optionLabel: varchar("option_label", {
      length: 250,
    }).notNull(),

    optionDescription: text(
      "option_description",
    ),

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

    isNotApplicable: boolean(
      "is_not_applicable",
    )
      .notNull()
      .default(false),

    requiresComment: boolean(
      "requires_comment",
    )
      .notNull()
      .default(false),

    requiresEvidence: boolean(
      "requires_evidence",
    )
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
      columns: [table.answerOptionSetId],
      foreignColumns: [answerOptionSets.id],
      name: "fk_answer_option_set_item_set",
    }),

    uniqueIndex(
      "uq_answer_option_set_item_code",
    ).on(
      table.answerOptionSetId,
      table.optionCode,
    ),
  ],
);

export type AnswerOptionSetItem =
  typeof answerOptionSetItems.$inferSelect;

export type NewAnswerOptionSetItem =
  typeof answerOptionSetItems.$inferInsert;