import Link from "next/link";
import { notFound } from "next/navigation";

import { getAssessmentResultsByCode } from "@/db/repositories/assessment-repository";

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
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Navigation */}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/assessments"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Assessments
          </Link>

          <Link
            href={`/assessments/${assessment.assessmentCode}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View Assessment
          </Link>
        </div>

        {/* Header */}

        <header className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
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
              className="h-full rounded-full bg-indigo-600"
              style={{
                width: `${progress.completionPercent}%`,
              }}
            />
          </div>
        </section>

        {/* Section Results */}

        <section className="mb-8">
          <div className="mb-4">
            <p className="text-sm font-medium text-indigo-600">
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
                      </div>
                    </div>
                  </div>
                );
              },
            )}
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
              This assessment has not
              been completed. Results
              shown here are preliminary.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}