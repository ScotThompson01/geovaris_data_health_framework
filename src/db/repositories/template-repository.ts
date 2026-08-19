import { randomUUID } from "node:crypto";

import {
  and,
  asc,
  desc,
  eq,
  inArray,
} from "drizzle-orm";

import { db } from "@/db/client";

import {
  answerOptionSetItems,
  answerOptionSets,
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
// Template Creation Options
// ==================================================

export async function getTemplateCreationOptions() {
  const methodologies = await db
    .select({
      methodologyId:
        assessmentMethodologies.id,

      methodologyName:
        assessmentMethodologies.name,

      methodologyCode:
        assessmentMethodologies.code,

      methodologyStatus:
        assessmentMethodologies.status,

      organizationId:
        assessmentMethodologies.organizationId,

      frameworkId:
        frameworks.id,

      frameworkName:
        frameworks.name,

      frameworkCode:
        frameworks.code,

      frameworkStatus:
        frameworks.status,
    })
    .from(assessmentMethodologies)
    .innerJoin(
      frameworks,
      eq(
        frameworks.id,
        assessmentMethodologies.frameworkId,
      ),
    )
    .orderBy(
      asc(frameworks.name),
      asc(assessmentMethodologies.name),
    );

  return {
    methodologies,
  };
}

// ==================================================
// Answer Option Set List
// ==================================================

export async function getActiveAnswerOptionSets(
  organizationId: string,
) {
  const sets = await db
    .select({
      answerOptionSetId:
        answerOptionSets.id,

      name:
        answerOptionSets.name,

      code:
        answerOptionSets.code,

      description:
        answerOptionSets.description,

      status:
        answerOptionSets.status,
    })
    .from(answerOptionSets)
    .where(
      eq(
        answerOptionSets.organizationId,
        organizationId,
      ),
    )
    .orderBy(
      asc(
        answerOptionSets.name,
      ),
    );

  return sets.filter(
    (set) =>
      set.status === "active",
  );
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

    organizationId:
      template.organizationId,

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
// Publish Draft Template Version
// ==================================================

export type PublishDraftTemplateVersionInput = {
  templateId: string;
  versionId: string;
};

export async function publishDraftTemplateVersion(
  input: PublishDraftTemplateVersionInput,
) {
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

  // -----------------------------------------------
  // Draft protection
  // -----------------------------------------------

  if (
    editorData.version.versionStatus !==
    "draft"
  ) {
    throw new Error(
      "Only draft template versions can be published.",
    );
  }

  // -----------------------------------------------
  // Basic structural validation
  // -----------------------------------------------

  if (
    editorData.version.sections.length === 0
  ) {
    throw new Error(
      "A template version must contain at least one section before it can be published.",
    );
  }

  if (
    editorData.version.questions.length === 0
  ) {
    throw new Error(
      "A template version must contain at least one question before it can be published.",
    );
  }

  // -----------------------------------------------
  // Publish version
  // -----------------------------------------------

  const now =
    new Date();

  const [publishedVersion] =
    await db
      .update(
        assessmentTemplateVersions,
      )
      .set({
        status:
          "published",

        publishedAt:
          now,

        updatedAt:
          now,
      })
      .where(
        and(
          eq(
            assessmentTemplateVersions.id,
            input.versionId,
          ),
          eq(
            assessmentTemplateVersions.templateId,
            input.templateId,
          ),
        ),
      )
      .returning();

  if (!publishedVersion) {
    throw new Error(
      "Template version could not be published.",
    );
  }

  // -----------------------------------------------
  // Activate parent template
  // -----------------------------------------------

  await db
    .update(
      assessmentTemplates,
    )
    .set({
      status:
        "active",

      updatedAt:
        now,
    })
    .where(
      eq(
        assessmentTemplates.id,
        input.templateId,
      ),
    );

  return {
    templateId:
      input.templateId,

    versionId:
      publishedVersion.id,

    versionNumber:
      publishedVersion.versionNumber,

    versionLabel:
      publishedVersion.versionLabel,

    versionStatus:
      publishedVersion.status,

    publishedAt:
      publishedVersion.publishedAt,
  };
}

// ==================================================
// Create Draft Template Section
// ==================================================

export type CreateDraftTemplateSectionInput = {
  templateId: string;
  versionId: string;
  name: string;
  code: string;
  description?: string | null;
  displayOrder?: number;
  weight?: string | null;
  isRequired?: boolean;
};

export async function createDraftTemplateSection(
  input: CreateDraftTemplateSectionInput,
) {
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
      "Sections can only be added to draft template versions.",
    );
  }

  const normalizedName =
    input.name.trim();

  const normalizedCode =
    input.code.trim().toUpperCase();

  if (!normalizedName) {
    throw new Error(
      "Section name is required.",
    );
  }

  if (!normalizedCode) {
    throw new Error(
      "Section code is required.",
    );
  }

  const duplicateCode =
    editorData.version.sections.some(
      (section) =>
        section.sectionName
          .trim()
          .toLowerCase() ===
        normalizedName.toLowerCase(),
    );

  if (duplicateCode) {
    throw new Error(
      `A section named "${normalizedName}" already exists in this version.`,
    );
  }

  const displayOrder =
    input.displayOrder ??
    editorData.version.sections.length + 1;

  const [createdSection] = await db
    .insert(templateSections)
    .values({
      organizationId:
        editorData.organizationId,

      templateVersionId:
        input.versionId,

      parentSectionId:
        null,

      name:
        normalizedName,

      code:
        normalizedCode,

      description:
        input.description?.trim() ||
        null,

      displayOrder,

      weight:
        input.weight?.trim() ||
        null,

      isRequired:
        input.isRequired ?? true,

      status:
        "active",
    })
    .returning();

  return createdSection;
}

// ==================================================
// Create Draft Template Question
// ==================================================

export type CreateDraftTemplateQuestionInput = {
  templateId: string;
  versionId: string;
  sectionId: string;
  questionCode: string;
  questionText: string;
  guidanceText?: string | null;
  answerType?: string;
  displayOrder?: number;
  weight?: string | null;
  isRequired?: boolean;
  allowsNotApplicable?: boolean;
  requiresComment?: boolean;
  requiresEvidence?: boolean;
};

export async function createDraftTemplateQuestion(
  input: CreateDraftTemplateQuestionInput,
) {
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
      "Questions can only be added to draft template versions.",
    );
  }

  const section =
    editorData.version.sections.find(
      (item) =>
        item.sectionId ===
        input.sectionId,
    );

  if (!section) {
    throw new Error(
      "Selected section was not found in this template version.",
    );
  }

  const normalizedQuestionCode =
    input.questionCode
      .trim()
      .toUpperCase();

  const normalizedQuestionText =
    input.questionText.trim();

  if (!normalizedQuestionCode) {
    throw new Error(
      "Question code is required.",
    );
  }

  if (!normalizedQuestionText) {
    throw new Error(
      "Question text is required.",
    );
  }

  const duplicateQuestionCode =
    editorData.version.questions.some(
      (question) =>
        question.questionCode
          .trim()
          .toUpperCase() ===
        normalizedQuestionCode,
    );

  if (duplicateQuestionCode) {
    throw new Error(
      `Question code "${normalizedQuestionCode}" already exists in this version.`,
    );
  }

  const displayOrder =
    input.displayOrder ??
    editorData.version.questions.length + 1;

  const [createdQuestion] =
    await db
      .insert(templateQuestions)
      .values({
        organizationId:
          editorData.organizationId,

        templateVersionId:
          input.versionId,

        sectionId:
          input.sectionId,

        questionCode:
          normalizedQuestionCode,

        questionText:
          normalizedQuestionText,

        guidanceText:
          input.guidanceText?.trim() ||
          null,

        answerType:
          input.answerType?.trim() ||
          "single_select",

        displayOrder,

        weight:
          input.weight?.trim() ||
          null,

        isRequired:
          input.isRequired ?? true,

        allowsNotApplicable:
          input.allowsNotApplicable ??
          false,

        requiresComment:
          input.requiresComment ??
          false,

        requiresEvidence:
          input.requiresEvidence ??
          false,

        status:
          "active",
      })
      .returning();

  return createdQuestion;
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
// Create Draft Question Option
// ==================================================

export type CreateDraftQuestionOptionInput = {
  templateId: string;
  versionId: string;
  questionId: string;
  optionCode: string;
  optionLabel: string;
  optionDescription?: string | null;
  optionValue?: string | null;
  scoreValue?: string | null;
  displayOrder?: number;
  isNotApplicable?: boolean;
  requiresComment?: boolean;
  requiresEvidence?: boolean;
};

export async function createDraftQuestionOption(
  input: CreateDraftQuestionOptionInput,
) {
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
      "Answer options can only be added to draft template versions.",
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

  const normalizedOptionCode =
    input.optionCode
      .trim()
      .toUpperCase();

  const normalizedOptionLabel =
    input.optionLabel.trim();

  if (!normalizedOptionCode) {
    throw new Error(
      "Option code is required.",
    );
  }

  if (!normalizedOptionLabel) {
    throw new Error(
      "Option label is required.",
    );
  }

  const duplicateOptionCode =
    question.options.some(
      (option) =>
        option.optionCode
          .trim()
          .toUpperCase() ===
        normalizedOptionCode,
    );

  if (duplicateOptionCode) {
    throw new Error(
      `Option code "${normalizedOptionCode}" already exists for this question.`,
    );
  }

  const displayOrder =
    input.displayOrder ??
    question.options.length + 1;

  const normalizedScoreValue =
    input.scoreValue?.trim() ||
    null;

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

  const [createdOption] =
    await db
      .insert(
        templateQuestionOptions,
      )
      .values({
        organizationId:
          editorData.organizationId,

        questionId:
          input.questionId,

        optionCode:
          normalizedOptionCode,

        optionLabel:
          normalizedOptionLabel,

        optionDescription:
          input.optionDescription?.trim() ||
          null,

        optionValue:
          input.optionValue?.trim() ||
          null,

        scoreValue:
          normalizedScoreValue,

        displayOrder,

        isNotApplicable:
          input.isNotApplicable ??
          false,

        requiresComment:
          input.requiresComment ??
          false,

        requiresEvidence:
          input.requiresEvidence ??
          false,

        status:
          "active",
      })
      .returning();

  return createdOption;
}

// ==================================================
// Apply Answer Option Set
// ==================================================

export type ApplyAnswerOptionSetInput = {
  templateId: string;
  versionId: string;
  questionId: string;
  answerOptionSetId: string;
};

export async function applyAnswerOptionSet(
  input: ApplyAnswerOptionSetInput,
) {
  // -----------------------------------------------
  // Validate draft template version
  // -----------------------------------------------

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
      "Answer option sets can only be applied to draft template versions.",
    );
  }

  // -----------------------------------------------
  // Validate question
  // -----------------------------------------------

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

  // -----------------------------------------------
  // Prevent accidental duplicate options
  // -----------------------------------------------

  if (question.options.length > 0) {
    throw new Error(
      "This question already contains answer options. Remove the existing options before applying an answer option set.",
    );
  }

  // -----------------------------------------------
  // Validate answer option set
  // -----------------------------------------------

  const [answerOptionSet] = await db
    .select({
      answerOptionSetId:
        answerOptionSets.id,

      organizationId:
        answerOptionSets.organizationId,

      name:
        answerOptionSets.name,

      code:
        answerOptionSets.code,

      status:
        answerOptionSets.status,
    })
    .from(answerOptionSets)
    .where(
      eq(
        answerOptionSets.id,
        input.answerOptionSetId,
      ),
    )
    .limit(1);

  if (!answerOptionSet) {
    throw new Error(
      "Answer option set was not found.",
    );
  }

  if (
    answerOptionSet.organizationId !==
    editorData.organizationId
  ) {
    throw new Error(
      "Answer option set does not belong to this organization.",
    );
  }

  if (
    answerOptionSet.status !== "active"
  ) {
    throw new Error(
      "Only active answer option sets can be applied.",
    );
  }

  // -----------------------------------------------
  // Load answer option set items
  // -----------------------------------------------

  const setItems = await db
    .select()
    .from(answerOptionSetItems)
    .where(
      eq(
        answerOptionSetItems.answerOptionSetId,
        input.answerOptionSetId,
      ),
    )
    .orderBy(
      asc(
        answerOptionSetItems.displayOrder,
      ),
    );

  if (setItems.length === 0) {
    throw new Error(
      "Answer option set does not contain any options.",
    );
  }

  // -----------------------------------------------
  // Build question options
  // -----------------------------------------------

  const newOptions =
    setItems.map(
      (item) => ({
        id:
          randomUUID(),

        organizationId:
          editorData.organizationId,

        questionId:
          input.questionId,

        optionCode:
          item.optionCode,

        optionLabel:
          item.optionLabel,

        optionDescription:
          item.optionDescription,

        optionValue:
          item.optionValue,

        scoreValue:
          item.scoreValue,

        displayOrder:
          item.displayOrder,

        isNotApplicable:
          item.isNotApplicable,

        requiresComment:
          item.requiresComment,

        requiresEvidence:
          item.requiresEvidence,

        status:
          item.status,
      }),
    );

  // -----------------------------------------------
  // Apply set
  // -----------------------------------------------

  await db
    .insert(
      templateQuestionOptions,
    )
    .values(
      newOptions,
    );

  return {
    templateId:
      input.templateId,

    versionId:
      input.versionId,

    questionId:
      input.questionId,

    answerOptionSetId:
      input.answerOptionSetId,

    answerOptionSetName:
      answerOptionSet.name,

    optionCount:
      newOptions.length,
  };
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
// ==================================================
// Create Assessment Template
// ==================================================

export type CreateAssessmentTemplateInput = {
  methodologyId: string;
  name: string;
  description?: string | null;
  templateScope?: string;
};

export async function createAssessmentTemplate(
  input: CreateAssessmentTemplateInput,
) {
  const normalizedName =
    input.name.trim();

  if (!normalizedName) {
    throw new Error(
      "Template name is required.",
    );
  }

  // -----------------------------------------------
  // Validate methodology
  // -----------------------------------------------

  const [methodology] = await db
    .select({
      methodologyId:
        assessmentMethodologies.id,

      organizationId:
        assessmentMethodologies.organizationId,

      frameworkId:
        assessmentMethodologies.frameworkId,
    })
    .from(assessmentMethodologies)
    .where(
      eq(
        assessmentMethodologies.id,
        input.methodologyId,
      ),
    )
    .limit(1);

  if (!methodology) {
    throw new Error(
      "Assessment methodology was not found.",
    );
  }

  // -----------------------------------------------
  // Prevent duplicate template name
  // -----------------------------------------------

  const existingTemplates = await db
    .select({
      templateId:
        assessmentTemplates.id,

      templateName:
        assessmentTemplates.name,
    })
    .from(assessmentTemplates)
    .where(
      eq(
        assessmentTemplates.methodologyId,
        input.methodologyId,
      ),
    );

  const duplicateTemplate =
    existingTemplates.some(
      (template) =>
        template.templateName
          .trim()
          .toLowerCase() ===
        normalizedName.toLowerCase(),
    );

  if (duplicateTemplate) {
    throw new Error(
      `A template named "${normalizedName}" already exists for this methodology.`,
    );
  }

  // -----------------------------------------------
  // Generate IDs
  // -----------------------------------------------

  const templateId =
    randomUUID();

  const versionId =
    randomUUID();

  // -----------------------------------------------
  // Build template
  // -----------------------------------------------

  const newTemplate = {
    id:
      templateId,

    organizationId:
      methodology.organizationId,

    methodologyId:
      methodology.methodologyId,

    name:
      normalizedName,

    description:
      input.description?.trim() ||
      null,

    templateScope:
      input.templateScope?.trim() ||
      "master",

    status:
      "draft",
  };

  // -----------------------------------------------
  // Build initial Version 1.0
  // -----------------------------------------------

  const initialVersion = {
    id:
      versionId,

    organizationId:
      methodology.organizationId,

    templateId,

    versionNumber:
      1,

    versionLabel:
      "1.0",

    status:
      "draft",

    changeSummary:
      "Initial template version.",

    publishedAt:
      null,
  };

  // -----------------------------------------------
  // Create atomically
  // -----------------------------------------------

  await db.batch([
    db
      .insert(
        assessmentTemplates,
      )
      .values(
        newTemplate,
      ),

    db
      .insert(
        assessmentTemplateVersions,
      )
      .values(
        initialVersion,
      ),
  ]);

  return {
    templateId,
    versionId,

    templateName:
      normalizedName,

    versionNumber:
      1,

    versionLabel:
      "1.0",

    templateStatus:
      "draft",

    versionStatus:
      "draft",
  };
}