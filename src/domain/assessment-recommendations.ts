import type {
  AssessmentFindingResult,
} from "@/domain/assessment-findings";

export type AssessmentRecommendationPriority =
  | "none"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AssessmentRecommendationResult = {
  title: string;
  recommendation: string;
  priority: AssessmentRecommendationPriority;
};

export function getAssessmentRecommendation(
  finding: AssessmentFindingResult | null,
  questionCode: string,
  questionText: string,
): AssessmentRecommendationResult | null {
  if (!finding) {
    return null;
  }

  switch (finding.type) {
    case "Strength":
      return {
        title: "Maintain and Extend",
        recommendation:
          "Maintain the current capability and look for opportunities to standardize, document, and extend the practice across additional business areas.",
        priority: "low",
      };

    case "Positive Practice":
      return {
        title: "Continue Maturing",
        recommendation:
          "Continue strengthening this capability through broader adoption, consistent measurement, and documented operating practices.",
        priority: "low",
      };

    case "Improvement Opportunity":
      return {
        title: "Formalize and Improve",
        recommendation:
          "Formalize the capability with documented standards, clear ownership, repeatable processes, and measurable controls to improve consistency and effectiveness.",
        priority: "medium",
      };

    case "Significant Gap":
      return {
        title: "Remediate Material Gap",
        recommendation:
          "Establish a structured remediation plan with assigned ownership, defined standards, measurable controls, and a target date for implementation.",
        priority: "high",
      };

    case "Critical Gap":
      return {
        title: "Prioritize Immediate Remediation",
        recommendation:
          "Prioritize remediation of this capability because the current gap represents a significant data-health risk. Define accountable ownership, immediate corrective actions, and measurable success criteria.",
        priority: "critical",
      };

    case "Excluded":
      return null;

    default:
      return {
        title: `Review ${questionCode}`,
        recommendation:
          `Review the assessed capability related to "${questionText}" and determine whether additional governance, controls, or documentation are required.`,
        priority: "medium",
      };
  }
}