import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/brand/AppShell";

import {
  getAssessmentTemplateVersionById,
} from "@/db/repositories/template-repository";

import {
  createOptionAction,
  createQuestionAction,
  createSectionAction,
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

        {/* Add Section */}

        {isDraft && (
          <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-purple">
                Template Structure
              </p>

              <h2 className="mt-2 text-xl font-bold text-brand-text">
                Add Section
              </h2>

              <p className="mt-2 text-sm text-brand-muted">
                Add a new section to this draft template version.
              </p>
            </div>

            <form
              action={createSectionAction}
              className="grid gap-5 md:grid-cols-2"
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

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-brand-text"
                >
                  Section Name
                </label>

                <input
                  id="name"
                  name="name"
                  required
                  maxLength={200}
                  placeholder="Data Governance"
                  className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
                />
              </div>

              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-brand-text"
                >
                  Section Code
                </label>

                <input
                  id="code"
                  name="code"
                  required
                  maxLength={50}
                  placeholder="GOV"
                  className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
                />
              </div>

              <div>
                <label
                  htmlFor="displayOrder"
                  className="block text-sm font-medium text-brand-text"
                >
                  Display Order
                </label>

                <input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  min={1}
                  placeholder="1"
                  className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
                />
              </div>

              <div>
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-brand-text"
                >
                  Weight
                </label>

                <input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.0001"
                  min={0}
                  placeholder="25"
                  className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-brand-text"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Describe what this section evaluates."
                  className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
                />
              </div>

              <div className="md:col-span-2 flex items-center justify-between gap-4">
                <label className="flex items-center gap-3 text-sm text-brand-text">
                  <input
                    type="checkbox"
                    name="isRequired"
                    defaultChecked
                    className="h-4 w-4"
                  />

                  Required Section
                </label>

                <button
                  type="submit"
                  className="rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-purple-dark"
                >
                  Add Section
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Add Question */}

        {isDraft && editorData.version.sections.length > 0 && (
          <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-purple">
                Template Content
              </p>

              <h2 className="mt-2 text-xl font-bold text-brand-text">
                Add Question
              </h2>

              <p className="mt-2 text-sm text-brand-muted">
                Add a question to one of the sections in this
                draft template version.
              </p>
            </div>

            <form
              action={createQuestionAction}
              className="grid gap-5 md:grid-cols-2"
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

              {/* Section */}

              <div>
                <label
                  htmlFor="questionSectionId"
                  className="block text-sm font-medium text-brand-text"
                >
                  Section
                </label>

                <select
                  id="questionSectionId"
                  name="sectionId"
                  required
                  defaultValue=""
                  className="mt-2 w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-brand-text"
                >
                  <option
                    value=""
                    disabled
                  >
                    Select section
                  </option>

                  {editorData.version.sections.map(
                    (section) => (
                      <option
                        key={section.sectionId}
                        value={section.sectionId}
                      >
                        {section.sectionName}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Question Code */}

              <div>
                <label
                  htmlFor="questionCode"
                  className="block text-sm font-medium text-brand-text"
                >
                  Question Code
                </label>

                <input
                  id="questionCode"
                  name="questionCode"
                  required
                  maxLength={50}
                  placeholder="GOV-001"
                  className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
                />
              </div>

              {/* Question Text */}

              <div className="md:col-span-2">
                <label
                  htmlFor="newQuestionText"
                  className="block text-sm font-medium text-brand-text"
                >
                  Question
                </label>

                <textarea
                  id="newQuestionText"
                  name="questionText"
                  required
                  rows={3}
                  placeholder="Does the organization have clearly defined ownership for important data?"
                  className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
                />
              </div>

              {/* Guidance */}

              <div className="md:col-span-2">
                <label
                  htmlFor="newGuidanceText"
                  className="block text-sm font-medium text-brand-text"
                >
                  Guidance
                </label>

                <textarea
                  id="newGuidanceText"
                  name="guidanceText"
                  rows={3}
                  placeholder="Provide additional guidance to help the assessor interpret this question."
                  className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
                />
              </div>

              {/* Answer Type */}

              <div>
                <label
                  htmlFor="answerType"
                  className="block text-sm font-medium text-brand-text"
                >
                  Answer Type
                </label>

                <select
                  id="answerType"
                  name="answerType"
                  defaultValue="single_select"
                  className="mt-2 w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-brand-text"
                >
                  <option value="single_select">
                    Single Select
                  </option>
                </select>
              </div>

              {/* Display Order */}

              <div>
                <label
                  htmlFor="questionDisplayOrder"
                  className="block text-sm font-medium text-brand-text"
                >
                  Display Order
                </label>

                <input
                  id="questionDisplayOrder"
                  name="displayOrder"
                  type="number"
                  min={1}
                  placeholder="1"
                  className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
                />
              </div>

              {/* Weight */}

              <div>
                <label
                  htmlFor="questionWeight"
                  className="block text-sm font-medium text-brand-text"
                >
                  Weight
                </label>

                <input
                  id="questionWeight"
                  name="weight"
                  type="number"
                  min={0}
                  step="0.0001"
                  placeholder="1"
                  className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
                />
              </div>

              {/* Settings */}

              <div className="space-y-3">
                <p className="text-sm font-medium text-brand-text">
                  Question Settings
                </p>

                <label className="flex items-center gap-3 text-sm text-brand-text">
                  <input
                    type="checkbox"
                    name="isRequired"
                    defaultChecked
                    className="h-4 w-4"
                  />
                  Required
                </label>

                <label className="flex items-center gap-3 text-sm text-brand-text">
                  <input
                    type="checkbox"
                    name="allowsNotApplicable"
                    className="h-4 w-4"
                  />
                  Allow Not Applicable
                </label>

                <label className="flex items-center gap-3 text-sm text-brand-text">
                  <input
                    type="checkbox"
                    name="requiresComment"
                    className="h-4 w-4"
                  />
                  Require Comment
                </label>

                <label className="flex items-center gap-3 text-sm text-brand-text">
                  <input
                    type="checkbox"
                    name="requiresEvidence"
                    className="h-4 w-4"
                  />
                  Require Evidence
                </label>
              </div>

              <div className="md:col-span-2 flex justify-end border-t border-brand-border pt-5">
                <button
                  type="submit"
                  className="rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-purple-dark"
                >
                  Add Question
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Add Answer Option */}

        {isDraft && editorData.version.questions.length > 0 && (
          <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-purple">
                Scoring
              </p>

              <h2 className="mt-2 text-xl font-bold text-brand-text">
                Add Answer Option
              </h2>

              <p className="mt-2 text-sm text-brand-muted">
                Add an answer choice and optional score to a
                question in this draft template.
              </p>
            </div>

            <form
              action={createOptionAction}
              className="grid gap-5 md:grid-cols-2"
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

              <div className="md:col-span-2">
                <label
                  htmlFor="optionQuestionId"
                  className="block text-sm font-medium text-brand-text"
                >
                  Question
                </label>

                <select
                  id="optionQuestionId"
                  name="questionId"
                  required
                  defaultValue=""
                  className="mt-2 w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-brand-text"
                >
                  <option
                    value=""
                    disabled
                  >
                    Select question
                  </option>

                  {editorData.version.questions.map(
                    (question) => (
                      <option
                        key={question.questionId}
                        value={question.questionId}
                      >
                        {question.questionCode} —{" "}
                        {question.questionText}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="newOptionCode"
                  className="block text-sm font-medium text-brand-text"
                >
                  Option Code
                </label>

                <input
                  id="newOptionCode"
                  name="optionCode"
                  required
                  maxLength={50}
                  placeholder="YES"
                  className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
                />
              </div>

              <div>
                <label
                  htmlFor="newOptionLabel"
                  className="block text-sm font-medium text-brand-text"
                >
                  Option Label
                </label>

                <input
                  id="newOptionLabel"
                  name="optionLabel"
                  required
                  maxLength={250}
                  placeholder="Yes"
                  className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="newOptionDescription"
                  className="block text-sm font-medium text-brand-text"
                >
                  Description
                </label>

                <textarea
                  id="newOptionDescription"
                  name="optionDescription"
                  rows={2}
                  placeholder="Describe what this answer represents."
                  className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
                />
              </div>

              <div>
                <label
                  htmlFor="newOptionValue"
                  className="block text-sm font-medium text-brand-text"
                >
                  Option Value
                </label>

                <input
                  id="newOptionValue"
                  name="optionValue"
                  maxLength={100}
                  placeholder="yes"
                  className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
                />
              </div>

              <div>
                <label
                  htmlFor="newScoreValue"
                  className="block text-sm font-medium text-brand-text"
                >
                  Score
                </label>

                <input
                  id="newScoreValue"
                  name="scoreValue"
                  type="number"
                  step="0.0001"
                  placeholder="4"
                  className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
                />
              </div>

              <div>
                <label
                  htmlFor="optionDisplayOrder"
                  className="block text-sm font-medium text-brand-text"
                >
                  Display Order
                </label>

                <input
                  id="optionDisplayOrder"
                  name="displayOrder"
                  type="number"
                  min={1}
                  placeholder="1"
                  className="mt-2 w-full rounded-lg border border-brand-border px-3 py-2.5 text-brand-text"
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-brand-text">
                  Option Settings
                </p>

                <label className="flex items-center gap-3 text-sm text-brand-text">
                  <input
                    type="checkbox"
                    name="isNotApplicable"
                    className="h-4 w-4"
                  />
                  Not Applicable
                </label>

                <label className="flex items-center gap-3 text-sm text-brand-text">
                  <input
                    type="checkbox"
                    name="requiresComment"
                    className="h-4 w-4"
                  />
                  Require Comment
                </label>

                <label className="flex items-center gap-3 text-sm text-brand-text">
                  <input
                    type="checkbox"
                    name="requiresEvidence"
                    className="h-4 w-4"
                  />
                  Require Evidence
                </label>
              </div>

              <div className="md:col-span-2 flex justify-end border-t border-brand-border pt-5">
                <button
                  type="submit"
                  className="rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-purple-dark"
                >
                  Add Answer Option
                </button>
              </div>
            </form>
          </section>
        )}

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