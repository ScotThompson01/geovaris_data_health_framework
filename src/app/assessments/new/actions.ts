"use server";

import { redirect } from "next/navigation";

import {
  createAssessment,
} from "@/db/repositories/assessment-repository";

export async function createAssessmentAction(
  formData: FormData,
) {
  const clientId =
    formData.get("clientId");

  const templateVersionId =
    formData.get("templateVersionId");

  const assessmentCode =
    formData.get("assessmentCode");

  const assessmentName =
    formData.get("assessmentName");

  const description =
    formData.get("description");

  if (
    typeof clientId !== "string" ||
    !clientId
  ) {
    throw new Error(
      "Client is required.",
    );
  }

  if (
    typeof templateVersionId !==
      "string" ||
    !templateVersionId
  ) {
    throw new Error(
      "Assessment template is required.",
    );
  }

  if (
    typeof assessmentCode !== "string" ||
    !assessmentCode.trim()
  ) {
    throw new Error(
      "Assessment code is required.",
    );
  }

  if (
    typeof assessmentName !== "string" ||
    !assessmentName.trim()
  ) {
    throw new Error(
      "Assessment name is required.",
    );
  }

  const assessment =
    await createAssessment({
      clientId,
      templateVersionId,

      assessmentCode:
        assessmentCode
          .trim()
          .toUpperCase(),

      assessmentName:
        assessmentName.trim(),

      description:
        typeof description === "string" &&
        description.trim()
          ? description.trim()
          : null,
    });

  redirect(
    `/assessments/${encodeURIComponent(
      assessment.assessmentCode,
    )}`,
  );
}