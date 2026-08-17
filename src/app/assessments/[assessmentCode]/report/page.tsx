import Link from "next/link";
import { notFound } from "next/navigation";

import { BrandFooter } from "@/components/brand/BrandFooter";
import { BrandHeader } from "@/components/brand/BrandHeader";
import { PrintReportButton } from "@/components/report/PrintReportButton";

import {
  getAssessmentReportByCode,
} from "@/db/repositories/assessment-report-repository";

type AssessmentReportPageProps = {
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

  return `${score.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}%`;
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
      month: "long",
      day: "numeric",
    },
  ).format(date);
}

export default async function AssessmentReportPage({
  params,
}: AssessmentReportPageProps) {
  const { assessmentCode } =
    await params;

  const report =
    await getAssessmentReportByCode(
      assessmentCode,
    );

  if (!report) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-6xl">
        {/* Screen Navigation */}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <Link
            href={`/assessments/${report.metadata.assessmentCode}/results`}
            className="text-sm font-medium text-brand-purple hover:text-brand-purple-dark"
          >
            ← Back to Results
          </Link>

          <PrintReportButton />
        </div>

        {/* Client Report */}

        <article className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-lg print:rounded-none print:border-0 print:shadow-none">
          {/* Branded Header */}

          <header className="border-b border-brand-border px-8 py-7">
            <BrandHeader variant="report" />

            <div className="mt-6 border-t border-brand-border pt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-purple">
                GeoVaris Data Health Assessment
              </p>

              <div className="mt-3 flex flex-wrap items-start justify-between gap-8">
                <div>
                  <h1 className="text-3xl font-bold text-brand-text">
                    {report.metadata.assessmentName}
                  </h1>

                  <p className="mt-2 text-sm text-brand-muted">
                    {report.metadata.assessmentCode}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-brand-muted">
                    Prepared for
                  </p>

                  <p className="mt-1 text-lg font-semibold text-brand-text">
                    {report.metadata.clientName}
                  </p>

                  <p className="mt-3 text-sm text-brand-muted">
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

          <section className="border-b border-brand-border px-8 py-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-brand-muted">
                  Overall Data Health
                </p>

                <p className="mt-3 text-6xl font-bold text-brand-text">
                  {formatScore(
                    report.overallScore,
                  )}
                </p>

                {report.overallMaturity && (
                  <p className="mt-4 text-xl font-semibold text-brand-purple-dark">
                    Level{" "}
                    {
                      report.overallMaturity
                        .levelNumber
                    }{" "}
                    —{" "}
                    {
                      report.overallMaturity
                        .level
                    }
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-brand-muted">
                  Executive Interpretation
                </p>

                <p className="mt-2 text-xl font-semibold leading-8 text-brand-text">
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

                <div className="mt-5 rounded-xl border border-brand-border bg-brand-blue-light p-5">
                  <p className="text-sm font-semibold text-brand-purple-dark">
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
            </div>
          </section>

          {/* Executive Snapshot */}

          <section className="border-b border-brand-border px-8 py-8">
            <h2 className="text-2xl font-bold text-brand-text">
              Executive Snapshot
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-brand-border p-5">
                <p className="text-sm text-brand-muted">
                  Strengths
                </p>

                <p className="mt-2 text-3xl font-bold text-brand-text">
                  {report.strengths.length}
                </p>
              </div>

              <div className="rounded-xl border border-brand-border p-5">
                <p className="text-sm text-brand-muted">
                  Improvement Areas
                </p>

                <p className="mt-2 text-3xl font-bold text-brand-text">
                  {
                    report.improvementAreas
                      .length
                  }
                </p>
              </div>

              <div className="rounded-xl border border-brand-border p-5">
                <p className="text-sm text-brand-muted">
                  Critical Gaps
                </p>

                <p className="mt-2 text-3xl font-bold text-brand-text">
                  {
                    report.criticalGaps
                      .length
                  }
                </p>
              </div>

              <div className="rounded-xl border border-brand-border p-5">
                <p className="text-sm text-brand-muted">
                  Priority Actions
                </p>

                <p className="mt-2 text-3xl font-bold text-brand-text">
                  {
                    report.prioritizedActions
                      .length
                  }
                </p>
              </div>
            </div>
          </section>

          {/* Section Performance */}

          <section className="border-b border-brand-border px-8 py-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-purple">
              Assessment Profile
            </p>

            <h2 className="mt-1 text-2xl font-bold text-brand-text">
              Section Performance
            </h2>

            <div className="mt-6 space-y-4">
              {report.sections.map(
                (section) => (
                  <div
                    key={section.sectionId}
                    className="grid gap-4 rounded-xl border border-brand-border p-5 md:grid-cols-[1.5fr_120px_180px]"
                  >
                    <div>
                      <h3 className="font-semibold text-brand-text">
                        {
                          section.sectionName
                        }
                      </h3>

                      <p className="mt-1 text-sm text-brand-muted">
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
                      <p className="text-sm text-brand-muted">
                        Score
                      </p>

                      <p className="mt-1 text-xl font-bold text-brand-text">
                        {formatScore(
                          section.score,
                        )}
                      </p>
                    </div>

                    <div className="md:text-right">
                      <p className="text-sm text-brand-muted">
                        Maturity
                      </p>

                      <p className="mt-1 font-semibold text-brand-purple-dark">
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

          {/* Prioritized Action Plan */}

          <section className="border-b border-brand-border px-8 py-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-purple">
              Recommended Actions
            </p>

            <h2 className="mt-1 text-2xl font-bold text-brand-text">
              Prioritized Action Plan
            </h2>

            <div className="mt-6 space-y-4 print:space-y-3">
              {report.prioritizedActions.map(
                (
                  action,
                  index,
                ) => (
                  <article
                    key={action.questionId}
                    className="report-action rounded-xl border border-brand-border p-6 print:p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-6">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-brand-purple">
                          #{index + 1}{" "}
                          {
                            action.questionCode
                          }{" "}
                          ·{" "}
                          {
                            action.sectionName
                          }
                        </p>

                        <h3 className="mt-2 text-lg font-semibold text-brand-text">
                          {
                            action.recommendationTitle
                          }
                        </h3>

                        <p className="mt-2 text-sm text-brand-muted">
                          {
                            action.questionText
                          }
                        </p>

                        <p className="mt-3 text-sm leading-6 text-slate-700">
                          {
                            action.recommendation
                          }
                        </p>
                      </div>

                      <div className="min-w-40 text-right">
                        <p className="text-sm text-brand-muted">
                          Priority
                        </p>

                        <p className="mt-1 font-semibold capitalize text-brand-text">
                          {action.priority}
                        </p>

                        <p className="mt-3 text-sm text-brand-muted">
                          Action Horizon
                        </p>

                        <p className="mt-1 font-semibold text-brand-text">
                          {
                            action.actionHorizon
                          }
                        </p>
                      </div>
                    </div>
                  </article>
                ),
              )}
            </div>
          </section>

          {/* Detailed Findings */}

          <section className="border-b border-brand-border px-8 py-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-purple">
              Assessment Findings
            </p>

            <h2 className="mt-1 text-2xl font-bold text-brand-text">
              Detailed Findings & Recommendations
            </h2>

            <div className="mt-6 space-y-5 print:space-y-3">
              {report.findings.map(
                (finding) => (
                  <article
                    key={finding.questionId}
                    className="report-finding rounded-xl border border-brand-border p-6 print:p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-6">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-brand-purple">
                          {
                            finding.questionCode
                          }{" "}
                          ·{" "}
                          {
                            finding.sectionName
                          }
                        </p>

                        <h3 className="mt-2 text-lg font-semibold text-brand-text">
                          {
                            finding.questionText
                          }
                        </h3>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-brand-muted">
                          Score
                        </p>

                        <p className="mt-1 text-xl font-bold text-brand-text">
                          {formatScore(
                            finding.normalizedScore,
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-brand-muted">
                          Response
                        </p>

                        <p className="mt-1 font-medium text-brand-text">
                          {
                            finding.selectedOptionLabel ??
                            "—"
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-brand-muted">
                          Finding
                        </p>

                        <p className="mt-1 font-medium text-brand-text">
                          {
                            finding.finding
                              ?.label ?? "—"
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-brand-muted">
                          Priority
                        </p>

                        <p className="mt-1 font-medium capitalize text-brand-text">
                          {
                            finding.recommendation
                              ?.priority ?? "—"
                          }
                        </p>
                      </div>
                    </div>

                    {finding.findingStatement && (
                      <div className="mt-5">
                        <p className="text-sm font-semibold text-brand-text">
                          Finding Statement
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {
                            finding.findingStatement
                          }
                        </p>
                      </div>
                    )}

                    {finding.recommendation && (
                      <div className="mt-5 rounded-lg border border-brand-border bg-brand-blue-light p-5">
                        <p className="text-sm font-semibold text-brand-purple-dark">
                          {
                            finding.recommendation
                              .title
                          }
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {
                            finding.recommendation
                              .recommendation
                          }
                        </p>
                      </div>
                    )}
                  </article>
                ),
              )}
            </div>
          </section>

          {/* Final Report Section */}

          <div className="report-final-section">
            {/* Report Metadata */}

            <section className="px-8 py-8">
              <h2 className="text-xl font-semibold text-brand-text">
                Assessment Information
              </h2>

              <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-brand-muted">
                    Framework
                  </p>

                  <p className="mt-1 font-medium text-brand-text">
                    {report.metadata.frameworkName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-brand-muted">
                    Methodology
                  </p>

                  <p className="mt-1 font-medium text-brand-text">
                    {report.metadata.methodologyName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-brand-muted">
                    Submitted
                  </p>

                  <p className="mt-1 font-medium text-brand-text">
                    {formatDate(
                      report.metadata.submittedAt,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-brand-muted">
                    Completed
                  </p>

                  <p className="mt-1 font-medium text-brand-text">
                    {formatDate(
                      report.metadata.completedAt,
                    )}
                  </p>
                </div>
              </div>
            </section>
            <BrandFooter variant="report" />
          </div>
        </article>
      </div>
    </main>
  );
}