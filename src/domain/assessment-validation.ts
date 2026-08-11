export type AssessmentValidationInput = {
  totalQuestions: number;
  answeredQuestions: number;
  requiredQuestions: number;
  answeredRequiredQuestions: number;
  assessmentStatus: string;
};

export type AssessmentValidationResult = {
  isComplete: boolean;
  canComplete: boolean;
  unansweredQuestions: number;
  unansweredRequiredQuestions: number;
  progressPercent: number;
  issues: string[];
};

export function validateAssessmentState(
  input: AssessmentValidationInput,
): AssessmentValidationResult {
  const {
    totalQuestions,
    answeredQuestions,
    requiredQuestions,
    answeredRequiredQuestions,
    assessmentStatus,
  } = input;

  const unansweredQuestions =
    Math.max(
      totalQuestions - answeredQuestions,
      0,
    );

  const unansweredRequiredQuestions =
    Math.max(
      requiredQuestions -
        answeredRequiredQuestions,
      0,
    );

  const progressPercent =
    totalQuestions === 0
      ? 0
      : Math.round(
          (answeredQuestions /
            totalQuestions) *
            100,
        );

  const isComplete =
    assessmentStatus === "completed";

  const canComplete =
    !isComplete &&
    totalQuestions > 0 &&
    unansweredRequiredQuestions === 0;

  const issues: string[] = [];

  if (totalQuestions === 0) {
    issues.push(
      "Assessment contains no questions.",
    );
  }

  if (
    answeredQuestions >
    totalQuestions
  ) {
    issues.push(
      "Answered question count exceeds total question count.",
    );
  }

  if (
    answeredRequiredQuestions >
    requiredQuestions
  ) {
    issues.push(
      "Answered required-question count exceeds required-question count.",
    );
  }

  if (
    isComplete &&
    unansweredRequiredQuestions > 0
  ) {
    issues.push(
      "Assessment is marked completed while required questions remain unanswered.",
    );
  }

  return {
    isComplete,
    canComplete,
    unansweredQuestions,
    unansweredRequiredQuestions,
    progressPercent,
    issues,
  };
}