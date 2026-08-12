
import { BrandFooter } from "@/components/brand/BrandFooter";
import { BrandHeader } from "@/components/brand/BrandHeader";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getAssessmentReportByCode,
} from "@/db/repositories/assessment-report-repository";

type ExecutiveScorecardPageProps = {
  params: Promise<{
    assessmentCode: string;
  }>;
};

function formatScore(
  score: number | null,
) {
  if (score === null) {
    return "—";
  }

  return `${score.toLocaleString(
    undefined,
    {
      maximumFractionDigits: 2,
    },
  )}%`;
}

function formatStatus(
  status: string,
) {
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
  value:
    | Date
    | string
    | null
    | undefined,
) {
  if (!value) {
    return "—";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
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

export default async function ExecutiveScorecardPage({
  params,
}: ExecutiveScorecardPageProps) {
  const { assessmentCode } =
    await params;

  const report =
    await getAssessmentReportByCode(
      assessmentCode,
    );

  if (!report) {
    notFound();
  }

  const topActions =
    report.prioritizedActions.slice(
      0,
      5,
    );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Navigation */}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <Link
            href="/assessments"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Assessments
          </Link>

          <div className="flex gap-4">
            <Link
              href={`/assessments/${report.metadata.assessmentCode}/results`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Detailed Results
            </Link>

            <Link
              href={`/assessments/${report.metadata.assessmentCode}/report-preview`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Report Preview
            </Link>
          </div>
        </div>

        {/* Scorecard */}

        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Branded Header */}

          <header className="border-b border-brand-border px-8 py-5">
            <BrandHeader variant="report" />

            <div className="mt-5 border-t border-brand-border pt-6">
              <div className="flex flex-wrap items-end justify-between gap-8">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-purple">
                    Data Health Executive Scorecard
                  </p>

                  <h1 className="mt-2 text-3xl font-bold text-brand-text">
                    {report.metadata.assessmentName}
                  </h1>

                  <p className="mt-2 text-sm text-brand-muted">
                    {report.metadata.assessmentCode}
                  </p>
                </div>

                <div className="min-w-48 text-right">
                  <p className="text-sm text-brand-muted">
                    Client
                  </p>

                  <p className="mt-1 text-lg font-semibold text-brand-text">
                    {report.metadata.clientName}
                  </p>

                  <p className="mt-4 text-sm text-brand-muted">
                    Status
                  </p>

                  <p className="mt-1 font-semibold text-brand-text">
                    {formatStatus(
                      report.metadata.assessmentStatus,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Overall Score */}

          <section className="grid gap-8 border-b border-slate-200 px-8 py-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                Overall Data Health
              </p>

              <p className="mt-3 text-6xl font-bold text-slate-900">
                {formatScore(
                  report.overallScore,
                )}
              </p>

              {report.overallMaturity && (
                <div className="mt-4">
                  <p className="text-xl font-semibold text-indigo-700">
                    Level{" "}
                    {
                      report
                        .overallMaturity
                        .levelNumber
                    }{" "}
                    —{" "}
                    {
                      report
                        .overallMaturity
                        .level
                    }
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Executive Interpretation
              </p>

              <p className="mt-2 text-xl font-semibold leading-8 text-slate-900">
                {
                  report.executiveSummary
                    .headline
                }
              </p>

              <p className="mt-4 leading-7 text-slate-700">
                {
                  report.executiveSummary
                    .summary
                }
              </p>

              <div className="mt-5 rounded-xl bg-indigo-50 p-5">
                <p className="text-sm font-semibold text-indigo-700">
                  Recommended Focus
                </p>

                <p className="mt-2 leading-7 text-slate-700">
                  {
                    report.executiveSummary
                      .recommendedFocus
                  }
                </p>
              </div>
            </div>
          </section>

          {/* Executive Snapshot */}

          <section className="border-b border-slate-200 px-8 py-8">
            <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
              Executive Snapshot
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">
                  Strengths
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {
                    report.strengths
                      .length
                  }
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">
                  Improvement Areas
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {
                    report
                      .improvementAreas
                      .length
                  }
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">
                  Critical Gaps
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {
                    report
                      .criticalGaps
                      .length
                  }
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">
                  Priority Actions
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {
                    report
                      .prioritizedActions
                      .length
                  }
                </p>
              </div>
            </div>
          </section>

          {/* Section Profile */}

          <section className="border-b border-slate-200 px-8 py-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
                  Assessment Profile
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Section Performance
                </h2>
              </div>

              <p className="text-sm text-slate-500">
                {
                  report.progress
                    .answeredQuestions
                }{" "}
                of{" "}
                {
                  report.progress
                    .totalQuestions
                }{" "}
                questions answered
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {report.sections.map(
                (section) => (
                  <div
                    key={
                      section.sectionId
                    }
                    className="grid items-center gap-4 rounded-xl border border-slate-200 p-5 md:grid-cols-[1.5fr_120px_180px]"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {
                          section.sectionName
                        }
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {
                          section.answeredQuestions
                        }{" "}
                        of{" "}
                        {
                          section.totalQuestions
                        }{" "}
                        answered
                      </p>
                    </div>

                    <div className="md:text-right">
                      <p className="text-sm text-slate-500">
                        Score
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {formatScore(
                          section.score,
                        )}
                      </p>
                    </div>

                    <div className="md:text-right">
                      <p className="text-sm text-slate-500">
                        Maturity
                      </p>

                      <p className="mt-1 font-semibold text-indigo-700">
                        {section.maturity
                          ? `Level ${section.maturity.levelNumber} — ${section.maturity.level}`
                          : "—"}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>

          {/* Top Priorities */}

          <section className="border-b border-slate-200 px-8 py-8">
            <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
              Recommended Actions
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Top Priorities
            </h2>

            {topActions.length === 0 ? (
              <div className="mt-6 rounded-xl border border-slate-200 p-6">
                <p className="text-slate-600">
                  No remediation actions
                  were identified.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {topActions.map(
                  (
                    action,
                    index,
                  ) => (
                    <div
                      key={
                        action.questionId
                      }
                      className="rounded-xl border border-slate-200 p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-6">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-indigo-600">
                            #{index + 1}{" "}
                            {
                              action.questionCode
                            }{" "}
                            ·{" "}
                            {
                              action.sectionName
                            }
                          </p>

                          <h3 className="mt-2 text-lg font-semibold text-slate-900">
                            {
                              action
                                .recommendationTitle
                            }
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {
                              action.recommendation
                            }
                          </p>
                        </div>

                        <div className="min-w-40 text-right">
                          <p className="text-sm text-slate-500">
                            Priority
                          </p>

                          <p className="mt-1 font-semibold capitalize text-slate-900">
                            {
                              action.priority
                            }
                          </p>

                          <p className="mt-3 text-sm text-slate-500">
                            Action Horizon
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            {
                              action.actionHorizon
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>

          {/* Assessment Metadata */}

          <section className="px-8 py-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-slate-500">
                  Framework
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {
                    report.metadata
                      .frameworkName
                  }
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Methodology
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {
                    report.metadata
                      .methodologyName
                  }
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Submitted
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {formatDate(
                    report.metadata
                      .submittedAt,
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Completed
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {formatDate(
                    report.metadata
                      .completedAt,
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}

          <BrandFooter variant="report" />
        </article>
      </div>
    </main>
  );
}