"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  updateClient,
} from "@/db/repositories/client-repository";

export async function updateClientAction(
  formData: FormData,
) {
  const clientId =
    formData.get("clientId");

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
    typeof clientId !== "string" ||
    !clientId
  ) {
    throw new Error(
      "Client ID is required.",
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

  if (
    typeof status !== "string" ||
    !["active", "inactive"].includes(
      status,
    )
  ) {
    throw new Error(
      "A valid client status is required.",
    );
  }

  await updateClient({
    clientId,

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

    status,

    description:
      typeof description === "string"
        ? description.trim()
        : null,
  });

  revalidatePath("/clients");

  revalidatePath(
    `/clients/${clientId}`,
  );

  redirect(
    `/clients/${clientId}`,
  );
}