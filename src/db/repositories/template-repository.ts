import { randomUUID } from "node:crypto";

import {
  asc,
  desc,
  eq,
  inArray,
} from "drizzle-orm";

import { db } from "@/db/client";

import {
  assessmentMethodologies,
  assessmentTemplates,
  assessmentTemplateVersions,
  frameworks,
  templateQuestionOptions,
  templateQuestions,
  templateSections,
} from "@/db/schema";

// ==================================================
// Template List
// ==================================================

export async function getAssessmentTemplates() {
  const templates = await db
    .select({
      templateId:
        assessmentTemplates.id,

      templateName:
        assessmentTemplates.name,

      description:
        assessmentTemplates.description,

      templateScope:
        assessmentTemplates.templateScope,

      templateStatus:
        assessmentTemplates.status,

      methodologyId:
        assessmentMethodologies.id,

      methodologyName:
        assessmentMethodologies.name,

      frameworkId:
        frameworks.id,

      frameworkName:
        frameworks.name,

      createdAt:
        assessmentTemplates.createdAt,

      updatedAt:
        assessmentTemplates.updatedAt,
    })
    .from(assessmentTemplates)
    .innerJoin(
      assessmentMethodologies,
      eq(
        assessmentMethodologies.id,
        assessmentTemplates.methodologyId,
      ),
    )
    .innerJoin(
      frameworks,
      eq(
        frameworks.id,
        assessmentMethodologies.frameworkId,
      ),
    )
    .orderBy(
      asc(frameworks.name),
      asc(assessmentTemplates.name),
    );

  const results = [];

  for (const template of templates) {
    const versions = await db
      .select({
        versionId:
          assessmentTemplateVersions.id,

        versionNumber:
          assessmentTemplateVersions.versionNumber,

        versionLabel:
          assessmentTemplateVersions.versionLabel,

        versionStatus:
          assessmentTemplateVersions.status,

        publishedAt:
          assessmentTemplateVersions.publishedAt,

        createdAt:
          assessmentTemplateVersions.createdAt,
      })
      .from(
        assessmentTemplateVersions,
      )
      .where(
        eq(
          assessmentTemplateVersions.templateId,
          template.templateId,
        ),
      )
      .orderBy(
        asc(
          assessmentTemplateVersions.versionNumber,
        ),
      );

    results.push({
      ...template,
      versions,
      versionCount:
        versions.length,
    });
  }

  return results;
}

// ==================================================
// Template Details
// ==================================================

export async function getAssessmentTemplateById(
  templateId: string,
) {
  const [template] = await db
    .select({
      templateId:
        assessmentTemplates.id,

      organizationId:
        assessmentTemplates.organizationId,

      templateName:
        assessmentTemplates.name,

      description:
        assessmentTemplates.description,

      templateScope:
        assessmentTemplates.templateScope,

      templateStatus:
        assessmentTemplates.status,

      methodologyId:
        assessmentMethodologies.id,

      methodologyName:
        assessmentMethodologies.name,

      frameworkId:
        frameworks.id,

      frameworkName:
        frameworks.name,

      createdAt:
        assessmentTemplates.createdAt,

      updatedAt:
        assessmentTemplates.updatedAt,
    })
    .from(assessmentTemplates)
    .innerJoin(
      assessmentMethodologies,
      eq(
        assessmentMethodologies.id,
        assessmentTemplates.methodologyId,
      ),
    )
    .innerJoin(
      frameworks,
      eq(
        frameworks.id,
        assessmentMethodologies.frameworkId,
      ),
    )
    .where(
      eq(
        assessmentTemplates.id,
        templateId,
      ),
    )
    .limit(1);

  if (!template) {
    return null;
  }

  const versions = await db
    .select({
      versionId:
        assessmentTemplateVersions.id,

      versionNumber:
        assessmentTemplateVersions.versionNumber,

      versionLabel:
        assessmentTemplateVersions.versionLabel,

      versionStatus:
        assessmentTemplateVersions.status,

      changeSummary:
        assessmentTemplateVersions.changeSummary,

      publishedAt:
        assessmentTemplateVersions.publishedAt,

      createdAt:
        assessmentTemplateVersions.createdAt,

      updatedAt:
        assessmentTemplateVersions.updatedAt,
    })
    .from(
      assessmentTemplateVersions,
    )
    .where(
      eq(
        assessmentTemplateVersions.templateId,
        templateId,
      ),
    )
    .orderBy(
      asc(
        assessmentTemplateVersions.versionNumber,
      ),
    );

  const versionDetails = [];

  for (const version of versions) {
    const sections = await db
      .select({
        sectionId:
          templateSections.id,

        sectionName:
          templateSections.name,

        sectionOrder:
          templateSections.displayOrder,
      })
      .from(templateSections)
      .where(
        eq(
          templateSections.templateVersionId,
          version.versionId,
        ),
      )
      .orderBy(
        asc(
          templateSections.displayOrder,
        ),
      );

    const questions = await db
      .select({
        questionId:
          templateQuestions.id,

        questionCode:
          templateQuestions.questionCode,

        questionText:
          templateQuestions.questionText,

        guidanceText:
          templateQuestions.guidanceText,

        answerType:
          templateQuestions.answerType,

        sectionId:
          templateQuestions.sectionId,

        displayOrder:
          templateQuestions.displayOrder,

        weight:
          templateQuestions.weight,

        isRequired:
          templateQuestions.isRequired,

        allowsNotApplicable:
          templateQuestions.allowsNotApplicable,

        requiresComment:
          templateQuestions.requiresComment,

        requiresEvidence:
          templateQuestions.requiresEvidence,

        questionStatus:
          templateQuestions.status,
      })
      .from(templateQuestions)
      .where(
        eq(
          templateQuestions.templateVersionId,
          version.versionId,
        ),
      )
      .orderBy(
        asc(
          templateQuestions.displayOrder,
        ),
      );

    const questionIds =
      questions.map(
        (question) =>
          question.questionId,
      );

    const options =
      questionIds.length > 0
        ? await db
          .select({
            optionId:
              templateQuestionOptions.id,

            questionId:
              templateQuestionOptions.questionId,

            optionCode:
              templateQuestionOptions.optionCode,

            optionLabel:
              templateQuestionOptions.optionLabel,

            optionDescription:
              templateQuestionOptions.optionDescription,

            optionValue:
              templateQuestionOptions.optionValue,

            scoreValue:
              templateQuestionOptions.scoreValue,

            displayOrder:
              templateQuestionOptions.displayOrder,

            isNotApplicable:
              templateQuestionOptions.isNotApplicable,

            requiresComment:
              templateQuestionOptions.requiresComment,

            requiresEvidence:
              templateQuestionOptions.requiresEvidence,

            optionStatus:
              templateQuestionOptions.status,
          })
          .from(
            templateQuestionOptions,
          )
          .where(
            inArray(
              templateQuestionOptions.questionId,
              questionIds,
            ),
          )
          .orderBy(
            asc(
              templateQuestionOptions.displayOrder,
            ),
          )
        : [];

    const questionsWithOptions =
      questions.map(
        (question) => ({
          ...question,

          options:
            options.filter(
              (option) =>
                option.questionId ===
                question.questionId,
            ),
        }),
      );

    versionDetails.push({
      ...version,

      sections,

      questions:
        questionsWithOptions,

      sectionCount:
        sections.length,

      questionCount:
        questionsWithOptions.length,

      optionCount:
        options.length,
    });
  }

  return {
    ...template,
    versions:
      versionDetails,
  };
}

// ==================================================
// Clone Template Version
// ==================================================

export type CreateTemplateVersionFromExistingInput = {
  templateId: string;
  sourceVersionId: string;
  versionLabel: string;
  changeSummary?: string | null;
};

export async function createTemplateVersionFromExisting(
  input: CreateTemplateVersionFromExistingInput,
) {
  // -----------------------------------------------
  // Validate template
  // -----------------------------------------------

  const [template] = await db
    .select({
      templateId:
        assessmentTemplates.id,

      organizationId:
        assessmentTemplates.organizationId,
    })
    .from(assessmentTemplates)
    .where(
      eq(
        assessmentTemplates.id,
        input.templateId,
      ),
    )
    .limit(1);

  if (!template) {
    throw new Error(
      "Assessment template was not found.",
    );
  }

  // -----------------------------------------------
  // Validate source version
  // -----------------------------------------------

  const [sourceVersion] = await db
    .select({
      versionId:
        assessmentTemplateVersions.id,

      templateId:
        assessmentTemplateVersions.templateId,

      organizationId:
        assessmentTemplateVersions.organizationId,

      versionNumber:
        assessmentTemplateVersions.versionNumber,
    })
    .from(
      assessmentTemplateVersions,
    )
    .where(
      eq(
        assessmentTemplateVersions.id,
        input.sourceVersionId,
      ),
    )
    .limit(1);

  if (!sourceVersion) {
    throw new Error(
      "Source template version was not found.",
    );
  }

  if (
    sourceVersion.templateId !==
    input.templateId
  ) {
    throw new Error(
      "Source version does not belong to this template.",
    );
  }

  // -----------------------------------------------
  // Determine next internal version number
  // -----------------------------------------------

  const [latestVersion] = await db
    .select({
      versionNumber:
        assessmentTemplateVersions.versionNumber,
    })
    .from(
      assessmentTemplateVersions,
    )
    .where(
      eq(
        assessmentTemplateVersions.templateId,
        input.templateId,
      ),
    )
    .orderBy(
      desc(
        assessmentTemplateVersions.versionNumber,
      ),
    )
    .limit(1);

  const nextVersionNumber =
    (latestVersion?.versionNumber ?? 0) + 1;

  // -----------------------------------------------
  // Prevent duplicate display label
  // -----------------------------------------------

  const existingVersions = await db
    .select({
      versionLabel:
        assessmentTemplateVersions.versionLabel,
    })
    .from(
      assessmentTemplateVersions,
    )
    .where(
      eq(
        assessmentTemplateVersions.templateId,
        input.templateId,
      ),
    );

  const normalizedVersionLabel =
    input.versionLabel.trim();

  if (!normalizedVersionLabel) {
    throw new Error(
      "Version label is required.",
    );
  }

  const duplicateLabel =
    existingVersions.some(
      (version) =>
        version.versionLabel.trim() ===
        normalizedVersionLabel,
    );

  if (duplicateLabel) {
    throw new Error(
      `Version ${normalizedVersionLabel} already exists.`,
    );
  }

  // -----------------------------------------------
  // Load source sections
  // -----------------------------------------------

  const sourceSections = await db
    .select()
    .from(templateSections)
    .where(
      eq(
        templateSections.templateVersionId,
        input.sourceVersionId,
      ),
    )
    .orderBy(
      asc(
        templateSections.displayOrder,
      ),
    );

  // -----------------------------------------------
  // Load source questions
  // -----------------------------------------------

  const sourceQuestions = await db
    .select()
    .from(templateQuestions)
    .where(
      eq(
        templateQuestions.templateVersionId,
        input.sourceVersionId,
      ),
    )
    .orderBy(
      asc(
        templateQuestions.displayOrder,
      ),
    );

  if (
    sourceSections.length === 0 ||
    sourceQuestions.length === 0
  ) {
    throw new Error(
      "Source template version does not contain sections and questions.",
    );
  }

  // -----------------------------------------------
  // Load source question options
  // -----------------------------------------------

  const sourceQuestionIds =
    sourceQuestions.map(
      (question) =>
        question.id,
    );

  const sourceOptions =
    sourceQuestionIds.length > 0
      ? await db
        .select()
        .from(
          templateQuestionOptions,
        )
        .where(
          inArray(
            templateQuestionOptions.questionId,
            sourceQuestionIds,
          ),
        )
        .orderBy(
          asc(
            templateQuestionOptions.displayOrder,
          ),
        )
      : [];

  // -----------------------------------------------
  // Generate replacement IDs
  // -----------------------------------------------

  const newVersionId =
    randomUUID();

  const sectionIdMap =
    new Map<string, string>();

  for (const section of sourceSections) {
    sectionIdMap.set(
      section.id,
      randomUUID(),
    );
  }

  const questionIdMap =
    new Map<string, string>();

  for (const question of sourceQuestions) {
    questionIdMap.set(
      question.id,
      randomUUID(),
    );
  }

  // -----------------------------------------------
  // Build new template version
  // -----------------------------------------------

  const newVersion = {
    id:
      newVersionId,

    organizationId:
      template.organizationId,

    templateId:
      input.templateId,

    versionNumber:
      nextVersionNumber,

    versionLabel:
      normalizedVersionLabel,

    status:
      "draft",

    changeSummary:
      input.changeSummary?.trim() ||
      null,

    publishedAt:
      null,
  };

  // -----------------------------------------------
  // Build cloned sections
  // -----------------------------------------------

  const newSections =
    sourceSections.map(
      (section) => {
        const newSectionId =
          sectionIdMap.get(
            section.id,
          );

        if (!newSectionId) {
          throw new Error(
            "Unable to map cloned section.",
          );
        }

        const newParentSectionId =
          section.parentSectionId
            ? sectionIdMap.get(
              section.parentSectionId,
            )
            : null;

        if (
          section.parentSectionId &&
          !newParentSectionId
        ) {
          throw new Error(
            "Unable to map cloned parent section.",
          );
        }

        return {
          id:
            newSectionId,

          organizationId:
            section.organizationId,

          templateVersionId:
            newVersionId,

          parentSectionId:
            newParentSectionId,

          name:
            section.name,

          code:
            section.code,

          description:
            section.description,

          displayOrder:
            section.displayOrder,

          weight:
            section.weight,

          isRequired:
            section.isRequired,

          status:
            section.status,
        };
      },
    );

  // -----------------------------------------------
  // Build cloned questions
  // -----------------------------------------------

  const newQuestions =
    sourceQuestions.map(
      (question) => {
        const newQuestionId =
          questionIdMap.get(
            question.id,
          );

        const newSectionId =
          sectionIdMap.get(
            question.sectionId,
          );

        if (
          !newQuestionId ||
          !newSectionId
        ) {
          throw new Error(
            "Unable to map cloned question.",
          );
        }

        return {
          id:
            newQuestionId,

          organizationId:
            question.organizationId,

          templateVersionId:
            newVersionId,

          sectionId:
            newSectionId,

          questionCode:
            question.questionCode,

          questionText:
            question.questionText,

          guidanceText:
            question.guidanceText,

          answerType:
            question.answerType,

          displayOrder:
            question.displayOrder,

          weight:
            question.weight,

          isRequired:
            question.isRequired,

          allowsNotApplicable:
            question.allowsNotApplicable,

          requiresComment:
            question.requiresComment,

          requiresEvidence:
            question.requiresEvidence,

          status:
            question.status,
        };
      },
    );

  // -----------------------------------------------
  // Build cloned question options
  // -----------------------------------------------

  const newOptions =
    sourceOptions.map(
      (option) => {
        const newQuestionId =
          questionIdMap.get(
            option.questionId,
          );

        if (!newQuestionId) {
          throw new Error(
            "Unable to map cloned question option.",
          );
        }

        return {
          id:
            randomUUID(),

          organizationId:
            option.organizationId,

          questionId:
            newQuestionId,

          optionCode:
            option.optionCode,

          optionLabel:
            option.optionLabel,

          optionDescription:
            option.optionDescription,

          optionValue:
            option.optionValue,

          scoreValue:
            option.scoreValue,

          displayOrder:
            option.displayOrder,

          isNotApplicable:
            option.isNotApplicable,

          requiresComment:
            option.requiresComment,

          requiresEvidence:
            option.requiresEvidence,

          status:
            option.status,
        };
      },
    );

  // -----------------------------------------------
  // Atomic Neon batch
  // -----------------------------------------------

  if (newOptions.length > 0) {
    await db.batch([
      db
        .insert(
          assessmentTemplateVersions,
        )
        .values(
          newVersion,
        ),

      db
        .insert(
          templateSections,
        )
        .values(
          newSections,
        ),

      db
        .insert(
          templateQuestions,
        )
        .values(
          newQuestions,
        ),

      db
        .insert(
          templateQuestionOptions,
        )
        .values(
          newOptions,
        ),
    ]);
  } else {
    await db.batch([
      db
        .insert(
          assessmentTemplateVersions,
        )
        .values(
          newVersion,
        ),

      db
        .insert(
          templateSections,
        )
        .values(
          newSections,
        ),

      db
        .insert(
          templateQuestions,
        )
        .values(
          newQuestions,
        ),
    ]);
  }

  return {
    templateId:
      input.templateId,

    sourceVersionId:
      input.sourceVersionId,

    newVersionId,

    versionNumber:
      nextVersionNumber,

    versionLabel:
      normalizedVersionLabel,

    sectionCount:
      newSections.length,

    questionCount:
      newQuestions.length,

    optionCount:
      newOptions.length,

    status:
      "draft",
  };
}
// ==================================================
// Template Version Editor
// ==================================================

export async function getAssessmentTemplateVersionById(
  templateId: string,
  versionId: string,
) {
  const template =
    await getAssessmentTemplateById(
      templateId,
    );

  if (!template) {
    return null;
  }

  const version =
    template.versions.find(
      (item) =>
        item.versionId === versionId,
    );

  if (!version) {
    return null;
  }

  return {
    templateId:
      template.templateId,

    templateName:
      template.templateName,

    frameworkName:
      template.frameworkName,

    methodologyName:
      template.methodologyName,

    version,
  };
}
// ==================================================
// Update Draft Question
// ==================================================

export async function updateDraftTemplateQuestion(input: {
  templateId: string;
  versionId: string;
  questionId: string;
  questionText: string;
  guidanceText?: string | null;
}) {
  const editorData =
    await getAssessmentTemplateVersionById(
      input.templateId,
      input.versionId,
    );

  if (!editorData) {
    throw new Error(
      "Template version was not found.",
    );
  }

  if (
    editorData.version.versionStatus !==
    "draft"
  ) {
    throw new Error(
      "Only draft template versions can be edited.",
    );
  }

  const question =
    editorData.version.questions.find(
      (item) =>
        item.questionId ===
        input.questionId,
    );

  if (!question) {
    throw new Error(
      "Question was not found in this template version.",
    );
  }

  const normalizedQuestionText =
    input.questionText.trim();

  if (!normalizedQuestionText) {
    throw new Error(
      "Question text is required.",
    );
  }

  await db
    .update(templateQuestions)
    .set({
      questionText:
        normalizedQuestionText,

      guidanceText:
        input.guidanceText?.trim() ||
        null,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        templateQuestions.id,
        input.questionId,
      ),
    );
}

// ==================================================
// Update Draft Question Option
// ==================================================

export async function updateDraftTemplateQuestionOption(input: {
  templateId: string;
  versionId: string;
  questionId: string;
  optionId: string;
  optionLabel: string;
  optionDescription?: string | null;
  scoreValue?: string | null;
}) {
  const editorData =
    await getAssessmentTemplateVersionById(
      input.templateId,
      input.versionId,
    );

  if (!editorData) {
    throw new Error(
      "Template version was not found.",
    );
  }

  if (
    editorData.version.versionStatus !==
    "draft"
  ) {
    throw new Error(
      "Only draft template versions can be edited.",
    );
  }

  const question =
    editorData.version.questions.find(
      (item) =>
        item.questionId ===
        input.questionId,
    );

  if (!question) {
    throw new Error(
      "Question was not found in this template version.",
    );
  }

  const option =
    question.options.find(
      (item) =>
        item.optionId ===
        input.optionId,
    );

  if (!option) {
    throw new Error(
      "Answer option was not found for this question.",
    );
  }

  const normalizedOptionLabel =
    input.optionLabel.trim();

  if (!normalizedOptionLabel) {
    throw new Error(
      "Answer option label is required.",
    );
  }

  const normalizedScoreValue =
    input.scoreValue?.trim() || null;

  if (
    normalizedScoreValue !== null &&
    Number.isNaN(
      Number(normalizedScoreValue),
    )
  ) {
    throw new Error(
      "Score value must be numeric.",
    );
  }

  await db
    .update(
      templateQuestionOptions,
    )
    .set({
      optionLabel:
        normalizedOptionLabel,

      optionDescription:
        input.optionDescription?.trim() ||
        null,

      scoreValue:
        normalizedScoreValue,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        templateQuestionOptions.id,
        input.optionId,
      ),
    );
}