import { notFound } from "next/navigation";

import { getAssessmentRunnerByCode } from "@/db/repositories/assessment-repository";

type AssessmentPageProps = {
  params: Promise<{
    assessmentCode: string;
  }>;
};

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

        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Overall Score
          </p>

          <p className="mt-2 text-4xl font-bold text-slate-900">
            {overallScore?.normalizedScore ?? "—"}%
          </p>
        </div>

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
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900">
                        {section.sectionName}
                      </h2>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-slate-500">
                        Section Score
                      </p>

                      <p className="text-xl font-semibold text-slate-900">
                        {sectionScore?.normalizedScore ??
                          "—"}
                        %
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {section.questions.map(
                      (question) => (
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
                                {question.normalizedScore ??
                                  "—"}
                                %
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 border-t border-slate-100 pt-4">
                            <p className="text-sm text-slate-500">
                              Selected Response
                            </p>

                            <p className="mt-1 font-medium text-slate-900">
                              {question.selectedOptionLabel ??
                                "No response"}
                            </p>

                            {question.respondentComment && (
                              <div className="mt-4">
                                <p className="text-sm text-slate-500">
                                  Respondent Comment
                                </p>

                                <p className="mt-1 text-slate-700">
                                  {
                                    question.respondentComment
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ),
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
