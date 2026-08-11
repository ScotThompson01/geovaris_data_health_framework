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

export async function getAssessmentRunnerByCode(
  assessmentCode: string,
) {
  // --------------------------------------------------
  // Assessment Header
  // --------------------------------------------------

  const [assessment] = await db
    .select({
      id: assessments.id,
      assessmentCode: assessments.assessmentCode,
      assessmentName: assessments.name,
      assessmentStatus: assessments.status,
      templateVersionId: assessments.templateVersionId,

      clientName: clients.name,
      frameworkName: frameworks.name,
      methodologyName: assessmentMethodologies.name,
      templateName: assessmentTemplates.name,
      versionLabel: assessmentTemplateVersions.versionLabel,
    })
    .from(assessments)
    .innerJoin(
      clients,
      eq(clients.id, assessments.clientId),
    )
    .innerJoin(
      frameworks,
      eq(frameworks.id, assessments.frameworkId),
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
  // All Questions + Existing Responses + Scores
  // --------------------------------------------------

  const responses = await db
    .select({
      sectionId: templateSections.id,
      sectionName: templateSections.name,
      sectionOrder: templateSections.displayOrder,

      questionId: templateQuestions.id,
      questionCode: templateQuestions.questionCode,
      questionText: templateQuestions.questionText,
      guidanceText: templateQuestions.guidanceText,
      questionOrder: templateQuestions.displayOrder,

      responseId: assessmentResponses.id,
      responseStatus: assessmentResponses.status,
      respondentComment:
        assessmentResponses.respondentComment,

      selectedOptionId:
        templateQuestionOptions.id,
      selectedOptionLabel:
        templateQuestionOptions.optionLabel,
      selectedOptionCode:
        templateQuestionOptions.optionCode,
      selectedOptionCode:
        templateQuestionOptions.optionCode,
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
      asc(templateSections.displayOrder),
      asc(templateQuestions.displayOrder),
    );

  // --------------------------------------------------
  // Available Question Options
  // --------------------------------------------------

  const availableOptions = await db
    .select({
      questionId: templateQuestionOptions.questionId,
      optionId: templateQuestionOptions.id,
      optionCode: templateQuestionOptions.optionCode,
      optionLabel: templateQuestionOptions.optionLabel,
      optionDescription:
        templateQuestionOptions.optionDescription,
      optionValue: templateQuestionOptions.optionValue,
      scoreValue: templateQuestionOptions.scoreValue,
      displayOrder: templateQuestionOptions.displayOrder,
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
      asc(templateQuestionOptions.displayOrder),
    );

  // --------------------------------------------------
  // Section Scores
  // --------------------------------------------------

  const sectionScores = await db
    .select({
      sectionId: assessmentScores.sectionId,

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
  // Overall Assessment Score
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
        isNull(assessmentScores.sectionId),
      ),
    )
    .limit(1);

  return {
    assessment,
    responses,
    availableOptions,
    sectionScores,
    overallScore: overallScore ?? null,
  };
}

export async function getAssessmentSummaries() {
  const assessmentList = await db
    .select({
      assessmentId: assessments.id,
      assessmentCode: assessments.assessmentCode,
      assessmentName: assessments.name,
      assessmentStatus: assessments.status,

      clientName: clients.name,

      frameworkName: frameworks.name,

      templateVersionId: assessments.templateVersionId,
    })
    .from(assessments)
    .innerJoin(
      clients,
      eq(clients.id, assessments.clientId),
    )
    .innerJoin(
      frameworks,
      eq(frameworks.id, assessments.frameworkId),
    )
    .orderBy(
      asc(assessments.createdAt),
    );

  const summaries = [];

  for (const assessment of assessmentList) {
    const questions = await db
      .select({
        questionId: templateQuestions.id,
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
        questionId: assessmentResponses.questionId,
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

    const totalQuestions = questions.length;

    const answeredQuestions = responses.length;

    const completionPercent =
      totalQuestions === 0
        ? 0
        : Math.round(
            (answeredQuestions / totalQuestions) * 100,
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
        overallScore?.normalizedScore ?? null,
    });
  }

  return summaries;
}

export async function getAssessmentResultsByCode(
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
      assessmentName: assessments.name,
      assessmentStatus:
        assessments.status,
      templateVersionId:
        assessments.templateVersionId,

      submittedAt:
        assessments.submittedAt,
      completedAt:
        assessments.completedAt,

      clientName: clients.name,
      frameworkName: frameworks.name,
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
      sectionId: templateSections.id,
      sectionName: templateSections.name,
      sectionOrder:
        templateSections.displayOrder,

      questionId: templateQuestions.id,
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
      asc(templateSections.displayOrder),
      asc(templateQuestions.displayOrder),
    );

  // --------------------------------------------------
  // Section Scores
  // --------------------------------------------------

  const sectionScores = await db
    .select({
      sectionId: assessmentScores.sectionId,
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
          (answeredQuestions /
            totalQuestions) *
            100,
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