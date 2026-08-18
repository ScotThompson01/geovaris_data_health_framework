"use server";

import { redirect } from "next/navigation";

import {
  createAssessmentTemplate,
} from "@/db/repositories/template-repository";

export async function createAssessmentTemplateAction(
  formData: FormData,
) {
  const methodologyId =
    formData.get("methodologyId");

  const templateName =
    formData.get("templateName");

  const description =
    formData.get("description");

  const templateScope =
    formData.get("templateScope");

  if (
    typeof methodologyId !== "string" ||
    !methodologyId
  ) {
    throw new Error(
      "Methodology is required.",
    );
  }

  if (
    typeof templateName !== "string" ||
    !templateName.trim()
  ) {
    throw new Error(
      "Template name is required.",
    );
  }

  const result =
    await createAssessmentTemplate({
      methodologyId,

      name:
        templateName.trim(),

      description:
        typeof description === "string"
          ? description.trim()
          : null,

      templateScope:
        typeof templateScope === "string" &&
        templateScope
          ? templateScope
          : "master",
    });

  redirect(
    `/templates/${result.templateId}`,
  );
}