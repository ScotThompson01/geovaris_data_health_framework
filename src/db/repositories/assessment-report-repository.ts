import {
  buildAssessmentReport,
  type AssessmentReportModel,
} from "@/domain/reporting/assessment-report";

import {
  getAssessmentResultsByCode,
} from "@/db/repositories/assessment-repository";

export async function getAssessmentReportByCode(
  assessmentCode: string,
): Promise<AssessmentReportModel | null> {
  const results =
    await getAssessmentResultsByCode(
      assessmentCode,
    );

  if (!results) {
    return null;
  }

  const {
    assessment,
    responses,
    sectionScores,
    overallScore,
  } = results;

  return buildAssessmentReport({
    metadata: {
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

      methodologyName:
        assessment.methodologyName,

      templateName:
        assessment.templateName,

      versionLabel:
        assessment.versionLabel,

      submittedAt:
        assessment.submittedAt,

      completedAt:
        assessment.completedAt,
    },

    questions:
      responses.map(
        (response) => ({
          questionId:
            response.questionId,

          questionCode:
            response.questionCode,

          questionText:
            response.questionText,

          sectionId:
            response.sectionId,

          sectionName:
            response.sectionName,

          sectionOrder:
            response.sectionOrder,

          responseId:
            response.responseId,

          selectedOptionCode:
            response.selectedOptionCode,

          selectedOptionLabel:
            response.selectedOptionLabel,

          isNotApplicable:
            response.isNotApplicable,

          respondentComment:
            response.respondentComment,

          normalizedScore:
            response.normalizedScore,
        }),
      ),

    sectionScores:
      sectionScores.map(
        (score) => ({
          sectionId:
            score.sectionId,

          normalizedScore:
            score.normalizedScore,
        }),
      ),

    overallScore:
      overallScore
        ? {
            normalizedScore:
              overallScore.normalizedScore,
          }
        : null,
  });
}