import Link from "next/link";

import { AppShell } from "@/components/brand/AppShell";
import { getAssessmentSummaries } from "@/db/repositories/assessment-repository";

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

function formatScore(
  score: string | null,
) {
  if (score === null) {
    return "—";
  }

  const numericScore = Number(score);

  if (Number.isNaN(numericScore)) {
    return "—";
  }

  return `${Math.round(numericScore)}%`;
}

export default async function AssessmentsPage() {
  const assessments =
    await getAssessmentSummaries();

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        {/* Header */}

        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
            GeoVaris Assessment Platform
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Assessments
          </h1>

          <div className="mb-6 flex justify-end">
            <Link
              href="/assessments/new"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              + New Assessment
            </Link>
          </div>

          <p className="mt-2 text-slate-600">
            View assessment progress, scores, and
            current status.
          </p>
        </div>

        {/* Empty State */}

        {assessments.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              No assessments found
            </h2>

            <p className="mt-2 text-slate-600">
              There are currently no assessments
              available.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {assessments.map(
              (assessment) => (
                <article
                  key={
                    assessment.assessmentId
                  }
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  {/* Assessment Header */}

                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-indigo-600">
                        {
                          assessment.assessmentCode
                        }
                      </p>

                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                        {
                          assessment.assessmentName
                        }
                      </h2>
                    </div>

                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                      {formatStatus(
                        assessment.assessmentStatus,
                      )}
                    </span>
                  </div>

                  {/* Summary Fields */}

                  <div className="mt-6 grid gap-6 border-t border-slate-100 pt-6 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-slate-500">
                        Client
                      </p>

                      <p className="mt-1 font-medium text-slate-900">
                        {
                          assessment.clientName
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">
                        Framework
                      </p>

                      <p className="mt-1 font-medium text-slate-900">
                        {
                          assessment.frameworkName
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">
                        Current Score
                      </p>

                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        {formatScore(
                          assessment.normalizedScore,
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}

                  <div className="mt-8">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-500">
                          Assessment Progress
                        </p>

                        <p className="mt-1 font-medium text-slate-900">
                          {
                            assessment.answeredQuestions
                          }{" "}
                          of{" "}
                          {
                            assessment.totalQuestions
                          }{" "}
                          answered
                        </p>
                      </div>

                      <p className="text-xl font-bold text-slate-900">
                        {
                          assessment.completionPercent
                        }
                        %
                      </p>
                    </div>

                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-indigo-600"
                        style={{
                          width: `${assessment.completionPercent}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Action */}

                  <div className="mt-8 flex justify-end">
                    <Link
                      href={`/assessments/${assessment.assessmentCode}`}
                      className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Open Assessment
                    </Link>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}