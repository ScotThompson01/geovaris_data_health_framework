"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createClient,
} from "@/db/repositories/client-repository";

export async function createClientAction(
  formData: FormData,
) {
  const organizationId =
    formData.get("organizationId");

  const name =
    formData.get("name");

  const legalName =
    formData.get("legalName");

  const industry =
    formData.get("industry");

  const status =
    formData.get("status");

  const description =
    formData.get("description");

  if (
    typeof organizationId !== "string" ||
    !organizationId
  ) {
    throw new Error(
      "Organization is required.",
    );
  }

  if (
    typeof name !== "string" ||
    !name.trim()
  ) {
    throw new Error(
      "Client name is required.",
    );
  }

  const client =
    await createClient({
      organizationId,

      name:
        name.trim(),

      legalName:
        typeof legalName === "string"
          ? legalName.trim()
          : null,

      industry:
        typeof industry === "string"
          ? industry.trim()
          : null,

      status:
        typeof status === "string" &&
        status
          ? status
          : "active",

      description:
        typeof description === "string"
          ? description.trim()
          : null,
    });

  revalidatePath("/clients");

  redirect(
    `/clients/${client.id}`,
  );
}