import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/brand/AppShell";

import {
  getAssessmentTemplateVersionById,
} from "@/db/repositories/template-repository";

import {
  updateOptionAction,
  updateQuestionAction,
} from "./actions";

type EditTemplateVersionPageProps = {
  params: Promise<{
    templateId: string;
    versionId: string;
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

export default async function EditTemplateVersionPage({
  params,
}: EditTemplateVersionPageProps) {
  const {
    templateId,
    versionId,
  } = await params;

  const editorData =
    await getAssessmentTemplateVersionById(
      templateId,
      versionId,
    );

  if (!editorData) {
    notFound();
  }

  const {
    version,
  } = editorData;

  const isDraft =
    version.versionStatus ===
    "draft";

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        {/* Navigation */}

        <div className="mb-6">
          <Link
            href={`/templates/${templateId}`}
            className="text-sm font-medium text-brand-purple hover:text-brand-purple-dark"
          >
            ← Back to Template
          </Link>
        </div>

        {/* Header */}

        <section className="rounded-2xl border border-brand-border bg-white p-7 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-purple">
            Template Editor
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-brand-text">
              {editorData.templateName}
            </h1>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              Version{" "}
              {version.versionLabel}
            </span>

            <span className="rounded-full bg-brand-blue-light px-3 py-1 text-xs font-semibold text-brand-purple-dark">
              {formatStatus(
                version.versionStatus,
              )}
            </span>
          </div>

          <p className="mt-4 text-brand-muted">
            {editorData.frameworkName}
            {" · "}
            {editorData.methodologyName}
          </p>

          {!isDraft && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-semibold text-amber-900">
                Published version
              </p>

              <p className="mt-1 text-sm text-amber-800">
                Published template versions are
                read-only. Create a new draft
                version to make changes.
              </p>
            </div>
          )}
        </section>

        {/* Questions */}

        <section className="mt-8">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-purple">
              Draft Content
            </p>

            <h2 className="mt-2 text-2xl font-bold text-brand-text">
              Questions & Answer Options
            </h2>

            <p className="mt-2 text-brand-muted">
              Update assessment wording,
              guidance, answer-option labels,
              descriptions, and scoring.
            </p>
          </div>

          <div className="space-y-6">
            {version.questions.map(
              (question) => (
                <article
                  key={question.questionId}
                  className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm"
                >
                  {/* Question Editor */}

                  <form
                    action={
                      updateQuestionAction
                    }
                  >
                    <input
                      type="hidden"
                      name="templateId"
                      value={templateId}
                    />

                    <input
                      type="hidden"
                      name="versionId"
                      value={versionId}
                    />

                    <input
                      type="hidden"
                      name="questionId"
                      value={
                        question.questionId
                      }
                    />

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-semibold text-brand-purple">
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

                      <p className="text-sm text-brand-muted">
                        Weight:{" "}
                        {question.weight ??
                          "—"}
                      </p>
                    </div>

                    <div className="mt-5">
                      <label
                        htmlFor={`questionText-${question.questionId}`}
                        className="block text-sm font-medium text-brand-text"
                      >
                        Question Text
                      </label>

                      <textarea
                        id={`questionText-${question.questionId}`}
                        name="questionText"
                        rows={2}
                        required
                        disabled={!isDraft}
                        defaultValue={
                          question.questionText
                        }
                        className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text disabled:bg-slate-100"
                      />
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor={`guidanceText-${question.questionId}`}
                        className="block text-sm font-medium text-brand-text"
                      >
                        Guidance Text
                      </label>

                      <textarea
                        id={`guidanceText-${question.questionId}`}
                        name="guidanceText"
                        rows={3}
                        disabled={!isDraft}
                        defaultValue={
                          question.guidanceText ??
                          ""
                        }
                        className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text disabled:bg-slate-100"
                      />
                    </div>

                    {isDraft && (
                      <div className="mt-4 flex justify-end">
                        <button
                          type="submit"
                          className="rounded-lg bg-brand-purple px-4 py-2 text-sm font-medium text-white hover:bg-brand-purple-dark"
                        >
                          Save Question
                        </button>
                      </div>
                    )}
                  </form>

                  {/* Options */}

                  <div className="mt-6 border-t border-brand-border pt-6">
                    <h3 className="font-semibold text-brand-text">
                      Answer Options
                    </h3>

                    <div className="mt-4 space-y-4">
                      {question.options.map(
                        (option) => (
                          <form
                            key={
                              option.optionId
                            }
                            action={
                              updateOptionAction
                            }
                            className="rounded-xl border border-brand-border bg-slate-50 p-4"
                          >
                            <input
                              type="hidden"
                              name="templateId"
                              value={
                                templateId
                              }
                            />

                            <input
                              type="hidden"
                              name="versionId"
                              value={
                                versionId
                              }
                            />

                            <input
                              type="hidden"
                              name="questionId"
                              value={
                                question.questionId
                              }
                            />

                            <input
                              type="hidden"
                              name="optionId"
                              value={
                                option.optionId
                              }
                            />

                            <div className="grid gap-4 md:grid-cols-[1.1fr_1.5fr_130px]">
                              <div>
                                <label
                                  htmlFor={`optionLabel-${option.optionId}`}
                                  className="block text-xs font-semibold uppercase tracking-wide text-brand-muted"
                                >
                                  Option Label
                                </label>

                                <input
                                  id={`optionLabel-${option.optionId}`}
                                  name="optionLabel"
                                  required
                                  disabled={
                                    !isDraft
                                  }
                                  defaultValue={
                                    option.optionLabel
                                  }
                                  className="mt-2 w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text disabled:bg-slate-100"
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor={`optionDescription-${option.optionId}`}
                                  className="block text-xs font-semibold uppercase tracking-wide text-brand-muted"
                                >
                                  Description
                                </label>

                                <input
                                  id={`optionDescription-${option.optionId}`}
                                  name="optionDescription"
                                  disabled={
                                    !isDraft
                                  }
                                  defaultValue={
                                    option.optionDescription ??
                                    ""
                                  }
                                  className="mt-2 w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text disabled:bg-slate-100"
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor={`scoreValue-${option.optionId}`}
                                  className="block text-xs font-semibold uppercase tracking-wide text-brand-muted"
                                >
                                  Score
                                </label>

                                <input
                                  id={`scoreValue-${option.optionId}`}
                                  name="scoreValue"
                                  type="number"
                                  step="0.0001"
                                  disabled={
                                    !isDraft ||
                                    option.isNotApplicable
                                  }
                                  defaultValue={
                                    option.scoreValue ??
                                    ""
                                  }
                                  className="mt-2 w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text disabled:bg-slate-100"
                                />
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-3 text-xs text-brand-muted">
                                <span>
                                  Code:{" "}
                                  {
                                    option.optionCode
                                  }
                                </span>

                                {option.isNotApplicable && (
                                  <span className="rounded-full bg-slate-200 px-2 py-1">
                                    Not Applicable
                                  </span>
                                )}
                              </div>

                              {isDraft && (
                                <button
                                  type="submit"
                                  className="rounded-lg border border-brand-purple px-3 py-1.5 text-sm font-medium text-brand-purple hover:bg-brand-blue-light"
                                >
                                  Save Option
                                </button>
                              )}
                            </div>
                          </form>
                        ),
                      )}
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}