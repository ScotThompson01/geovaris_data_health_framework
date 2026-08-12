import { notFound } from "next/navigation";

import {
  getAssessmentReportByCode,
} from "@/db/repositories/assessment-report-repository";

type ReportPreviewPageProps = {
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

export default async function ReportPreviewPage({
  params,
}: ReportPreviewPageProps) {
  const { assessmentCode } = await params;

  const report =
    await getAssessmentReportByCode(
      assessmentCode,
    );

  if (!report) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
            GeoVaris Client Report Model
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Report Preview
          </h1>

          <p className="mt-2 text-xl font-semibold text-slate-700">
            {report.metadata.assessmentName}
          </p>

          <p className="mt-1 text-slate-500">
            {report.metadata.assessmentCode}
          </p>
        </header>

        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">
            Overall Data Health Score
          </p>

          <p className="mt-2 text-5xl font-bold text-slate-900">
            {formatScore(
              report.overallScore,
            )}
          </p>

          {report.overallMaturity && (
            <div className="mt-4">
              <p className="text-lg font-semibold text-indigo-700">
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

              <p className="mt-2 text-sm text-slate-600">
                {
                  report.overallMaturity
                    .description
                }
              </p>
            </div>
          )}
        </section>

        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-indigo-600">
            Executive Interpretation
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Executive Summary
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Assessment Position
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-900">
                {
                  report.executiveSummary
                    .headline
                }
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Interpretation
              </p>

              <p className="mt-2 text-slate-700">
                {
                  report.executiveSummary
                    .summary
                }
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Recommended Focus
              </p>

              <p className="mt-2 text-slate-700">
                {
                  report.executiveSummary
                    .recommendedFocus
                }
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
            Assessment Breakdown
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Section Results
          </h2>

          <div className="mt-4 grid gap-4">
            {report.sections.map(
              (section) => (
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
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-slate-500">
                        Score
                      </p>

                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        {formatScore(
                          section.score,
                        )}
                      </p>

                      {section.maturity && (
                        <p className="mt-1 text-sm font-medium text-indigo-700">
                          Level{" "}
                          {
                            section.maturity
                              .levelNumber
                          }{" "}
                          —{" "}
                          {
                            section.maturity
                              .level
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
            Recommended Actions
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Prioritized Action Plan
          </h2>

          <div className="mt-4 space-y-4">
            {report.prioritizedActions.map(
              (action, index) => (
                <article
                  key={action.questionId}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-6">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-indigo-600">
                        #{index + 1}{" "}
                        {action.questionCode}
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-slate-900">
                        {
                          action
                            .recommendationTitle
                        }
                      </h3>

                      <p className="mt-2 text-sm text-slate-600">
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

                    <div className="text-right">
                      <p className="text-sm text-slate-500">
                        Priority
                      </p>

                      <p className="mt-1 font-semibold capitalize text-slate-900">
                        {action.priority}
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
                </article>
              ),
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Report Model Validation
          </h2>

          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-slate-500">
                Sections
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {report.sections.length}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Strengths
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {report.strengths.length}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Improvement Areas
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {
                  report.improvementAreas
                    .length
                }
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Prioritized Actions
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {
                  report.prioritizedActions
                    .length
                }
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}