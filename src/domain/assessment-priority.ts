import type {
  AssessmentRecommendationPriority,
} from "@/domain/assessment-recommendations";

export type AssessmentActionHorizon =
  | "Immediate"
  | "Near Term"
  | "Planned"
  | "Monitor"
  | "Maintain";

export type AssessmentPriorityResult = {
  priority:
    AssessmentRecommendationPriority;
  rank: number;
  actionHorizon:
    AssessmentActionHorizon;
  description: string;
};

export function getAssessmentPriority(
  priority:
    AssessmentRecommendationPriority,
): AssessmentPriorityResult {
  switch (priority) {
    case "critical":
      return {
        priority,
        rank: 1,
        actionHorizon: "Immediate",
        description:
          "Address immediately because the issue represents a significant data-health risk or material capability gap.",
      };

    case "high":
      return {
        priority,
        rank: 2,
        actionHorizon: "Near Term",
        description:
          "Address in the near term through a defined remediation plan with accountable ownership and target dates.",
      };

    case "medium":
      return {
        priority,
        rank: 3,
        actionHorizon: "Planned",
        description:
          "Include in the planned improvement roadmap and address through defined standards, ownership, and measurable controls.",
      };

    case "low":
      return {
        priority,
        rank: 4,
        actionHorizon: "Monitor",
        description:
          "Continue maturing the capability while monitoring consistency, adoption, and effectiveness.",
      };

    case "none":
    default:
      return {
        priority: "none",
        rank: 5,
        actionHorizon: "Maintain",
        description:
          "Maintain the current capability and preserve the practices that are producing strong results.",
      };
  }
}