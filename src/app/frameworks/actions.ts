"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/db/client";
import { organizations } from "@/db/schema";
import { createFramework } from "@/db/repositories/framework-repository";

export async function createFrameworkAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name || !code) {
    throw new Error("Name and code are required.");
  }

  const [geovaris] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.name, "GeoVaris"))
    .limit(1);

  if (!geovaris) {
    throw new Error("GeoVaris organization was not found.");
  }

  await createFramework({
    organizationId: geovaris.id,
    name,
    code: code.toUpperCase(),
    description,
    status: "draft",
  });

  revalidatePath("/frameworks");
  redirect("/frameworks");
}
