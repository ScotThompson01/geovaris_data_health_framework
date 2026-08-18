"use server";

import { revalidatePath } from "next/cache";

import {
  applyAnswerOptionSet,
  createDraftQuestionOption,
  createDraftTemplateQuestion,
  createDraftTemplateSection,
  updateDraftTemplateQuestion,
  updateDraftTemplateQuestionOption,
} from "@/db/repositories/template-repository";

// ==================================================
// Create Section
// ==================================================

export async function createSectionAction(
  formData: FormData,
) {
  const templateId =
    formData.get("templateId");

  const versionId =
    formData.get("versionId");

  const name =
    formData.get("name");

  const code =
    formData.get("code");

  const description =
    formData.get("description");

  const displayOrder =
    formData.get("displayOrder");

  const weight =
    formData.get("weight");

  const isRequired =
    formData.get("isRequired");

  if (
    typeof templateId !== "string" ||
    typeof versionId !== "string" ||
    typeof name !== "string" ||
    typeof code !== "string"
  ) {
    throw new Error(
      "Invalid section creation request.",
    );
  }

  const parsedDisplayOrder =
    typeof displayOrder === "string" &&
      displayOrder.trim()
      ? Number(displayOrder)
      : undefined;

  if (
    parsedDisplayOrder !== undefined &&
    Number.isNaN(parsedDisplayOrder)
  ) {
    throw new Error(
      "Display order must be numeric.",
    );
  }

  await createDraftTemplateSection({
    templateId,
    versionId,
    name,
    code,

    description:
      typeof description === "string"
        ? description
        : null,

    displayOrder:
      parsedDisplayOrder,

    weight:
      typeof weight === "string"
        ? weight
        : null,

    isRequired:
      isRequired === "on",
  });

  revalidatePath(
    `/templates/${templateId}/versions/${versionId}/edit`,
  );

  revalidatePath(
    `/templates/${templateId}`,
  );
}

// ==================================================
// Create Question
// ==================================================

export async function createQuestionAction(
  formData: FormData,
) {
  const templateId =
    formData.get("templateId");

  const versionId =
    formData.get("versionId");

  const sectionId =
    formData.get("sectionId");

  const questionCode =
    formData.get("questionCode");

  const questionText =
    formData.get("questionText");

  const guidanceText =
    formData.get("guidanceText");

  const answerType =
    formData.get("answerType");

  const displayOrder =
    formData.get("displayOrder");

  const weight =
    formData.get("weight");

  const isRequired =
    formData.get("isRequired");

  const allowsNotApplicable =
    formData.get("allowsNotApplicable");

  const requiresComment =
    formData.get("requiresComment");

  const requiresEvidence =
    formData.get("requiresEvidence");

  if (
    typeof templateId !== "string" ||
    typeof versionId !== "string" ||
    typeof sectionId !== "string" ||
    typeof questionCode !== "string" ||
    typeof questionText !== "string"
  ) {
    throw new Error(
      "Invalid question creation request.",
    );
  }

  const parsedDisplayOrder =
    typeof displayOrder === "string" &&
      displayOrder.trim()
      ? Number(displayOrder)
      : undefined;

  if (
    parsedDisplayOrder !== undefined &&
    Number.isNaN(parsedDisplayOrder)
  ) {
    throw new Error(
      "Display order must be numeric.",
    );
  }

  await createDraftTemplateQuestion({
    templateId,
    versionId,
    sectionId,
    questionCode,
    questionText,

    guidanceText:
      typeof guidanceText === "string"
        ? guidanceText
        : null,

    answerType:
      typeof answerType === "string" &&
        answerType
        ? answerType
        : "single_select",

    displayOrder:
      parsedDisplayOrder,

    weight:
      typeof weight === "string"
        ? weight
        : null,

    isRequired:
      isRequired === "on",

    allowsNotApplicable:
      allowsNotApplicable === "on",

    requiresComment:
      requiresComment === "on",

    requiresEvidence:
      requiresEvidence === "on",
  });

  revalidatePath(
    `/templates/${templateId}/versions/${versionId}/edit`,
  );

  revalidatePath(
    `/templates/${templateId}`,
  );
}

// ==================================================
// Create Answer Option
// ==================================================

// ==================================================
// Apply Answer Option Set
// ==================================================

export async function applyAnswerOptionSetAction(
  formData: FormData,
) {
  const templateId =
    formData.get("templateId");

  const versionId =
    formData.get("versionId");

  const questionId =
    formData.get("questionId");

  const answerOptionSetId =
    formData.get("answerOptionSetId");

  if (
    typeof templateId !== "string" ||
    typeof versionId !== "string" ||
    typeof questionId !== "string" ||
    typeof answerOptionSetId !== "string"
  ) {
    throw new Error(
      "Invalid answer option set request.",
    );
  }

  await applyAnswerOptionSet({
    templateId,
    versionId,
    questionId,
    answerOptionSetId,
  });

  revalidatePath(
    `/templates/${templateId}/versions/${versionId}/edit`,
  );

  revalidatePath(
    `/templates/${templateId}`,
  );
}

export async function createOptionAction(
  formData: FormData,
) {
  const templateId =
    formData.get("templateId");

  const versionId =
    formData.get("versionId");

  const questionId =
    formData.get("questionId");

  const optionCode =
    formData.get("optionCode");

  const optionLabel =
    formData.get("optionLabel");

  const optionDescription =
    formData.get("optionDescription");

  const optionValue =
    formData.get("optionValue");

  const scoreValue =
    formData.get("scoreValue");

  const displayOrder =
    formData.get("displayOrder");

  const isNotApplicable =
    formData.get("isNotApplicable");

  const requiresComment =
    formData.get("requiresComment");

  const requiresEvidence =
    formData.get("requiresEvidence");

  if (
    typeof templateId !== "string" ||
    typeof versionId !== "string" ||
    typeof questionId !== "string" ||
    typeof optionCode !== "string" ||
    typeof optionLabel !== "string"
  ) {
    throw new Error(
      "Invalid answer option creation request.",
    );
  }

  const parsedDisplayOrder =
    typeof displayOrder === "string" &&
      displayOrder.trim()
      ? Number(displayOrder)
      : undefined;

  if (
    parsedDisplayOrder !== undefined &&
    Number.isNaN(parsedDisplayOrder)
  ) {
    throw new Error(
      "Display order must be numeric.",
    );
  }

  await createDraftQuestionOption({
    templateId,
    versionId,
    questionId,
    optionCode,
    optionLabel,

    optionDescription:
      typeof optionDescription === "string"
        ? optionDescription
        : null,

    optionValue:
      typeof optionValue === "string"
        ? optionValue
        : null,

    scoreValue:
      typeof scoreValue === "string"
        ? scoreValue
        : null,

    displayOrder:
      parsedDisplayOrder,

    isNotApplicable:
      isNotApplicable === "on",

    requiresComment:
      requiresComment === "on",

    requiresEvidence:
      requiresEvidence === "on",
  });

  revalidatePath(
    `/templates/${templateId}/versions/${versionId}/edit`,
  );

  revalidatePath(
    `/templates/${templateId}`,
  );
}

// ==================================================
// Update Question
// ==================================================

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

// ==================================================
// Update Answer Option
// ==================================================

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