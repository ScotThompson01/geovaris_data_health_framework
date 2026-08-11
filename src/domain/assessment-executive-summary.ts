export type ExecutiveSummaryInput = {
  overallScore: number | null;
  maturityLevel: string;
  strengths: string[];
  improvementAreas: string[];
  criticalGaps: string[];
};

export type ExecutiveAssessmentSummary = {
  headline: string;
  summary: string;
  recommendedFocus: string;
};

export function buildExecutiveAssessmentSummary(
  input: ExecutiveSummaryInput,
): ExecutiveAssessmentSummary {
  const {
    overallScore,
    maturityLevel,
    strengths,
    improvementAreas,
    criticalGaps,
  } = input;

  const scoreText =
    overallScore === null
      ? "not yet available"
      : `${overallScore.toLocaleString(
          undefined,
          {
            maximumFractionDigits: 2,
          },
        )}%`;

  const headline =
    `Overall data health is ${scoreText} at ${maturityLevel}.`;

  let summary: string;

  if (criticalGaps.length > 0) {
    summary =
      "The assessment identified material data capability gaps that should be addressed before the organization advances broader data, analytics, or AI initiatives.";
  } else if (improvementAreas.length > 0) {
    summary =
      "The organization has established foundational data capabilities, but opportunities remain to improve consistency, ownership, governance, and operational effectiveness.";
  } else {
    summary =
      "The assessment indicates strong and consistently established data practices across the evaluated capabilities.";
  }

  let recommendedFocus: string;

  if (criticalGaps.length > 0) {
    recommendedFocus =
      "Prioritize remediation of the identified critical gaps, establish accountable ownership, and implement measurable controls before expanding data-dependent initiatives.";
  } else if (improvementAreas.length > 0) {
    recommendedFocus =
      "Focus on formalizing partially established capabilities, strengthening accountability, and improving repeatability across the highest-priority improvement areas.";
  } else if (strengths.length > 0) {
    recommendedFocus =
      "Maintain current strengths while extending proven practices across additional business areas and monitoring continued effectiveness.";
  } else {
    recommendedFocus =
      "Continue evaluating data capabilities as additional assessment information becomes available.";
  }

  return {
    headline,
    summary,
    recommendedFocus,
  };
}