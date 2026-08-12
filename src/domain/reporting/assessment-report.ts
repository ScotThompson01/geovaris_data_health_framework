import {
  buildExecutiveAssessmentSummary,
  type ExecutiveAssessmentSummary,
} from "@/domain/assessment-executive-summary";

import {
  buildFindingStatement,
  getAssessmentFinding,
  type AssessmentFindingResult,
} from "@/domain/assessment-findings";

import {
  getAssessmentPriority,
  type AssessmentPriorityResult,
} from "@/domain/assessment-priority";

import {
  getAssessmentRecommendation,
  type AssessmentRecommendationResult,
} from "@/domain/assessment-recommendations";

import {
  getDataHealthMaturity,
  type DataHealthMaturityResult,
} from "@/domain/data-health-maturity";

// ==================================================
// Report Input Types
// ==================================================

export type AssessmentReportMetadataInput = {
  assessmentCode: string;
  assessmentName: string;
  assessmentStatus: string;

  clientName: string;
  frameworkName: string;
  methodologyName: string;
  templateName: string;
  versionLabel: string;

  submittedAt?: Date | string | null;
  completedAt?: Date | string | null;
};

export type AssessmentReportQuestionInput = {
  questionId: string;
  questionCode: string;
  questionText: string;

  sectionId: string;
  sectionName: string;
  sectionOrder: number;

  responseId?: string | null;

  selectedOptionCode?: string | null;
  selectedOptionLabel?: string | null;

  isNotApplicable?: boolean | null;

  respondentComment?: string | null;

  normalizedScore?: string | number | null;
};

export type AssessmentReportSectionScoreInput = {
  sectionId: string | null;

  normalizedScore?:
    | string
    | number
    | null;
};

export type AssessmentReportOverallScoreInput = {
  normalizedScore?:
    | string
    | number
    | null;
};

// ==================================================
// Report Output Types
// ==================================================

export type AssessmentReportFinding = {
  questionId: string;
  questionCode: string;
  questionText: string;

  sectionId: string;
  sectionName: string;

  selectedOptionCode:
    | string
    | null;

  selectedOptionLabel:
    | string
    | null;

  normalizedScore:
    | number
    | null;

  finding:
    AssessmentFindingResult | null;

  findingStatement:
    string | null;

  recommendation:
    AssessmentRecommendationResult | null;

  priority:
    AssessmentPriorityResult | null;

  respondentComment:
    string | null;
};

export type AssessmentReportSection = {
  sectionId: string;
  sectionName: string;
  sectionOrder: number;

  score:
    number | null;

  maturity:
    DataHealthMaturityResult | null;

  totalQuestions: number;
  answeredQuestions: number;
  notApplicableQuestions: number;

  findings:
    AssessmentReportFinding[];
};

export type AssessmentReportAction = {
  questionId: string;
  questionCode: string;
  questionText: string;

  sectionName: string;

  findingLabel: string;

  recommendationTitle: string;
  recommendation: string;

  priority: string;
  priorityRank: number;

  actionHorizon: string;
};

export type AssessmentReportProgress = {
  totalQuestions: number;
  answeredQuestions: number;
  completionPercent: number;
};

export type AssessmentReportModel = {
  metadata:
    AssessmentReportMetadataInput;

  overallScore:
    number | null;

  overallMaturity:
    DataHealthMaturityResult | null;

  progress:
    AssessmentReportProgress;

  executiveSummary:
    ExecutiveAssessmentSummary;

  sections:
    AssessmentReportSection[];

  strengths:
    AssessmentReportFinding[];

  improvementAreas:
    AssessmentReportFinding[];

  criticalGaps:
    AssessmentReportFinding[];

  prioritizedActions:
    AssessmentReportAction[];

  findings:
    AssessmentReportFinding[];
};

// ==================================================
// Helper Functions
// ==================================================

function toNumber(
  value:
    | string
    | number
    | null
    | undefined,
): number | null {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const numericValue =
    Number(value);

  if (
    Number.isNaN(
      numericValue,
    )
  ) {
    return null;
  }

  return numericValue;
}

// ==================================================
// Build Assessment Report
// ==================================================

export function buildAssessmentReport(
  input: {
    metadata:
      AssessmentReportMetadataInput;

    questions:
      AssessmentReportQuestionInput[];

    sectionScores:
      AssessmentReportSectionScoreInput[];

    overallScore:
      AssessmentReportOverallScoreInput | null;
  },
): AssessmentReportModel {
  const {
    metadata,
    questions,
    sectionScores,
    overallScore,
  } = input;

  // --------------------------------------------------
  // Overall Score + Maturity
  // --------------------------------------------------

  const normalizedOverallScore =
    toNumber(
      overallScore?.normalizedScore,
    );

  const overallMaturity =
    getDataHealthMaturity(
      normalizedOverallScore,
    );

  // --------------------------------------------------
  // Progress
  // --------------------------------------------------

  const totalQuestions =
    questions.length;

  const answeredQuestions =
    questions.filter(
      (question) =>
        question.responseId !== null &&
        question.responseId !== undefined,
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

  const progress: AssessmentReportProgress = {
    totalQuestions,
    answeredQuestions,
    completionPercent,
  };

  // --------------------------------------------------
  // Question-Level Findings
  // --------------------------------------------------

  const findings: AssessmentReportFinding[] =
    questions.map(
      (question) => {
        const score =
          toNumber(
            question.normalizedScore,
          );

        const finding =
          getAssessmentFinding(
            score,
            question.isNotApplicable ??
              false,
          );

        const findingStatement =
          buildFindingStatement(
            question.questionCode,
            question.questionText,
            score,
            question.selectedOptionCode,
            question.isNotApplicable ??
              false,
          );

        const recommendation =
          getAssessmentRecommendation(
            finding,
            question.questionCode,
            question.questionText,
          );

        const priority =
          recommendation
            ? getAssessmentPriority(
                recommendation.priority,
              )
            : null;

        return {
          questionId:
            question.questionId,

          questionCode:
            question.questionCode,

          questionText:
            question.questionText,

          sectionId:
            question.sectionId,

          sectionName:
            question.sectionName,

          selectedOptionCode:
            question.selectedOptionCode ??
            null,

          selectedOptionLabel:
            question.selectedOptionLabel ??
            null,

          normalizedScore:
            score,

          finding,

          findingStatement,

          recommendation,

          priority,

          respondentComment:
            question.respondentComment ??
            null,
        };
      },
    );

  // --------------------------------------------------
  // Strengths / Improvement Areas / Critical Gaps
  // --------------------------------------------------

  const strengths =
    findings.filter(
      (finding) =>
        finding.finding?.type ===
        "Strength",
    );

  const improvementAreas =
    findings.filter(
      (finding) =>
        finding.finding !== null &&
        finding.finding.type !==
          "Strength" &&
        finding.finding.type !==
          "Excluded",
    );

  const criticalGaps =
    findings.filter(
      (finding) =>
        finding.finding?.type ===
        "Critical Gap",
    );

  // --------------------------------------------------
  // Executive Summary
  // --------------------------------------------------

  const executiveSummary =
    buildExecutiveAssessmentSummary({
      overallScore:
        normalizedOverallScore,

      maturityLevel:
        overallMaturity
          ? `Level ${overallMaturity.levelNumber} — ${overallMaturity.level}`
          : "Maturity not available",

      strengths:
        strengths.map(
          (finding) =>
            finding.questionText,
        ),

      improvementAreas:
        improvementAreas.map(
          (finding) =>
            finding.questionText,
        ),

      criticalGaps:
        criticalGaps.map(
          (finding) =>
            finding.questionText,
        ),
    });

  // --------------------------------------------------
  // Sections
  // --------------------------------------------------

  const sectionMap =
    new Map<
      string,
      AssessmentReportSection
    >();

  for (
    const question of questions
  ) {
    if (
      !sectionMap.has(
        question.sectionId,
      )
    ) {
      const matchingScore =
        sectionScores.find(
          (score) =>
            score.sectionId ===
            question.sectionId,
        );

      const sectionScore =
        toNumber(
          matchingScore?.normalizedScore,
        );

      sectionMap.set(
        question.sectionId,
        {
          sectionId:
            question.sectionId,

          sectionName:
            question.sectionName,

          sectionOrder:
            question.sectionOrder,

          score:
            sectionScore,

          maturity:
            getDataHealthMaturity(
              sectionScore,
            ),

          totalQuestions: 0,
          answeredQuestions: 0,
          notApplicableQuestions: 0,

          findings: [],
        },
      );
    }

    const section =
      sectionMap.get(
        question.sectionId,
      );

    if (!section) {
      continue;
    }

    section.totalQuestions += 1;

    if (
      question.responseId !== null &&
      question.responseId !== undefined
    ) {
      section.answeredQuestions += 1;
    }

    if (
      question.isNotApplicable
    ) {
      section.notApplicableQuestions +=
        1;
    }

    const finding =
      findings.find(
        (item) =>
          item.questionId ===
          question.questionId,
      );

    if (finding) {
      section.findings.push(
        finding,
      );
    }
  }

  const sections =
    Array.from(
      sectionMap.values(),
    ).sort(
      (a, b) =>
        a.sectionOrder -
        b.sectionOrder,
    );

  // --------------------------------------------------
  // Prioritized Action Plan
  // --------------------------------------------------

  const prioritizedActions =
    findings
      .filter(
        (finding) =>
          finding.finding !== null &&
          finding.finding.type !==
            "Strength" &&
          finding.finding.type !==
            "Excluded" &&
          finding.recommendation !==
            null &&
          finding.priority !== null,
      )
      .map(
        (
          finding,
        ): AssessmentReportAction => ({
          questionId:
            finding.questionId,

          questionCode:
            finding.questionCode,

          questionText:
            finding.questionText,

          sectionName:
            finding.sectionName,

          findingLabel:
            finding.finding?.label ??
            "",

          recommendationTitle:
            finding.recommendation
              ?.title ?? "",

          recommendation:
            finding.recommendation
              ?.recommendation ?? "",

          priority:
            finding.recommendation
              ?.priority ?? "none",

          priorityRank:
            finding.priority?.rank ??
            999,

          actionHorizon:
            finding.priority
              ?.actionHorizon ??
            "Maintain",
        }),
      )
      .sort(
        (a, b) =>
          a.priorityRank -
          b.priorityRank,
      );

  // --------------------------------------------------
  // Final Report Model
  // --------------------------------------------------

  return {
    metadata,

    overallScore:
      normalizedOverallScore,

    overallMaturity,

    progress,

    executiveSummary,

    sections,

    strengths,

    improvementAreas,

    criticalGaps,

    prioritizedActions,

    findings,
  };
}
