import Link from "next/link";

import { AppShell } from "@/components/brand/AppShell";

import {
  getClients,
} from "@/db/repositories/client-repository";

type ClientsPageProps = {
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

export default async function ClientsPage({
  searchParams,
}: ClientsPageProps) {
  const { status } =
    await searchParams;

  const clients =
    await getClients();

  const validStatuses = [
    "active",
    "inactive",
  ];

  const selectedStatus =
    status &&
    validStatuses.includes(
      status,
    )
      ? status
      : "all";

  const filteredClients =
    selectedStatus === "all"
      ? clients
      : clients.filter(
          (client) =>
            client.status ===
            selectedStatus,
        );

  const activeClientCount =
    clients.filter(
      (client) =>
        client.status === "active",
    ).length;

  const inactiveClientCount =
    clients.filter(
      (client) =>
        client.status === "inactive",
    ).length;

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
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

        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-purple">
              Client Management
            </p>

            <h1 className="mt-2 text-3xl font-bold text-brand-text">
              Clients
            </h1>

            <p className="mt-2 max-w-2xl text-brand-muted">
              Manage client organizations and
              prepare them for assessment
              assignment and reporting.
            </p>
          </div>

          <Link
            href="/clients/new"
            className="rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-purple-dark"
          >
            Create New Client
          </Link>
        </div>

        {/* Status Filter */}

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/clients"
            className={
              selectedStatus === "all"
                ? "rounded-lg bg-brand-purple px-4 py-2 text-sm font-medium text-white"
                : "rounded-lg border border-brand-border bg-white px-4 py-2 text-sm font-medium text-brand-text hover:bg-slate-50"
            }
          >
            All
          </Link>

          <Link
            href="/clients?status=active"
            className={
              selectedStatus === "active"
                ? "rounded-lg bg-brand-purple px-4 py-2 text-sm font-medium text-white"
                : "rounded-lg border border-brand-border bg-white px-4 py-2 text-sm font-medium text-brand-text hover:bg-slate-50"
            }
          >
            Active
          </Link>

          <Link
            href="/clients?status=inactive"
            className={
              selectedStatus === "inactive"
                ? "rounded-lg bg-brand-purple px-4 py-2 text-sm font-medium text-white"
                : "rounded-lg border border-brand-border bg-white px-4 py-2 text-sm font-medium text-brand-text hover:bg-slate-50"
            }
          >
            Inactive
          </Link>
        </div>

        {/* Summary */}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
            <p className="text-sm text-brand-muted">
              Total Clients
            </p>

            <p className="mt-1 text-2xl font-bold text-brand-text">
              {clients.length}
            </p>
          </div>

          <div className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
            <p className="text-sm text-brand-muted">
              Active
            </p>

            <p className="mt-1 text-2xl font-bold text-brand-text">
              {activeClientCount}
            </p>
          </div>

          <div className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
            <p className="text-sm text-brand-muted">
              Inactive
            </p>

            <p className="mt-1 text-2xl font-bold text-brand-text">
              {inactiveClientCount}
            </p>
          </div>
        </div>

        {/* Client List */}

        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-brand-text">
              Client Directory
            </h2>

            <p className="mt-2 text-sm text-brand-muted">
              Select a client to view details
              and assessment activity.
            </p>
          </div>

          {filteredClients.length === 0 ? (
            <div className="rounded-2xl border border-brand-border bg-white p-8 shadow-sm">
              <h3 className="font-semibold text-brand-text">
                No clients found
              </h3>

              <p className="mt-2 text-brand-muted">
                {selectedStatus === "all"
                  ? "Create your first client to begin managing assessments."
                  : `There are currently no ${selectedStatus} clients.`}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm">
              <div className="grid grid-cols-[1.4fr_1fr_1fr_120px_140px] gap-4 border-b border-brand-border bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-brand-muted">
                <span>
                  Client
                </span>

                <span>
                  Legal Name
                </span>

                <span>
                  Industry
                </span>

                <span>
                  Status
                </span>

                <span>
                  Updated
                </span>
              </div>

              {filteredClients.map(
                (client) => (
                  <Link
                    key={
                      client.clientId
                    }
                    href={`/clients/${client.clientId}`}
                    className="grid grid-cols-[1.4fr_1fr_1fr_120px_140px] gap-4 border-b border-brand-border px-5 py-4 last:border-b-0 hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-medium text-brand-text">
                        {
                          client.clientName
                        }
                      </p>

                      {client.description && (
                        <p className="mt-1 line-clamp-1 text-sm text-brand-muted">
                          {
                            client.description
                          }
                        </p>
                      )}
                    </div>

                    <p className="text-sm text-brand-muted">
                      {client.legalName ??
                        "—"}
                    </p>

                    <p className="text-sm text-brand-muted">
                      {client.industry ??
                        "—"}
                    </p>

                    <div>
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

                    <p className="text-sm text-brand-muted">
                      {formatDate(
                        client.updatedAt,
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