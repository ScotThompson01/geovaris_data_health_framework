import Link from "next/link";

import { AppShell } from "@/components/brand/AppShell";

import {
  ArchiveAssessmentButton,
} from "@/components/assessments/ArchiveAssessmentButton";

import {
  DeleteAssessmentButton,
} from "@/components/assessments/DeleteAssessmentButton";

import {
  getAssessmentSummaries,
} from "@/db/repositories/assessment-repository";

import {
  archiveCompletedAssessmentAction,
  deleteDraftAssessmentAction,
} from "./actions";

type AssessmentsPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

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

function formatScore(
  score: string | null,
) {
  if (score === null) {
    return "—";
  }

  const numericScore =
    Number(score);

  if (
    Number.isNaN(
      numericScore,
    )
  ) {
    return "—";
  }

  return `${Math.round(
    numericScore,
  )}%`;
}

export default async function AssessmentsPage({
  searchParams,
}: AssessmentsPageProps) {
  const { status } =
    await searchParams;

  const assessments =
    await getAssessmentSummaries();

  const validStatuses = [
    "draft",
    "completed",
    "archived",
  ];

  const selectedStatus =
    status &&
    validStatuses.includes(
      status,
    )
      ? status
      : "all";

  const filteredAssessments =
    selectedStatus === "all"
      ? assessments
      : assessments.filter(
          (assessment) =>
            assessment.assessmentStatus ===
            selectedStatus,
        );

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        {/* Navigation */}

        <div className="mb-6">
          <Link
            href="/"
            className="text-sm font-medium text-brand-purple hover:text-brand-purple-dark"
          >
            ← Back to Home
          </Link>
        </div>

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
            View assessment progress, scores,
            and current status.
          </p>

          {/* Status Filter */}

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/assessments"
              className={
                selectedStatus === "all"
                  ? "rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                  : "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              }
            >
              All
            </Link>

            <Link
              href="/assessments?status=draft"
              className={
                selectedStatus === "draft"
                  ? "rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                  : "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              }
            >
              Draft
            </Link>

            <Link
              href="/assessments?status=completed"
              className={
                selectedStatus ===
                "completed"
                  ? "rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                  : "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              }
            >
              Completed
            </Link>

            <Link
              href="/assessments?status=archived"
              className={
                selectedStatus ===
                "archived"
                  ? "rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                  : "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              }
            >
              Archived
            </Link>
          </div>
        </div>

        {/* Empty State */}

        {filteredAssessments.length ===
        0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              No assessments found
            </h2>

            <p className="mt-2 text-slate-600">
              {selectedStatus === "all"
                ? "There are currently no assessments available."
                : `There are currently no ${formatStatus(
                    selectedStatus,
                  ).toLowerCase()} assessments.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredAssessments.map(
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

                    <span
                      className={
                        assessment.assessmentStatus ===
                        "completed"
                          ? "rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700"
                          : assessment.assessmentStatus ===
                              "archived"
                            ? "rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700"
                            : "rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700"
                      }
                    >
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

                  {/* Actions */}

                  <div className="mt-8 flex flex-wrap justify-end gap-3">
                    {assessment.assessmentStatus ===
                      "draft" && (
                      <form
                        action={
                          deleteDraftAssessmentAction
                        }
                      >
                        <input
                          type="hidden"
                          name="assessmentId"
                          value={
                            assessment.assessmentId
                          }
                        />

                        <DeleteAssessmentButton
                          assessmentName={
                            assessment.assessmentName
                          }
                        />
                      </form>
                    )}

                    {assessment.assessmentStatus ===
                      "completed" && (
                      <form
                        action={
                          archiveCompletedAssessmentAction
                        }
                      >
                        <input
                          type="hidden"
                          name="assessmentId"
                          value={
                            assessment.assessmentId
                          }
                        />

                        <ArchiveAssessmentButton
                          assessmentName={
                            assessment.assessmentName
                          }
                        />
                      </form>
                    )}

                    {assessment.assessmentStatus ===
                    "draft" ? (
                      <Link
                        href={`/assessments/${assessment.assessmentCode}`}
                        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                      >
                        Open Assessment
                      </Link>
                    ) : (
                      <>
                        <Link
                          href={`/assessments/${assessment.assessmentCode}/results`}
                          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                          View Results
                        </Link>

                        <Link
                          href={`/assessments/${assessment.assessmentCode}/scorecard`}
                          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Scorecard
                        </Link>

                        <Link
                          href={`/assessments/${assessment.assessmentCode}/report`}
                          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Report
                        </Link>
                      </>
                    )}
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