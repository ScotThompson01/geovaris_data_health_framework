import Link from "next/link";

import { AppShell } from "@/components/brand/AppShell";

import {
  getAssessmentTemplates,
} from "@/db/repositories/template-repository";

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
  value: Date | string | null,
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

export default async function TemplatesPage() {
  const templates =
    await getAssessmentTemplates();

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        {/* Page Header */}

        <div className="mb-8 flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-purple">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold text-brand-text">
              Assessment Templates
            </h1>

            <p className="mt-2 max-w-2xl text-brand-muted">
              Manage assessment templates, versions,
              methodologies, and publication status.
            </p>
          </div>

          <Link
            href="/templates/new"
            className="rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-purple-dark"
          >
            Create New Template
          </Link>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-brand-text hover:bg-brand-blue-light"
            >
              Home
            </Link>

            <Link
              href="/assessments"
              className="rounded-lg border border-brand-purple px-4 py-2 text-sm font-medium text-brand-purple hover:bg-brand-blue-light"
            >
              Assessments
            </Link>
          </div>
        </div>

        {/* Summary */}

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
            <p className="text-sm text-brand-muted">
              Templates
            </p>

            <p className="mt-2 text-3xl font-bold text-brand-text">
              {templates.length}
            </p>
          </div>

          <div className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
            <p className="text-sm text-brand-muted">
              Versions
            </p>

            <p className="mt-2 text-3xl font-bold text-brand-text">
              {templates.reduce(
                (total, template) =>
                  total +
                  template.versionCount,
                0,
              )}
            </p>
          </div>

          <div className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
            <p className="text-sm text-brand-muted">
              Published Versions
            </p>

            <p className="mt-2 text-3xl font-bold text-brand-text">
              {templates.reduce(
                (total, template) =>
                  total +
                  template.versions.filter(
                    (version) =>
                      version.versionStatus ===
                      "published",
                  ).length,
                0,
              )}
            </p>
          </div>
        </div>

        {/* Template List */}

        {templates.length === 0 ? (
          <div className="rounded-xl border border-brand-border bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-brand-text">
              No assessment templates found
            </h2>

            <p className="mt-2 text-brand-muted">
              No templates are currently
              configured for this environment.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {templates.map((template) => (
              <article
                key={template.templateId}
                className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold text-brand-text">
                        {template.templateName}
                      </h2>

                      <span className="rounded-full bg-brand-blue-light px-3 py-1 text-xs font-semibold text-brand-purple-dark">
                        {formatStatus(
                          template.templateStatus,
                        )}
                      </span>
                    </div>

                    {template.description && (
                      <p className="mt-3 leading-6 text-brand-muted">
                        {template.description}
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/templates/${template.templateId}`}
                    className="rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-purple-dark"
                  >
                    Manage Template
                  </Link>
                </div>

                <div className="mt-6 grid gap-5 border-t border-brand-border pt-6 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-brand-muted">
                      Framework
                    </p>

                    <p className="mt-1 font-medium text-brand-text">
                      {template.frameworkName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-brand-muted">
                      Methodology
                    </p>

                    <p className="mt-1 font-medium text-brand-text">
                      {template.methodologyName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-brand-muted">
                      Scope
                    </p>

                    <p className="mt-1 font-medium text-brand-text">
                      {formatStatus(
                        template.templateScope,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-brand-muted">
                      Last Updated
                    </p>

                    <p className="mt-1 font-medium text-brand-text">
                      {formatDate(
                        template.updatedAt,
                      )}
                    </p>
                  </div>
                </div>

                {/* Versions */}

                <div className="mt-6">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-brand-text">
                      Versions
                    </h3>

                    <span className="text-sm text-brand-muted">
                      {template.versionCount}{" "}
                      {template.versionCount === 1
                        ? "version"
                        : "versions"}
                    </span>
                  </div>

                  {template.versions.length === 0 ? (
                    <p className="mt-3 text-sm text-brand-muted">
                      No versions have been created.
                    </p>
                  ) : (
                    <div className="mt-3 overflow-hidden rounded-lg border border-brand-border">
                      {template.versions.map(
                        (version) => (
                          <div
                            key={
                              version.versionId
                            }
                            className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border px-4 py-3 last:border-b-0"
                          >
                            <div>
                              <p className="font-medium text-brand-text">
                                Version{" "}
                                {
                                  version.versionLabel
                                }
                              </p>

                              <p className="mt-1 text-xs text-brand-muted">
                                Created{" "}
                                {formatDate(
                                  version.createdAt,
                                )}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                {formatStatus(
                                  version.versionStatus,
                                )}
                              </span>

                              {version.publishedAt && (
                                <span className="text-xs text-brand-muted">
                                  Published{" "}
                                  {formatDate(
                                    version.publishedAt,
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}