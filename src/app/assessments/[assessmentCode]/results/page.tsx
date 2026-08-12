import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/brand/AppShell";
import {
  buildFindingStatement,
  getAssessmentFinding,
} from "@/domain/assessment-findings";

import {
  getAssessmentPriority,
} from "@/domain/assessment-priority";

import { getAssessmentRecommendation } from "@/domain/assessment-recommendations";
import { getDataHealthMaturity } from "@/domain/data-health-maturity";
import { getAssessmentResultsByCode } from "@/db/repositories/assessment-repository";

import {
  buildExecutiveAssessmentSummary,
} from "@/domain/assessment-executive-summary";

type AssessmentResultsPageProps = {
  params: Promise<{
    assessmentCode: string;
  }>;
};

function formatScore(
  score: string | number | null | undefined,
) {
  if (score === null || score === undefined) {
    return "—";
  }

  const numericScore = Number(score);

  if (Number.isNaN(numericScore)) {
    return "—";
  }

  return `${numericScore.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}%`;
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function formatDate(
  value: Date | string | null | undefined,
) {
  if (!value) {
    return "—";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  ).format(date);
}

export default async function AssessmentResultsPage({
  params,
}: AssessmentResultsPageProps) {
  const { assessmentCode } = await params;

  const data =
    await getAssessmentResultsByCode(
      assessmentCode,
    );

  if (!data) {
    notFound();
  }

  const {
    assessment,
    responses,
    sectionScores,
    overallScore,
    progress,
  } = data;

  // --------------------------------------------------
  // Overall Maturity
  // --------------------------------------------------

  const overallMaturity =
    getDataHealthMaturity(
      overallScore?.normalizedScore,
    );

  // --------------------------------------------------
  // Prioritized Action Plan
  // --------------------------------------------------

  const actionPlan = responses
    .map((response) => {
      const finding =
        getAssessmentFinding(
          response.normalizedScore,
          response.isNotApplicable ?? false,
        );

      const recommendation =
        getAssessmentRecommendation(
          finding,
          response.questionCode,
          response.questionText,
        );

      if (
        !finding ||
        !recommendation ||
        finding.label === "Strength"
      ) {
        return null;
      }

      const priority =
        getAssessmentPriority(
          recommendation.priority,
        );

      return {
        questionId: response.questionId,
        questionCode: response.questionCode,
        questionText: response.questionText,
        sectionName: response.sectionName,
        finding: finding.label,
        recommendationTitle:
          recommendation.title,
        recommendation:
          recommendation.recommendation,
        priority:
          recommendation.priority,
        priorityRank:
          priority.rank,
        actionHorizon:
          priority.actionHorizon,
      };
    })
    .filter(
      (
        item,
      ): item is NonNullable<
        typeof item
      > => item !== null,
    )
    .sort(
      (a, b) =>
        a.priorityRank - b.priorityRank,
    );
  // --------------------------------------------------
  // Executive Summary
  // --------------------------------------------------

  const strengths = responses
    .map((response) => {
      const finding =
        getAssessmentFinding(
          response.normalizedScore,
          response.isNotApplicable ?? false,
        );

      if (
        !finding ||
        finding.label !== "Strength"
      ) {
        return null;
      }

      return response.questionText;
    })
    .filter(
      (item): item is string =>
        item !== null,
    );

  const improvementAreas = responses
    .map((response) => {
      const finding =
        getAssessmentFinding(
          response.normalizedScore,
          response.isNotApplicable ?? false,
        );

      if (
        !finding ||
        finding.label === "Strength" ||
        finding.label === "Excluded"
      ) {
        return null;
      }

      return response.questionText;
    })
    .filter(
      (item): item is string =>
        item !== null,
    );

  const criticalGaps = responses
    .map((response) => {
      const finding =
        getAssessmentFinding(
          response.normalizedScore,
          response.isNotApplicable ?? false,
        );

      if (
        !finding ||
        finding.label !== "Critical Gap"
      ) {
        return null;
      }

      return response.questionText;
    })
    .filter(
      (item): item is string =>
        item !== null,
    );

  const executiveSummary =
    buildExecutiveAssessmentSummary({
      overallScore:
        overallScore?.normalizedScore ===
          null ||
          overallScore?.normalizedScore ===
          undefined
          ? null
          : Number(
            overallScore.normalizedScore,
          ),

      maturityLevel:
        overallMaturity
          ? `Level ${overallMaturity.levelNumber} — ${overallMaturity.level}`
          : "Maturity not available",

      strengths,
      improvementAreas,
      criticalGaps,
    });
  // --------------------------------------------------
  // Build Section Summary
  // --------------------------------------------------

  const sections = responses.reduce<
    Record<
      string,
      {
        sectionId: string;
        sectionName: string;
        sectionOrder: number;
        totalQuestions: number;
        answeredQuestions: number;
        notApplicableQuestions: number;
      }
    >
  >((acc, response) => {
    const sectionId = response.sectionId;

    if (!acc[sectionId]) {
      acc[sectionId] = {
        sectionId,
        sectionName:
          response.sectionName,
        sectionOrder:
          response.sectionOrder,
        totalQuestions: 0,
        answeredQuestions: 0,
        notApplicableQuestions: 0,
      };
    }

    acc[sectionId].totalQuestions += 1;

    if (response.responseId !== null) {
      acc[sectionId].answeredQuestions += 1;
    }

    if (response.isNotApplicable) {
      acc[
        sectionId
      ].notApplicableQuestions += 1;
    }

    return acc;
  }, {});

  const sectionResults = Object.values(
    sections,
  ).sort(
    (a, b) =>
      a.sectionOrder - b.sectionOrder,
  );

  const isCompleted =
    assessment.assessmentStatus ===
    "completed";

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        {/* Navigation */}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/assessments"
            className="text-sm font-medium text-brand-purple hover:text-brand-purple-dark"
          >
            ← Back to Assessments
          </Link>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/assessments/${assessment.assessmentCode}`}
              className="text-sm font-medium text-brand-purple hover:text-brand-purple-dark"
            >
              View Assessment
            </Link>

            <Link
              href={`/assessments/${assessment.assessmentCode}/scorecard`}
              className="rounded-lg bg-brand-purple px-4 py-2 text-sm font-medium text-white hover:bg-brand-purple-dark"
            >
              Executive Scorecard
            </Link>
          </div>
        </div>

        {/* Header */}

        <header className="mb-8">
          <p className="text-sm font-medium text-brand-purple">
            GeoVaris Assessment Platform
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Assessment Results
          </h1>

          <p className="mt-2 text-xl font-semibold text-slate-700">
            {assessment.assessmentName}
          </p>

          <p className="mt-1 text-slate-500">
            {assessment.assessmentCode}
          </p>
        </header>

        {/* Assessment Information */}

        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">
                Client
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {assessment.clientName}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Framework
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {assessment.frameworkName}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Status
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {formatStatus(
                  assessment.assessmentStatus,
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Methodology
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {assessment.methodologyName}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Template
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {assessment.templateName}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Version
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {assessment.versionLabel}
              </p>
            </div>
          </div>
        </section>

        {/* Overall Result */}

        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Overall Data Health Score
              </p>

              <p className="mt-2 text-5xl font-bold text-slate-900">
                {formatScore(
                  overallScore?.normalizedScore,
                )}
              </p>

              {overallMaturity && (
                <div className="mt-4">
                  <p className="text-lg font-semibold text-brand-purple-dark">
                    Level{" "}
                    {
                      overallMaturity.levelNumber
                    }{" "}
                    —{" "}
                    {
                      overallMaturity.level
                    }
                  </p>

                  <p className="mt-2 max-w-2xl text-sm text-slate-600">
                    {
                      overallMaturity.description
                    }
                  </p>
                </div>
              )}
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-500">
                Assessment Progress
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {
                  progress.answeredQuestions
                }{" "}
                of {progress.totalQuestions}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {
                  progress.completionPercent
                }
                % complete
              </p>
            </div>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-brand-purple"
              style={{
                width: `${progress.completionPercent}%`,
              }}
            />
          </div>
        </section>

        {/* Executive Summary */}

        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-5">
            <p className="text-sm font-medium text-brand-purple">
              Executive Interpretation
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Executive Summary
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Assessment Position
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-900">
                {executiveSummary.headline}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Interpretation
              </p>

              <p className="mt-2 leading-7 text-slate-700">
                {executiveSummary.summary}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Recommended Focus
              </p>

              <p className="mt-2 leading-7 text-slate-700">
                {executiveSummary.recommendedFocus}
              </p>
            </div>

            <div className="grid gap-6 border-t border-slate-100 pt-5 md:grid-cols-3">
              <div>
                <p className="text-sm text-slate-500">
                  Strengths
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {strengths.length}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Improvement Areas
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {improvementAreas.length}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Critical Gaps
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {criticalGaps.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Results */}

        <section className="mb-8">
          <div className="mb-4">
            <p className="text-sm font-medium text-brand-purple">
              Assessment Breakdown
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Section Results
            </h2>
          </div>

          <div className="space-y-4">
            {sectionResults.map(
              (section) => {
                const score =
                  sectionScores.find(
                    (sectionScore) =>
                      sectionScore.sectionId ===
                      section.sectionId,
                  );

                const sectionMaturity =
                  getDataHealthMaturity(
                    score?.normalizedScore,
                  );

                return (
                  <div
                    key={section.sectionId}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {
                            section.sectionName
                          }
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                          {
                            section.answeredQuestions
                          }{" "}
                          of{" "}
                          {
                            section.totalQuestions
                          }{" "}
                          questions answered
                        </p>

                        {section.notApplicableQuestions >
                          0 && (
                            <p className="mt-1 text-sm text-slate-500">
                              {
                                section.notApplicableQuestions
                              }{" "}
                              marked Not
                              Applicable
                            </p>
                          )}
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-500">
                          Section Score
                        </p>

                        <p className="mt-1 text-3xl font-bold text-slate-900">
                          {formatScore(
                            score?.normalizedScore,
                          )}
                        </p>

                        {sectionMaturity && (
                          <p className="mt-2 text-sm font-medium text-brand-purple-dark">
                            Level{" "}
                            {
                              sectionMaturity.levelNumber
                            }{" "}
                            —{" "}
                            {
                              sectionMaturity.level
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </section>

        {/* Prioritized Action Plan */}

        <section className="mb-8">
          <div className="mb-4">
            <p className="text-sm font-medium text-brand-purple">
              Recommended Actions
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Prioritized Action Plan
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Recommended actions are prioritized based on the
              assessment findings and GeoVaris assessment methodology.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {actionPlan.map((action, index) => (
              <div
                key={action.questionId}
                className="border-b border-slate-100 p-6 last:border-b-0"
              >
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-brand-purple">
                        #{index + 1}
                      </span>

                      <span className="text-sm text-slate-500">
                        {action.questionCode}
                      </span>

                      <span className="text-sm text-slate-500">
                        {action.sectionName}
                      </span>
                    </div>

                    <h3 className="mt-2 text-lg font-semibold text-slate-900">
                      {action.recommendationTitle}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600">
                      {action.questionText}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      {action.recommendation}
                    </p>
                  </div>

                  <div className="flex gap-8">
                    <div className="text-right">
                      <p className="text-sm text-slate-500">
                        Priority
                      </p>

                      <p className="mt-1 font-semibold capitalize text-slate-900">
                        {action.priority}
                      </p>
                    </div>

                    <div className="min-w-24 text-right">
                      <p className="text-sm text-slate-500">
                        Action Horizon
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {action.actionHorizon}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Assessment Findings */}

        <section className="mb-8">
          <div className="mb-4">
            <p className="text-sm font-medium text-brand-purple">
              Assessment Interpretation
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Findings
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Findings and recommendations are generated from the scored
              assessment responses using the GeoVaris assessment methodology.
            </p>
          </div>

          <div className="space-y-4">
            {responses.map((response) => {
              const finding =
                getAssessmentFinding(
                  response.normalizedScore,
                  response.isNotApplicable ?? false,
                );

              const findingStatement =
                buildFindingStatement(
                  response.questionCode,
                  response.questionText,
                  response.normalizedScore,
                  response.selectedOptionCode,
                  response.isNotApplicable ?? false,
                );

              const recommendation =
                getAssessmentRecommendation(
                  finding,
                  response.questionCode,
                  response.questionText,
                );

              const priorityResult =
                recommendation
                  ? getAssessmentPriority(
                    recommendation.priority,
                  )
                  : null;

              if (!finding || !findingStatement) {
                return null;
              }

              return (
                <article
                  key={response.questionId}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  {/* Finding Header */}

                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-brand-purple">
                        {response.questionCode}
                      </p>

                      <h3 className="mt-1 text-lg font-semibold text-slate-900">
                        {response.questionText}
                      </h3>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-slate-500">
                        Finding
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {finding.label}
                      </p>
                    </div>
                  </div>

                  {/* Finding Details */}

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-slate-500">
                        Score
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {formatScore(
                          response.normalizedScore,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">
                        Severity
                      </p>

                      <p className="mt-1 font-semibold capitalize text-slate-900">
                        {finding.severity}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">
                        Response
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {response.selectedOptionLabel ?? "—"}
                      </p>
                    </div>
                  </div>

                  {/* Finding Statement */}

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-sm font-medium text-slate-700">
                      Finding Statement
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {findingStatement}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {finding.description}
                    </p>
                  </div>

                  {/* Recommendation */}

                  {recommendation && priorityResult && (
                    <div className="mt-5 rounded-lg border border-brand-border bg-brand-blue-light p-5">
                      <div className="flex flex-wrap items-start justify-between gap-6">
                        <div>
                          <p className="text-sm font-medium text-brand-purple">
                            Recommendation
                          </p>

                          <h4 className="mt-1 font-semibold text-slate-900">
                            {recommendation.title}
                          </h4>
                        </div>

                        <div className="flex gap-8">
                          <div className="text-right">
                            <p className="text-sm text-slate-500">
                              Priority
                            </p>

                            <p className="mt-1 font-semibold capitalize text-slate-900">
                              {recommendation.priority}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-slate-500">
                              Action Horizon
                            </p>

                            <p className="mt-1 font-semibold text-slate-900">
                              {priorityResult.actionHorizon}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        {recommendation.recommendation}
                      </p>

                      <div className="mt-4 border-t border-brand-border pt-4">
                        <p className="text-sm font-medium text-slate-700">
                          Action Planning Guidance
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {priorityResult.description}
                        </p>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
        {/* Completion Summary */}

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Assessment Summary
          </h2>

          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-slate-500">
                Status
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {formatStatus(
                  assessment.assessmentStatus,
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Questions Answered
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {
                  progress.answeredQuestions
                }{" "}
                / {progress.totalQuestions}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Submitted
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {formatDate(
                  assessment.submittedAt,
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Completed
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {formatDate(
                  assessment.completedAt,
                )}
              </p>
            </div>
          </div>

          {!isCompleted && (
            <div className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
              This assessment has not been completed.
              Results shown here are preliminary.
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}