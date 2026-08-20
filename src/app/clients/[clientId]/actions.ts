"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  deleteClient,
} from "@/db/repositories/client-repository";

export async function deleteClientAction(
  formData: FormData,
) {
  const clientId =
    formData.get("clientId");

  if (
    typeof clientId !== "string" ||
    !clientId
  ) {
    throw new Error(
      "Client ID is required.",
    );
  }

  await deleteClient(
    clientId,
  );

  revalidatePath(
    "/clients",
  );

  redirect(
    "/clients",
  );
}