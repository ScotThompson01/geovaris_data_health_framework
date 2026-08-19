import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/brand/AppShell";

import {
  getAssessmentTemplateById,
} from "@/db/repositories/template-repository";

import {
  createTemplateVersionAction,
  publishTemplateVersionAction,
} from "./actions";

import {
  PublishVersionButton,
} from "@/components/templates/PublishVersionButton";

type TemplateDetailPageProps = {
  params: Promise<{
    templateId: string;
  }>;
};

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

export default async function TemplateDetailPage({
  params,
}: TemplateDetailPageProps) {
  const { templateId } = await params;

  const template =
    await getAssessmentTemplateById(
      templateId,
    );

  if (!template) {
    notFound();
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        {/* Navigation */}

        <div className="mb-6">
          <Link
            href="/templates"
            className="text-sm font-medium text-brand-purple hover:text-brand-purple-dark"
          >
            ← Back to Assessment Templates
          </Link>
        </div>

        {/* Template Header */}

        <section className="rounded-2xl border border-brand-border bg-white p-7 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-purple">
                Assessment Template
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-brand-text">
                  {template.templateName}
                </h1>

                <span className="rounded-full bg-brand-blue-light px-3 py-1 text-xs font-semibold text-brand-purple-dark">
                  {formatStatus(
                    template.templateStatus,
                  )}
                </span>
              </div>

              {template.description && (
                <p className="mt-4 max-w-3xl leading-7 text-brand-muted">
                  {template.description}
                </p>
              )}
            </div>
          </div>

          {/* Template Metadata */}

          <div className="mt-7 grid gap-6 border-t border-brand-border pt-6 md:grid-cols-4">
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
        </section>

        {/* Create New Version */}

        <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-purple">
              Template Management
            </p>

            <h2 className="mt-2 text-xl font-bold text-brand-text">
              Create New Version
            </h2>

            <p className="mt-2 text-sm text-brand-muted">
              Create a new draft by copying an existing
              template version. The published source
              version will remain unchanged.
            </p>
          </div>

          {template.versions.length > 0 ? (
            <form
              action={createTemplateVersionAction}
              className="grid gap-5 md:grid-cols-2"
            >
              <input
                type="hidden"
                name="templateId"
                value={template.templateId}
              />

              <div>
                <label
                  htmlFor="sourceVersionId"
                  className="block text-sm font-medium text-brand-text"
                >
                  Copy From
                </label>

                <select
                  id="sourceVersionId"
                  name="sourceVersionId"
                  required
                  defaultValue={
                    template.versions[
                      template.versions.length - 1
                    ].versionId
                  }
                  className="mt-2 w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-brand-text"
                >
                  {template.versions.map(
                    (version) => (
                      <option
                        key={version.versionId}
                        value={version.versionId}
                      >
                        Version{" "}
                        {version.versionLabel}
                        {" — "}
                        {formatStatus(
                          version.versionStatus,
                        )}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="versionLabel"
                  className="block text-sm font-medium text-brand-text"
                >
                  New Version Label
                </label>

                <input
                  id="versionLabel"
                  name="versionLabel"
                  type="text"
                  required
                  maxLength={30}
                  placeholder="1.2"
                  className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="changeSummary"
                  className="block text-sm font-medium text-brand-text"
                >
                  Change Summary
                </label>

                <textarea
                  id="changeSummary"
                  name="changeSummary"
                  rows={3}
                  placeholder="Describe the changes planned for this version."
                  className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-purple-dark"
                >
                  Create Draft Version
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-brand-muted">
              A source version is required before a
              new version can be created.
            </p>
          )}
        </section>

        {/* Versions */}

        <section className="mt-8">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-purple">
              Version Control
            </p>

            <h2 className="mt-2 text-2xl font-bold text-brand-text">
              Template Versions
            </h2>

            <p className="mt-2 text-brand-muted">
              Review the version history, sections,
              questions, answer options, scoring,
              and publication status for this
              assessment template.
            </p>
          </div>

          {template.versions.length === 0 ? (
            <div className="rounded-xl border border-brand-border bg-white p-8 shadow-sm">
              <h3 className="font-semibold text-brand-text">
                No versions found
              </h3>

              <p className="mt-2 text-brand-muted">
                This template does not currently
                contain any versions.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {template.versions.map(
                (version) => (
                  <article
                    key={version.versionId}
                    className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm"
                  >
                    {/* Version Header */}

                    <div className="flex flex-wrap items-start justify-between gap-6">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-semibold text-brand-text">
                            Version{" "}
                            {version.versionLabel}
                          </h3>

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {formatStatus(
                              version.versionStatus,
                            )}
                          </span>
                        </div>

                        {version.changeSummary && (
                          <p className="mt-3 text-brand-muted">
                            {version.changeSummary}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right text-sm text-brand-muted">
                          <p>
                            Created{" "}
                            {formatDate(
                              version.createdAt,
                            )}
                          </p>

                          {version.publishedAt && (
                            <p className="mt-1">
                              Published{" "}
                              {formatDate(
                                version.publishedAt,
                              )}
                            </p>
                          )}
                        </div>

                        {version.versionStatus === "draft" ? (
                          <div className="flex flex-wrap items-center justify-end gap-3">
                            <Link
                              href={`/templates/${template.templateId}/versions/${version.versionId}/edit`}
                              className="rounded-lg bg-brand-purple px-4 py-2 text-sm font-medium text-white hover:bg-brand-purple-dark"
                            >
                              Edit Version
                            </Link>

                            <form
                              action={publishTemplateVersionAction}
                            >
                              <input
                                type="hidden"
                                name="templateId"
                                value={template.templateId}
                              />

                              <input
                                type="hidden"
                                name="versionId"
                                value={version.versionId}
                              />

                              <PublishVersionButton
                                versionLabel={version.versionLabel}
                              />
                            </form>
                          </div>
                        ) : (
                          <Link
                            href={`/templates/${template.templateId}/versions/${version.versionId}/edit`}
                            className="rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-brand-text hover:bg-slate-50"
                          >
                            View Version
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Version Statistics */}

                    <div className="mt-6 grid gap-4 border-t border-brand-border pt-6 sm:grid-cols-3">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-brand-muted">
                          Sections
                        </p>

                        <p className="mt-1 text-2xl font-bold text-brand-text">
                          {version.sectionCount}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-brand-muted">
                          Questions
                        </p>

                        <p className="mt-1 text-2xl font-bold text-brand-text">
                          {version.questionCount}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-brand-muted">
                          Answer Options
                        </p>

                        <p className="mt-1 text-2xl font-bold text-brand-text">
                          {version.optionCount}
                        </p>
                      </div>
                    </div>

                    {/* Sections */}

                    <div className="mt-6">
                      <h4 className="font-semibold text-brand-text">
                        Sections
                      </h4>

                      {version.sections.length ===
                        0 ? (
                        <p className="mt-2 text-sm text-brand-muted">
                          No sections configured.
                        </p>
                      ) : (
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          {version.sections.map(
                            (section) => {
                              const questionCount =
                                version.questions.filter(
                                  (question) =>
                                    question.sectionId ===
                                    section.sectionId,
                                ).length;

                              return (
                                <div
                                  key={
                                    section.sectionId
                                  }
                                  className="rounded-xl border border-brand-border p-4"
                                >
                                  <p className="font-medium text-brand-text">
                                    {
                                      section.sectionName
                                    }
                                  </p>

                                  <p className="mt-1 text-sm text-brand-muted">
                                    {questionCount}{" "}
                                    {questionCount ===
                                      1
                                      ? "question"
                                      : "questions"}
                                  </p>
                                </div>
                              );
                            },
                          )}
                        </div>
                      )}
                    </div>

                    {/* Questions */}

                    <div className="mt-6">
                      <h4 className="font-semibold text-brand-text">
                        Questions
                      </h4>

                      {version.questions.length ===
                        0 ? (
                        <p className="mt-2 text-sm text-brand-muted">
                          No questions configured.
                        </p>
                      ) : (
                        <div className="mt-3 overflow-hidden rounded-xl border border-brand-border">
                          {version.questions.map(
                            (question) => (
                              <div
                                key={
                                  question.questionId
                                }
                                className="border-b border-brand-border px-4 py-4 last:border-b-0"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                      <span className="text-sm font-semibold text-brand-purple">
                                        {
                                          question.questionCode
                                        }
                                      </span>

                                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                        {formatStatus(
                                          question.answerType,
                                        )}
                                      </span>
                                    </div>

                                    <p className="mt-2 text-sm font-medium leading-6 text-brand-text">
                                      {
                                        question.questionText
                                      }
                                    </p>

                                    {question.guidanceText && (
                                      <p className="mt-2 text-sm leading-6 text-brand-muted">
                                        {
                                          question.guidanceText
                                        }
                                      </p>
                                    )}

                                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-brand-muted">
                                      {question.isRequired && (
                                        <span>
                                          Required
                                        </span>
                                      )}

                                      {question.allowsNotApplicable && (
                                        <span>
                                          Allows N/A
                                        </span>
                                      )}

                                      {question.requiresComment && (
                                        <span>
                                          Comment Required
                                        </span>
                                      )}

                                      {question.requiresEvidence && (
                                        <span>
                                          Evidence Required
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <p className="text-xs text-brand-muted">
                                      Weight
                                    </p>

                                    <p className="mt-1 font-semibold text-brand-text">
                                      {question.weight ??
                                        "—"}
                                    </p>
                                  </div>
                                </div>

                                {/* Answer Options */}

                                <div className="mt-4 overflow-hidden rounded-lg border border-brand-border bg-slate-50">
                                  <div className="grid grid-cols-[1fr_110px_90px] border-b border-brand-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-muted">
                                    <span>
                                      Answer Option
                                    </span>

                                    <span>
                                      Code
                                    </span>

                                    <span className="text-right">
                                      Score
                                    </span>
                                  </div>

                                  {question.options
                                    .length === 0 ? (
                                    <div className="px-4 py-3 text-sm text-brand-muted">
                                      No answer
                                      options
                                      configured.
                                    </div>
                                  ) : (
                                    question.options.map(
                                      (option) => (
                                        <div
                                          key={
                                            option.optionId
                                          }
                                          className="grid grid-cols-[1fr_110px_90px] items-center border-b border-brand-border px-4 py-3 text-sm last:border-b-0"
                                        >
                                          <div>
                                            <p className="font-medium text-brand-text">
                                              {
                                                option.optionLabel
                                              }
                                            </p>

                                            {option.optionDescription && (
                                              <p className="mt-1 text-xs text-brand-muted">
                                                {
                                                  option.optionDescription
                                                }
                                              </p>
                                            )}

                                            {option.isNotApplicable && (
                                              <span className="mt-1 inline-block rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">
                                                Not
                                                Applicable
                                              </span>
                                            )}
                                          </div>

                                          <p className="text-brand-muted">
                                            {
                                              option.optionCode
                                            }
                                          </p>

                                          <p className="text-right font-semibold text-brand-text">
                                            {option.scoreValue ??
                                              "—"}
                                          </p>
                                        </div>
                                      ),
                                    )
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}