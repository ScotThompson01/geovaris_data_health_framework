import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/brand/AppShell";

import {
  getClientById,
} from "@/db/repositories/client-repository";

import {
  getAssessmentResultsByCode,
  getAssessmentsByClientId,
} from "@/db/repositories/assessment-repository";

import {
  DeleteClientButton,
} from "@/components/clients/DeleteClientButton";

import {
  deleteClientAction,
} from "./actions";


type ClientDetailPageProps = {
  params: Promise<{
    clientId: string;
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

function formatDate(
  value: Date | string,
) {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  ).format(date);
}

function formatScore(
  value: string | number | null,
) {
  if (value === null) {
    return "—";
  }

  const numericValue =
    Number(value);

  if (
    Number.isNaN(
      numericValue,
    )
  ) {
    return String(value);
  }

  return `${numericValue.toFixed(1)}%`;
}

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const { clientId } =
    await params;

  const client =
    await getClientById(
      clientId,
    );

  if (!client) {
    notFound();
  }

  const clientAssessments =
    await getAssessmentsByClientId(
      client.clientId,
    );

  const completedAssessments =
    clientAssessments.filter(
      (assessment) =>
        assessment.assessmentStatus ===
        "completed",
    );

  const latestCompletedAssessment =
    completedAssessments.length > 0
      ? completedAssessments[
      completedAssessments.length - 1
      ]
      : null;

  const latestResults =
    latestCompletedAssessment
      ? await getAssessmentResultsByCode(
        latestCompletedAssessment.assessmentCode,
      )
      : null;

  const latestSectionScores =
    latestResults
      ? latestResults.sectionScores.map(
        (sectionScore) => {
          const matchingResponse =
            latestResults.responses.find(
              (response) =>
                response.sectionId ===
                sectionScore.sectionId,
            );

          return {
            sectionId:
              sectionScore.sectionId,

            sectionName:
              matchingResponse?.sectionName ??
              "Assessment Section",

            normalizedScore:
              sectionScore.normalizedScore,
          };
        },
      )
      : [];

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        {/* Navigation */}

        <div className="mb-6">
          <Link
            href="/clients"
            className="text-sm font-medium text-brand-purple hover:text-brand-purple-dark"
          >
            ← Back to Clients
          </Link>
        </div>

        {/* Header */}

        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-purple">
              Client Management
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-brand-text">
                {client.clientName}
              </h1>

              <span
                className={
                  client.status ===
                    "active"
                    ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                    : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                }
              >
                {formatStatus(
                  client.status,
                )}
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-brand-muted">
              {client.description ??
                "Client account and assessment information."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {clientAssessments.length === 0 && (
              <form
                action={deleteClientAction}
              >
                <input
                  type="hidden"
                  name="clientId"
                  value={client.clientId}
                />

                <DeleteClientButton
                  clientName={
                    client.clientName
                  }
                />
              </form>
            )}
            <Link
              href={`/clients/${client.clientId}/edit`}
              className="rounded-lg border border-brand-border px-5 py-2.5 text-sm font-medium text-brand-text hover:bg-slate-50"
            >
              Edit Client
            </Link>

            {client.status === "active" ? (
              <Link
                href={`/assessments/new?clientId=${client.clientId}`}
                className="rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-purple-dark"
              >
                Create Assessment
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-medium text-slate-500"
              >
                Create Assessment
              </button>
            )}
          </div>
        </div>

        {/* Client Details */}

        <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-brand-text">
              Client Details
            </h2>

            <p className="mt-1 text-sm text-brand-muted">
              Organization and account
              information for this client.
            </p>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                Client Name
              </p>

              <p className="mt-2 font-medium text-brand-text">
                {client.clientName}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                Legal Name
              </p>

              <p className="mt-2 font-medium text-brand-text">
                {client.legalName ??
                  "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                Industry
              </p>

              <p className="mt-2 font-medium text-brand-text">
                {client.industry ??
                  "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                Status
              </p>

              <p className="mt-2 font-medium text-brand-text">
                {formatStatus(
                  client.status,
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 border-t border-brand-border pt-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                Created
              </p>

              <p className="mt-2 text-sm text-brand-text">
                {formatDate(
                  client.createdAt,
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                Last Updated
              </p>

              <p className="mt-2 text-sm text-brand-text">
                {formatDate(
                  client.updatedAt,
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Data Health Snapshot */}

        <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-purple">
                Data Health
              </p>

              <h2 className="mt-2 text-xl font-bold text-brand-text">
                Latest Data Health Snapshot
              </h2>

              <p className="mt-2 text-sm text-brand-muted">
                Latest completed assessment
                results for this client.
              </p>
            </div>

            {latestCompletedAssessment &&
              latestResults && (
                <Link
                  href={`/assessments/${latestCompletedAssessment.assessmentCode}/results`}
                  className="text-sm font-medium text-brand-purple hover:text-brand-purple-dark"
                >
                  View Full Results →
                </Link>
              )}
          </div>

          {!latestCompletedAssessment ||
            !latestResults ? (
            <div className="mt-6 rounded-xl border border-dashed border-brand-border p-6">
              <p className="text-sm text-brand-muted">
                No completed assessment is
                available yet. Complete an
                assessment to establish this
                client&apos;s Data Health baseline.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-4 md:grid-cols-[1.5fr_1fr]">
                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                    Latest Assessment
                  </p>

                  <p className="mt-2 font-semibold text-brand-text">
                    {
                      latestCompletedAssessment.assessmentName
                    }
                  </p>

                  <p className="mt-1 text-xs text-brand-muted">
                    {
                      latestCompletedAssessment.assessmentCode
                    }
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                    Overall Data Health
                  </p>

                  <p className="mt-2 text-3xl font-bold text-brand-purple">
                    {formatScore(
                      latestResults.overallScore
                        ?.normalizedScore ?? null,
                    )}
                  </p>
                </div>
              </div>

              {latestSectionScores.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-brand-text">
                    Section Scores
                  </h3>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {latestSectionScores.map(
                      (section) => (
                        <div
                          key={
                            section.sectionId ??
                            section.sectionName
                          }
                          className="rounded-xl border border-brand-border p-4"
                        >
                          <p className="text-sm text-brand-muted">
                            {
                              section.sectionName
                            }
                          </p>

                          <p className="mt-2 text-2xl font-bold text-brand-text">
                            {formatScore(
                              section.normalizedScore,
                            )}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* Assessments */}

        <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-brand-text">
                Assessments
              </h2>

              <p className="mt-2 text-sm text-brand-muted">
                Assessment history and progress
                for this client.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {clientAssessments.length}{" "}
              {clientAssessments.length === 1
                ? "assessment"
                : "assessments"}
            </span>
          </div>

          {clientAssessments.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-brand-border p-6">
              <p className="text-sm text-brand-muted">
                No assessments have been
                created for this client yet.
              </p>

              <Link
                href={`/assessments/new?clientId=${client.clientId}`}
                className="mt-4 inline-block text-sm font-medium text-brand-purple hover:text-brand-purple-dark"
              >
                Create the first assessment →
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {clientAssessments.map(
                (assessment) => {
                  const isCompleted =
                    assessment.assessmentStatus ===
                    "completed";

                  const isArchived =
                    assessment.assessmentStatus ===
                    "archived";

                  const isHistorical =
                    isCompleted ||
                    isArchived;

                  return (
                    <div
                      key={
                        assessment.assessmentId
                      }
                      className="rounded-xl border border-brand-border p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-6">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-semibold text-brand-text">
                              {
                                assessment.assessmentName
                              }
                            </h3>

                            <span
                              className={
                                isCompleted
                                  ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                                  : isArchived
                                    ? "rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"
                                    : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                              }
                            >
                              {formatStatus(
                                assessment.assessmentStatus,
                              )}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-brand-muted">
                            {
                              assessment.assessmentCode
                            }
                          </p>

                          <div className="mt-4 grid gap-4 sm:grid-cols-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                                Framework
                              </p>

                              <p className="mt-1 text-sm text-brand-text">
                                {
                                  assessment.frameworkName
                                }
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                                Progress
                              </p>

                              <p className="mt-1 text-sm text-brand-text">
                                {
                                  assessment.answeredQuestions
                                }
                                /
                                {
                                  assessment.totalQuestions
                                }
                                {" · "}
                                {
                                  assessment.completionPercent
                                }
                                %
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                                Overall Score
                              </p>

                              <p className="mt-1 text-sm font-semibold text-brand-text">
                                {formatScore(
                                  assessment.normalizedScore,
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {isHistorical ? (
                            <>
                              <Link
                                href={`/assessments/${assessment.assessmentCode}/results`}
                                className="rounded-lg bg-brand-purple px-4 py-2 text-sm font-medium text-white hover:bg-brand-purple-dark"
                              >
                                View Results
                              </Link>

                              <Link
                                href={`/assessments/${assessment.assessmentCode}/scorecard`}
                                className="rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-brand-text hover:bg-slate-50"
                              >
                                Scorecard
                              </Link>

                              <Link
                                href={`/assessments/${assessment.assessmentCode}/report`}
                                className="rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-brand-text hover:bg-slate-50"
                              >
                                Report
                              </Link>
                            </>
                          ) : (
                            <Link
                              href={`/assessments/${assessment.assessmentCode}`}
                              className="rounded-lg bg-brand-purple px-4 py-2 text-sm font-medium text-white hover:bg-brand-purple-dark"
                            >
                              Continue Assessment
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </section>
      </div>
    </AppShell >
  );
}