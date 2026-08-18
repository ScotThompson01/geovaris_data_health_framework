"use server";

import { revalidatePath } from "next/cache";

import {
  updateDraftTemplateQuestion,
  updateDraftTemplateQuestionOption,
} from "@/db/repositories/template-repository";

export async function updateQuestionAction(
  formData: FormData,
) {
  const templateId =
    formData.get("templateId");

  const versionId =
    formData.get("versionId");

  const questionId =
    formData.get("questionId");

  const questionText =
    formData.get("questionText");

  const guidanceText =
    formData.get("guidanceText");

  if (
    typeof templateId !== "string" ||
    typeof versionId !== "string" ||
    typeof questionId !== "string" ||
    typeof questionText !== "string"
  ) {
    throw new Error(
      "Invalid question update request.",
    );
  }

  await updateDraftTemplateQuestion({
    templateId,
    versionId,
    questionId,
    questionText,
    guidanceText:
      typeof guidanceText === "string"
        ? guidanceText
        : null,
  });

  revalidatePath(
    `/templates/${templateId}/versions/${versionId}/edit`,
  );

  revalidatePath(
    `/templates/${templateId}`,
  );
}

export async function updateOptionAction(
  formData: FormData,
) {
  const templateId =
    formData.get("templateId");

  const versionId =
    formData.get("versionId");

  const questionId =
    formData.get("questionId");

  const optionId =
    formData.get("optionId");

  const optionLabel =
    formData.get("optionLabel");

  const optionDescription =
    formData.get("optionDescription");

  const scoreValue =
    formData.get("scoreValue");

  if (
    typeof templateId !== "string" ||
    typeof versionId !== "string" ||
    typeof questionId !== "string" ||
    typeof optionId !== "string" ||
    typeof optionLabel !== "string"
  ) {
    throw new Error(
      "Invalid answer option update request.",
    );
  }

  await updateDraftTemplateQuestionOption({
    templateId,
    versionId,
    questionId,
    optionId,
    optionLabel,

    optionDescription:
      typeof optionDescription === "string"
        ? optionDescription
        : null,

    scoreValue:
      typeof scoreValue === "string"
        ? scoreValue
        : null,
  });

  revalidatePath(
    `/templates/${templateId}/versions/${versionId}/edit`,
  );

  revalidatePath(
    `/templates/${templateId}`,
  );
}