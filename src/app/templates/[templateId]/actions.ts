"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createTemplateVersionFromExisting,
} from "@/db/repositories/template-repository";

export async function createTemplateVersionAction(
  formData: FormData,
) {
  const templateId =
    formData.get("templateId");

  const sourceVersionId =
    formData.get("sourceVersionId");

  const versionLabel =
    formData.get("versionLabel");

  const changeSummary =
    formData.get("changeSummary");

  if (
    typeof templateId !== "string" ||
    !templateId
  ) {
    throw new Error(
      "Template ID is required.",
    );
  }

  if (
    typeof sourceVersionId !== "string" ||
    !sourceVersionId
  ) {
    throw new Error(
      "Source version is required.",
    );
  }

  if (
    typeof versionLabel !== "string" ||
    !versionLabel.trim()
  ) {
    throw new Error(
      "Version label is required.",
    );
  }

  await createTemplateVersionFromExisting({
    templateId,
    sourceVersionId,
    versionLabel:
      versionLabel.trim(),

    changeSummary:
      typeof changeSummary === "string"
        ? changeSummary.trim()
        : null,
  });

  revalidatePath(
    `/templates/${templateId}`,
  );

  revalidatePath("/templates");

  redirect(
    `/templates/${templateId}`,
  );
}