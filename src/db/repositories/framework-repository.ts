import { asc } from "drizzle-orm";

import { db } from "@/db/client";
import { frameworks } from "@/db/schema";

export async function getFrameworks() {
  return db
    .select()
    .from(frameworks)
    .orderBy(asc(frameworks.name));
}
export async function createFramework(input: {
  organizationId: string;
  name: string;
  code: string;
  description?: string;
  status?: string;
}) {
  const [framework] = await db
    .insert(frameworks)
    .values({
      organizationId: input.organizationId,
      name: input.name,
      code: input.code,
      description: input.description,
      status: input.status ?? "draft",
    })
    .returning();

  return framework;
}