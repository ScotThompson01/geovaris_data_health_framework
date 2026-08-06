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

export const frameworks = pgTable(
  "frameworks",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    organizationId: uuid("organization_id").notNull(),

    name: varchar("name", { length: 200 }).notNull(),

    code: varchar("code", { length: 50 }).notNull(),

    description: text("description"),

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
      name: "fk_framework_organization",
    }),

    uniqueIndex("uq_framework_organization_code").on(
      table.organizationId,
      table.code,
    ),
  ],
);

export type Framework = typeof frameworks.$inferSelect;
export type NewFramework = typeof frameworks.$inferInsert;