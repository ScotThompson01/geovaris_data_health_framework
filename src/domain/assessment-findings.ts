export type AssessmentFindingType =
  | "Strength"
  | "Positive Practice"
  | "Improvement Opportunity"
  | "Significant Gap"
  | "Critical Gap"
  | "Excluded";

export type AssessmentFindingSeverity =
  | "none"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AssessmentFindingResult = {
  type: AssessmentFindingType;
  severity: AssessmentFindingSeverity;
  minimumScore: number | null;
  maximumScore: number | null;
  label: string;
  description: string;
};

export const ASSESSMENT_FINDING_LEVELS: AssessmentFindingResult[] = [
  {
    type: "Critical Gap",
    severity: "critical",
    minimumScore: 0,
    maximumScore: 29.99,
    label: "Critical Gap",
    description:
      "The assessed capability is largely absent or ineffective and represents a significant data-health risk.",
  },
  {
    type: "Significant Gap",
    severity: "high",
    minimumScore: 30,
    maximumScore: 49.99,
    label: "Significant Gap",
    description:
      "The assessed capability is partially established but has material weaknesses that should be addressed.",
  },
  {
    type: "Improvement Opportunity",
    severity: "medium",
    minimumScore: 50,
    maximumScore: 69.99,
    label: "Improvement Opportunity",
    description:
      "The assessed capability is defined but has meaningful opportunities to improve consistency, adoption, or effectiveness.",
  },
  {
    type: "Positive Practice",
    severity: "low",
    minimumScore: 70,
    maximumScore: 89.99,
    label: "Positive Practice",
    description:
      "The assessed capability is well established and operating effectively, with some opportunity for further optimization.",
  },
  {
    type: "Strength",
    severity: "none",
    minimumScore: 90,
    maximumScore: 100,
    label: "Strength",
    description:
      "The assessed capability demonstrates mature and consistently effective data practices.",
  },
  {
    type: "Excluded",
    severity: "none",
    minimumScore: null,
    maximumScore: null,
    label: "Not Applicable",
    description:
      "The assessment question was marked Not Applicable and is excluded from scoring and finding prioritization.",
  },
];

export function getAssessmentFinding(
  score: number | string | null | undefined,
  isNotApplicable = false,
): AssessmentFindingResult | null {
  if (isNotApplicable) {
    return (
      ASSESSMENT_FINDING_LEVELS.find(
        (finding) =>
          finding.type === "Excluded",
      ) ?? null
    );
  }

  if (
    score === null ||
    score === undefined
  ) {
    return null;
  }

  const numericScore = Number(score);

  if (
    Number.isNaN(numericScore) ||
    numericScore < 0 ||
    numericScore > 100
  ) {
    return null;
  }

  if (numericScore < 30) {
    return ASSESSMENT_FINDING_LEVELS[0];
  }

  if (numericScore < 50) {
    return ASSESSMENT_FINDING_LEVELS[1];
  }

  if (numericScore < 70) {
    return ASSESSMENT_FINDING_LEVELS[2];
  }

  if (numericScore < 90) {
    return ASSESSMENT_FINDING_LEVELS[3];
  }

  return ASSESSMENT_FINDING_LEVELS[4];
}

function cleanQuestionText(
  questionText: string,
) {
  return questionText
    .trim()
    .replace(/\?$/, "");
}

export function buildFindingStatement(
  questionCode: string,
  questionText: string,
  score: number | string | null | undefined,
  selectedOptionCode:
    | string
    | null
    | undefined,
  isNotApplicable = false,
): string | null {
  const finding =
    getAssessmentFinding(
      score,
      isNotApplicable,
    );

  if (!finding) {
    return null;
  }

  if (
    finding.type === "Excluded" ||
    selectedOptionCode === "NA"
  ) {
    return null;
  }

  const subject =
    cleanQuestionText(questionText);

  switch (selectedOptionCode) {
    case "YES":
      return `${finding.type}: ${subject} is established and operating effectively.`;

    case "PARTIAL":
      return `${finding.type}: ${subject} is partially established and would benefit from greater consistency, formalization, or adoption.`;

    case "NO":
      return `${finding.type}: ${subject} is not sufficiently established and represents a data-health gap that should be addressed.`;

    default:
      return `${finding.type}: The assessed capability related to ${questionCode} requires further review.`;
  }
}