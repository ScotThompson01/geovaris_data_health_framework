import {
  and,
  asc,
  eq,
  isNull,
} from "drizzle-orm";

import { db } from "@/db/client";

import {
  assessmentResponseScores,
  assessmentResponses,
  assessments,
  assessmentScores,
  assessmentTemplateVersions,
  assessmentTemplates,
  clients,
  frameworks,
  assessmentMethodologies,
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

      clientName: clients.name,

      frameworkName: frameworks.name,

      methodologyName: assessmentMethodologies.name,

      templateName: assessmentTemplates.name,

      versionLabel:
        assessmentTemplateVersions.versionLabel,
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
  // Questions + Responses + Response Scores
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
    .from(assessmentResponses)
    .innerJoin(
      templateQuestions,
      eq(
        templateQuestions.id,
        assessmentResponses.questionId,
      ),
    )
    .innerJoin(
      templateSections,
      eq(
        templateSections.id,
        templateQuestions.sectionId,
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
        assessmentResponses.assessmentId,
        assessment.id,
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
      normalizedScore:
        assessmentScores.normalizedScore,
      rawScore:
        assessmentScores.rawScore,
      maximumScore:
        assessmentScores.maximumScore,
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
      normalizedScore:
        assessmentScores.normalizedScore,
      rawScore:
        assessmentScores.rawScore,
      maximumScore:
        assessmentScores.maximumScore,
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
    sectionScores,
    overallScore: overallScore ?? null,
  };
}
