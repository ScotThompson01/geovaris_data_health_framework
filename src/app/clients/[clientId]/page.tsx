import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/brand/AppShell";

import {
  getClientById,
} from "@/db/repositories/client-repository";

import {
  getAssessmentsByClientId,
} from "@/db/repositories/assessment-repository";

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

          <Link
            href={`/assessments/new?clientId=${client.clientId}`}
            className="rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-purple-dark"
          >
            Create Assessment
          </Link>
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

        {/* Assessments */}

        <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-brand-text">
                Assessments
              </h2>

              <p className="mt-2 text-sm text-brand-muted">
                Assessment history and
                progress for this client.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {clientAssessments.length}{" "}
              {clientAssessments.length === 1
                ? "assessment"
                : "assessments"}
            </span>
          </div>

          {clientAssessments.length ===
          0 ? (
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
            <div className="mt-6 overflow-hidden rounded-xl border border-brand-border">
              <div className="grid grid-cols-[1.5fr_1fr_120px_120px_120px] gap-4 border-b border-brand-border bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-muted">
                <span>
                  Assessment
                </span>

                <span>
                  Framework
                </span>

                <span>
                  Status
                </span>

                <span>
                  Progress
                </span>

                <span>
                  Score
                </span>
              </div>

              {clientAssessments.map(
                (assessment) => (
                  <Link
                    key={
                      assessment.assessmentId
                    }
                    href={`/assessments/${assessment.assessmentCode}`}
                    className="grid grid-cols-[1.5fr_1fr_120px_120px_120px] gap-4 border-b border-brand-border px-4 py-4 last:border-b-0 hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-medium text-brand-text">
                        {
                          assessment.assessmentName
                        }
                      </p>

                      <p className="mt-1 text-xs text-brand-muted">
                        {
                          assessment.assessmentCode
                        }
                      </p>
                    </div>

                    <p className="text-sm text-brand-muted">
                      {
                        assessment.frameworkName
                      }
                    </p>

                    <p className="text-sm text-brand-muted">
                      {formatStatus(
                        assessment.assessmentStatus,
                      )}
                    </p>

                    <p className="text-sm text-brand-muted">
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

                    <p className="text-sm font-semibold text-brand-text">
                      {formatScore(
                        assessment.normalizedScore,
                      )}
                    </p>
                  </Link>
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}