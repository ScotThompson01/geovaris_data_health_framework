import {
  foreignKey,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { organizations } from "./organization";

export const answerOptionSets = pgTable(
  "answer_option_sets",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id").notNull(),

    name: varchar("name", {
      length: 200,
    }).notNull(),

    code: varchar("code", {
      length: 50,
    }).notNull(),

    description: text("description"),

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
      name: "fk_answer_option_set_organization",
    }),

    uniqueIndex(
      "uq_answer_option_set_organization_code",
    ).on(
      table.organizationId,
      table.code,
    ),
  ],
);

export type AnswerOptionSet =
  typeof answerOptionSets.$inferSelect;

export type NewAnswerOptionSet =
  typeof answerOptionSets.$inferInsert;
  