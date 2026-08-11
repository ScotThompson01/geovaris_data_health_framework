import {
  and,
  asc,
  eq,
  isNull,
} from "drizzle-orm";

import { db } from "@/db/client";

import {
  assessmentMethodologies,
  assessmentResponseScores,
  assessmentResponses,
  assessments,
  assessmentScores,
  assessmentTemplates,
  assessmentTemplateVersions,
  clients,
  frameworks,
  templateQuestionOptions,
  templateQuestions,
  templateSections,
} from "@/db/schema";

// ==================================================
// Assessment Runner
// ==================================================

export async function getAssessmentRunnerByCode(
  assessmentCode: string,
) {
  // --------------------------------------------------
  // Assessment Header
  // --------------------------------------------------

  const [assessment] = await db
    .select({
      id: assessments.id,
      assessmentCode:
        assessments.assessmentCode,
      assessmentName:
        assessments.name,
      assessmentStatus:
        assessments.status,
      templateVersionId:
        assessments.templateVersionId,

      clientName:
        clients.name,

      frameworkName:
        frameworks.name,

      methodologyName:
        assessmentMethodologies.name,

      templateName:
        assessmentTemplates.name,

      versionLabel:
        assessmentTemplateVersions.versionLabel,
    })
    .from(assessments)
    .innerJoin(
      clients,
      eq(
        clients.id,
        assessments.clientId,
      ),
    )
    .innerJoin(
      frameworks,
      eq(
        frameworks.id,
        assessments.frameworkId,
      ),
    )
    .innerJoin(
      assessmentMethodologies,
      eq(
        assessmentMethodologies.id,
        assessments.methodologyId,
      ),
    )
    .innerJoin(
      assessmentTemplates,
      eq(
        assessmentTemplates.id,
        assessments.templateId,
      ),
    )
    .innerJoin(
      assessmentTemplateVersions,
      eq(
        assessmentTemplateVersions.id,
        assessments.templateVersionId,
      ),
    )
    .where(
      eq(
        assessments.assessmentCode,
        assessmentCode,
      ),
    )
    .limit(1);

  if (!assessment) {
    return null;
  }

  // --------------------------------------------------
  // Questions + Responses + Question Scores
  // --------------------------------------------------

  const responses = await db
    .select({
      sectionId:
        templateSections.id,

      sectionName:
        templateSections.name,

      sectionOrder:
        templateSections.displayOrder,

      questionId:
        templateQuestions.id,

      questionCode:
        templateQuestions.questionCode,

      questionText:
        templateQuestions.questionText,

      isRequired:
        templateQuestions.isRequired,

      guidanceText:
        templateQuestions.guidanceText,

      questionOrder:
        templateQuestions.displayOrder,

      responseId:
        assessmentResponses.id,

      responseStatus:
        assessmentResponses.status,

      respondentComment:
        assessmentResponses.respondentComment,

      selectedOptionId:
        templateQuestionOptions.id,

      selectedOptionLabel:
        templateQuestionOptions.optionLabel,

      selectedOptionCode:
        templateQuestionOptions.optionCode,

      isNotApplicable:
        templateQuestionOptions.isNotApplicable,

      selectedOptionScore:
        templateQuestionOptions.scoreValue,

      rawScore:
        assessmentResponseScores.rawScore,

      maximumScore:
        assessmentResponseScores.maximumScore,

      normalizedScore:
        assessmentResponseScores.normalizedScore,

      weightedScore:
        assessmentResponseScores.weightedScore,
    })
    .from(templateQuestions)
    .innerJoin(
      templateSections,
      eq(
        templateSections.id,
        templateQuestions.sectionId,
      ),
    )
    .leftJoin(
      assessmentResponses,
      and(
        eq(
          assessmentResponses.questionId,
          templateQuestions.id,
        ),
        eq(
          assessmentResponses.assessmentId,
          assessment.id,
        ),
      ),
    )
    .leftJoin(
      templateQuestionOptions,
      eq(
        templateQuestionOptions.id,
        assessmentResponses.selectedOptionId,
      ),
    )
    .leftJoin(
      assessmentResponseScores,
      eq(
        assessmentResponseScores.assessmentResponseId,
        assessmentResponses.id,
      ),
    )
    .where(
      eq(
        templateSections.templateVersionId,
        assessment.templateVersionId,
      ),
    )
    .orderBy(
      asc(
        templateSections.displayOrder,
      ),
      asc(
        templateQuestions.displayOrder,
      ),
    );

  // --------------------------------------------------
  // Available Question Options
  // --------------------------------------------------

  const availableOptions = await db
    .select({
      questionId:
        templateQuestionOptions.questionId,

      optionId:
        templateQuestionOptions.id,

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
    })
    .from(templateQuestionOptions)
    .innerJoin(
      templateQuestions,
      eq(
        templateQuestions.id,
        templateQuestionOptions.questionId,
      ),
    )
    .where(
      eq(
        templateQuestions.templateVersionId,
        assessment.templateVersionId,
      ),
    )
    .orderBy(
      asc(
        templateQuestionOptions.displayOrder,
      ),
    );

  // --------------------------------------------------
  // Section Scores
  // --------------------------------------------------

  const sectionScores = await db
    .select({
      sectionId:
        assessmentScores.sectionId,

      rawScore:
        assessmentScores.rawScore,

      maximumScore:
        assessmentScores.maximumScore,

      normalizedScore:
        assessmentScores.normalizedScore,

      weightedScore:
        assessmentScores.weightedScore,

      scoringStatus:
        assessmentScores.scoringStatus,
    })
    .from(assessmentScores)
    .where(
      and(
        eq(
          assessmentScores.assessmentId,
          assessment.id,
        ),
        eq(
          assessmentScores.scoreScope,
          "section",
        ),
      ),
    );

  // --------------------------------------------------
  // Overall Score
  // --------------------------------------------------

  const [overallScore] = await db
    .select({
      rawScore:
        assessmentScores.rawScore,

      maximumScore:
        assessmentScores.maximumScore,

      normalizedScore:
        assessmentScores.normalizedScore,

      weightedScore:
        assessmentScores.weightedScore,

      scoringStatus:
        assessmentScores.scoringStatus,
    })
    .from(assessmentScores)
    .where(
      and(
        eq(
          assessmentScores.assessmentId,
          assessment.id,
        ),
        eq(
          assessmentScores.scoreScope,
          "overall",
        ),
        isNull(
          assessmentScores.sectionId,
        ),
      ),
    )
    .limit(1);

  return {
    assessment,
    responses,
    availableOptions,
    sectionScores,
    overallScore:
      overallScore ?? null,
  };
}

// ==================================================
// Assessment List Summaries
// ==================================================

export async function getAssessmentSummaries() {
  const assessmentList = await db
    .select({
      assessmentId:
        assessments.id,

      assessmentCode:
        assessments.assessmentCode,

      assessmentName:
        assessments.name,

      assessmentStatus:
        assessments.status,

      clientName:
        clients.name,

      frameworkName:
        frameworks.name,

      templateVersionId:
        assessments.templateVersionId,
    })
    .from(assessments)
    .innerJoin(
      clients,
      eq(
        clients.id,
        assessments.clientId,
      ),
    )
    .innerJoin(
      frameworks,
      eq(
        frameworks.id,
        assessments.frameworkId,
      ),
    )
    .orderBy(
      asc(
        assessments.createdAt,
      ),
    );

  const summaries = [];

  for (
    const assessment of assessmentList
  ) {
    const questions = await db
      .select({
        questionId:
          templateQuestions.id,
      })
      .from(templateQuestions)
      .innerJoin(
        templateSections,
        eq(
          templateSections.id,
          templateQuestions.sectionId,
        ),
      )
      .where(
        eq(
          templateSections.templateVersionId,
          assessment.templateVersionId,
        ),
      );

    const responses = await db
      .select({
        questionId:
          assessmentResponses.questionId,
      })
      .from(assessmentResponses)
      .where(
        eq(
          assessmentResponses.assessmentId,
          assessment.assessmentId,
        ),
      );

    const [overallScore] = await db
      .select({
        normalizedScore:
          assessmentScores.normalizedScore,
      })
      .from(assessmentScores)
      .where(
        and(
          eq(
            assessmentScores.assessmentId,
            assessment.assessmentId,
          ),
          eq(
            assessmentScores.scoreScope,
            "overall",
          ),
          isNull(
            assessmentScores.sectionId,
          ),
        ),
      )
      .limit(1);

    const totalQuestions =
      questions.length;

    const answeredQuestions =
      responses.length;

    const completionPercent =
      totalQuestions === 0
        ? 0
        : Math.round(
          (
            answeredQuestions /
            totalQuestions
          ) * 100,
        );

    summaries.push({
      assessmentId:
        assessment.assessmentId,

      assessmentCode:
        assessment.assessmentCode,

      assessmentName:
        assessment.assessmentName,

      assessmentStatus:
        assessment.assessmentStatus,

      clientName:
        assessment.clientName,

      frameworkName:
        assessment.frameworkName,

      totalQuestions,

      answeredQuestions,

      completionPercent,

      normalizedScore:
        overallScore?.normalizedScore ??
        null,
    });
  }

  return summaries;
}

// ==================================================
// Assessment Results
// ==================================================

export async function getAssessmentResultsByCode(
  assessmentCode: string,
) {
  // --------------------------------------------------
  // Assessment Header
  // --------------------------------------------------

  const [assessment] = await db
    .select({
      id:
        assessments.id,

      assessmentCode:
        assessments.assessmentCode,

      assessmentName:
        assessments.name,

      assessmentStatus:
        assessments.status,

      templateVersionId:
        assessments.templateVersionId,

      submittedAt:
        assessments.submittedAt,

      completedAt:
        assessments.completedAt,

      clientName:
        clients.name,

      frameworkName:
        frameworks.name,

      methodologyName:
        assessmentMethodologies.name,

      templateName:
        assessmentTemplates.name,

      versionLabel:
        assessmentTemplateVersions.versionLabel,
    })
    .from(assessments)
    .innerJoin(
      clients,
      eq(
        clients.id,
        assessments.clientId,
      ),
    )
    .innerJoin(
      frameworks,
      eq(
        frameworks.id,
        assessments.frameworkId,
      ),
    )
    .innerJoin(
      assessmentMethodologies,
      eq(
        assessmentMethodologies.id,
        assessments.methodologyId,
      ),
    )
    .innerJoin(
      assessmentTemplates,
      eq(
        assessmentTemplates.id,
        assessments.templateId,
      ),
    )
    .innerJoin(
      assessmentTemplateVersions,
      eq(
        assessmentTemplateVersions.id,
        assessments.templateVersionId,
      ),
    )
    .where(
      eq(
        assessments.assessmentCode,
        assessmentCode,
      ),
    )
    .limit(1);

  if (!assessment) {
    return null;
  }

  // --------------------------------------------------
  // Questions + Responses + Scores
  // --------------------------------------------------

  const responses = await db
    .select({
      sectionId:
        templateSections.id,

      sectionName:
        templateSections.name,

      sectionOrder:
        templateSections.displayOrder,

      questionId:
        templateQuestions.id,

      questionCode:
        templateQuestions.questionCode,

      questionText:
        templateQuestions.questionText,

      questionOrder:
        templateQuestions.displayOrder,

      responseId:
        assessmentResponses.id,

      selectedOptionLabel:
        templateQuestionOptions.optionLabel,

      selectedOptionCode:
        templateQuestionOptions.optionCode,

      isNotApplicable:
        templateQuestionOptions.isNotApplicable,

      respondentComment:
        assessmentResponses.respondentComment,

      normalizedScore:
        assessmentResponseScores.normalizedScore,
    })
    .from(templateQuestions)
    .innerJoin(
      templateSections,
      eq(
        templateSections.id,
        templateQuestions.sectionId,
      ),
    )
    .leftJoin(
      assessmentResponses,
      and(
        eq(
          assessmentResponses.questionId,
          templateQuestions.id,
        ),
        eq(
          assessmentResponses.assessmentId,
          assessment.id,
        ),
      ),
    )
    .leftJoin(
      templateQuestionOptions,
      eq(
        templateQuestionOptions.id,
        assessmentResponses.selectedOptionId,
      ),
    )
    .leftJoin(
      assessmentResponseScores,
      eq(
        assessmentResponseScores.assessmentResponseId,
        assessmentResponses.id,
      ),
    )
    .where(
      eq(
        templateSections.templateVersionId,
        assessment.templateVersionId,
      ),
    )
    .orderBy(
      asc(
        templateSections.displayOrder,
      ),
      asc(
        templateQuestions.displayOrder,
      ),
    );

  // --------------------------------------------------
  // Section Scores
  // --------------------------------------------------

  const sectionScores = await db
    .select({
      sectionId:
        assessmentScores.sectionId,

      rawScore:
        assessmentScores.rawScore,

      maximumScore:
        assessmentScores.maximumScore,

      normalizedScore:
        assessmentScores.normalizedScore,

      weightedScore:
        assessmentScores.weightedScore,

      scoringStatus:
        assessmentScores.scoringStatus,
    })
    .from(assessmentScores)
    .where(
      and(
        eq(
          assessmentScores.assessmentId,
          assessment.id,
        ),
        eq(
          assessmentScores.scoreScope,
          "section",
        ),
      ),
    );

  // --------------------------------------------------
  // Overall Score
  // --------------------------------------------------

  const [overallScore] = await db
    .select({
      rawScore:
        assessmentScores.rawScore,

      maximumScore:
        assessmentScores.maximumScore,

      normalizedScore:
        assessmentScores.normalizedScore,

      weightedScore:
        assessmentScores.weightedScore,

      scoringStatus:
        assessmentScores.scoringStatus,
    })
    .from(assessmentScores)
    .where(
      and(
        eq(
          assessmentScores.assessmentId,
          assessment.id,
        ),
        eq(
          assessmentScores.scoreScope,
          "overall",
        ),
        isNull(
          assessmentScores.sectionId,
        ),
      ),
    )
    .limit(1);

  // --------------------------------------------------
  // Progress
  // --------------------------------------------------

  const totalQuestions =
    responses.length;

  const answeredQuestions =
    responses.filter(
      (response) =>
        response.responseId !== null,
    ).length;

  const completionPercent =
    totalQuestions === 0
      ? 0
      : Math.round(
        (
          answeredQuestions /
          totalQuestions
        ) * 100,
      );

  return {
    assessment,
    responses,
    sectionScores,
    overallScore:
      overallScore ?? null,

    progress: {
      totalQuestions,
      answeredQuestions,
      completionPercent,
    },
  };
}

// ==================================================
// Assessment Creation Options
// ==================================================

export async function getAssessmentCreationOptions() {
  const clientOptions = await db
    .select({
      id: clients.id,
      organizationId:
        clients.organizationId,
      name: clients.name,
      status: clients.status,
    })
    .from(clients)
    .orderBy(
      asc(clients.name),
    );

  const templateOptions = await db
    .select({
      frameworkId:
        frameworks.id,

      frameworkName:
        frameworks.name,

      methodologyId:
        assessmentMethodologies.id,

      methodologyName:
        assessmentMethodologies.name,

      templateId:
        assessmentTemplates.id,

      templateName:
        assessmentTemplates.name,

      templateVersionId:
        assessmentTemplateVersions.id,

      versionLabel:
        assessmentTemplateVersions.versionLabel,

      versionStatus:
        assessmentTemplateVersions.status,
    })
    .from(
      assessmentTemplateVersions,
    )
    .innerJoin(
      assessmentTemplates,
      eq(
        assessmentTemplates.id,
        assessmentTemplateVersions.templateId,
      ),
    )
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
      asc(
        assessmentMethodologies.name,
      ),
      asc(
        assessmentTemplates.name,
      ),
      asc(
        assessmentTemplateVersions.versionNumber,
      ),
    );

  return {
    clients: clientOptions,
    templates: templateOptions,
  };
}

// ==================================================
// Create Assessment
// ==================================================

export async function createAssessment(
  input: {
    clientId: string;
    templateVersionId: string;
    assessmentCode: string;
    assessmentName: string;
    description?: string | null;
  },
) {
  // --------------------------------------------------
  // Resolve Client
  // --------------------------------------------------

  const [client] = await db
    .select({
      id: clients.id,
      organizationId:
        clients.organizationId,
    })
    .from(clients)
    .where(
      eq(
        clients.id,
        input.clientId,
      ),
    )
    .limit(1);

  if (!client) {
    throw new Error(
      "Selected client was not found.",
    );
  }

  // --------------------------------------------------
  // Resolve Template / Methodology / Framework
  // --------------------------------------------------

  const [template] = await db
    .select({
      templateVersionId:
        assessmentTemplateVersions.id,

      templateId:
        assessmentTemplates.id,

      methodologyId:
        assessmentMethodologies.id,

      frameworkId:
        frameworks.id,

      organizationId:
        assessmentTemplates.organizationId,
    })
    .from(
      assessmentTemplateVersions,
    )
    .innerJoin(
      assessmentTemplates,
      eq(
        assessmentTemplates.id,
        assessmentTemplateVersions.templateId,
      ),
    )
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
        assessmentTemplateVersions.id,
        input.templateVersionId,
      ),
    )
    .limit(1);

  if (!template) {
    throw new Error(
      "Selected assessment template version was not found.",
    );
  }

  // --------------------------------------------------
  // Validate Organization Boundary
  // --------------------------------------------------

  if (
    client.organizationId !==
    template.organizationId
  ) {
    throw new Error(
      "Client and assessment template belong to different organizations.",
    );
  }

  // --------------------------------------------------
  // Prevent Duplicate Assessment Code
  // --------------------------------------------------

  const [existingAssessment] =
    await db
      .select({
        id: assessments.id,
      })
      .from(assessments)
      .where(
        and(
          eq(
            assessments.organizationId,
            client.organizationId,
          ),
          eq(
            assessments.assessmentCode,
            input.assessmentCode,
          ),
        ),
      )
      .limit(1);

  if (existingAssessment) {
    throw new Error(
      `Assessment code ${input.assessmentCode} already exists.`,
    );
  }

  // --------------------------------------------------
  // Create Draft Assessment
  // --------------------------------------------------

  const [newAssessment] = await db
    .insert(assessments)
    .values({
      organizationId:
        client.organizationId,

      clientId:
        client.id,

      frameworkId:
        template.frameworkId,

      methodologyId:
        template.methodologyId,

      templateId:
        template.templateId,

      templateVersionId:
        template.templateVersionId,

      assessmentCode:
        input.assessmentCode,

      name:
        input.assessmentName,

      description:
        input.description ?? null,

      status:
        "draft",

      updatedAt:
        new Date(),
    })
    .returning({
      id: assessments.id,
      assessmentCode:
        assessments.assessmentCode,
      assessmentName:
        assessments.name,
      status:
        assessments.status,
    });

  return newAssessment;
}