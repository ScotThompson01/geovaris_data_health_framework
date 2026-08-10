import { notFound } from "next/navigation";

import { saveAssessmentResponse } from "../actions";

import { getAssessmentRunnerByCode } from "@/db/repositories/assessment-repository";

type AssessmentPageProps = {
  params: Promise<{
    assessmentCode: string;
  }>;
};

function formatScore(
  score: string | null | undefined,
) {
  if (score === null || score === undefined) {
    return "—";
  }

  const numericScore = Number(score);

  if (Number.isNaN(numericScore)) {
    return score;
  }

  return `${numericScore.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}%`;
}

export default async function AssessmentPage({
  params,
}: AssessmentPageProps) {
  const { assessmentCode } = await params;

  const data =
    await getAssessmentRunnerByCode(assessmentCode);

  if (!data) {
    notFound();
  }

  const {
    assessment,
    responses,
    availableOptions,
    sectionScores,
    overallScore,
  } = data;

  const groupedSections = responses.reduce<
    Record<
      string,
      {
        sectionName: string;
        questions: typeof responses;
      }
    >
  >((acc, response) => {
    const key = response.sectionId;

    if (!acc[key]) {
      acc[key] = {
        sectionName: response.sectionName,
        questions: [],
      };
    }

    acc[key].questions.push(response);

    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Assessment Header */}

        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
            GeoVaris Assessment Platform
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {assessment.assessmentName}
          </h1>

          <p className="mt-2 text-slate-600">
            {assessment.assessmentCode}
          </p>

          <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
            <p>
              <span className="font-medium text-slate-900">
                Client:
              </span>{" "}
              {assessment.clientName}
            </p>

            <p>
              <span className="font-medium text-slate-900">
                Status:
              </span>{" "}
              {assessment.assessmentStatus}
            </p>

            <p>
              <span className="font-medium text-slate-900">
                Framework:
              </span>{" "}
              {assessment.frameworkName}
            </p>

            <p>
              <span className="font-medium text-slate-900">
                Methodology:
              </span>{" "}
              {assessment.methodologyName}
            </p>

            <p>
              <span className="font-medium text-slate-900">
                Template:
              </span>{" "}
              {assessment.templateName}
            </p>

            <p>
              <span className="font-medium text-slate-900">
                Version:
              </span>{" "}
              {assessment.versionLabel}
            </p>
          </div>
        </div>

        {/* Overall Score */}

        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Overall Score
          </p>

          <p className="mt-2 text-4xl font-bold text-slate-900">
            {formatScore(
              overallScore?.normalizedScore,
            )}
          </p>
        </div>

        {/* Assessment Sections */}

        <div className="space-y-8">
          {Object.entries(groupedSections).map(
            ([sectionId, section]) => {
              const sectionScore =
                sectionScores.find(
                  (score) =>
                    score.sectionId === sectionId,
                );

              return (
                <section key={sectionId}>
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <h2 className="text-2xl font-semibold text-slate-900">
                      {section.sectionName}
                    </h2>

                    <div className="text-right">
                      <p className="text-sm text-slate-500">
                        Section Score
                      </p>

                      <p className="text-xl font-semibold text-slate-900">
                        {formatScore(
                          sectionScore?.normalizedScore,
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Questions */}

                  <div className="space-y-4">
                    {section.questions.map(
                      (question) => {
                        const questionOptions =
                          availableOptions.filter(
                            (option) =>
                              option.questionId ===
                              question.questionId,
                          );

                        return (
                          <div
                            key={question.questionId}
                            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-6">
                              <div>
                                <p className="text-sm font-medium text-indigo-600">
                                  {
                                    question.questionCode
                                  }
                                </p>

                                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                                  {
                                    question.questionText
                                  }
                                </h3>

                                {question.guidanceText && (
                                  <p className="mt-2 text-sm text-slate-500">
                                    {
                                      question.guidanceText
                                    }
                                  </p>
                                )}
                              </div>

                              <div className="min-w-28 text-right">
                                <p className="text-sm text-slate-500">
                                  Score
                                </p>

                                <p className="text-2xl font-semibold text-slate-900">
                                  {formatScore(
                                    question.normalizedScore,
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Response Form */}

                            <form
                              action={
                                saveAssessmentResponse
                              }
                              className="mt-6 border-t border-slate-100 pt-6"
                            >
                              <input
                                type="hidden"
                                name="assessmentCode"
                                value={
                                  assessment.assessmentCode
                                }
                              />

                              <input
                                type="hidden"
                                name="questionId"
                                value={
                                  question.questionId
                                }
                              />

                              <fieldset>
                                <legend className="text-sm font-medium text-slate-700">
                                  Select Response
                                </legend>

                                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                  {questionOptions.map(
                                    (option) => (
                                      <label
                                        key={
                                          option.optionId
                                        }
                                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
                                      >
                                        <input
                                          type="radio"
                                          name="selectedOptionId"
                                          value={
                                            option.optionId
                                          }
                                          defaultChecked={
                                            option.optionId ===
                                            question.selectedOptionId
                                          }
                                          required
                                          className="h-4 w-4"
                                        />

                                        <span className="font-medium text-slate-900">
                                          {
                                            option.optionLabel
                                          }
                                        </span>
                                      </label>
                                    ),
                                  )}
                                </div>
                              </fieldset>

                              <div className="mt-5">
                                <label
                                  htmlFor={`comment-${question.questionId}`}
                                  className="text-sm font-medium text-slate-700"
                                >
                                  Comment
                                </label>

                                <textarea
                                  id={`comment-${question.questionId}`}
                                  name="respondentComment"
                                  defaultValue={
                                    question.respondentComment ??
                                    ""
                                  }
                                  rows={3}
                                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900"
                                  placeholder="Add supporting context or notes..."
                                />
                              </div>

                              <div className="mt-5 flex items-center justify-between gap-4">
                                <div className="text-sm text-slate-500">
                                  {question.selectedOptionLabel
                                    ? `Current response: ${question.selectedOptionLabel}`
                                    : "Not answered"}
                                </div>

                                <button
                                  type="submit"
                                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                                >
                                  Save Response
                                </button>
                              </div>
                            </form>
                          </div>
                        );
                      },
                    )}
                  </div>
                </section>
              );
            },
          )}
        </div>
      </div>
    </main>
  );
}
