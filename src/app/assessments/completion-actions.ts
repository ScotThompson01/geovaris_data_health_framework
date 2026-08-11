"use server";

import {
  and,
  eq,
  isNotNull,
} from "drizzle-orm";

import { revalidatePath } from "next/cache";

import { db } from "@/db/client";

import {
  assessmentResponses,
  assessments,
  templateQuestions,
  templateSections,
} from "@/db/schema";

export async function completeAssessment(
  formData: FormData,
) {
  const assessmentCode = String(
    formData.get("assessmentCode") ?? "",
  ).trim();

  if (!assessmentCode) {
    throw new Error(
      "Assessment code is required.",
    );
  }

  const [assessment] = await db
    .select({
      id: assessments.id,
      templateVersionId:
        assessments.templateVersionId,
    })
    .from(assessments)
    .where(
      eq(
        assessments.assessmentCode,
        assessmentCode,
      ),
    )
    .limit(1);

  if (!assessment) {
    throw new Error(
      `Assessment ${assessmentCode} was not found.`,
    );
  }

  const requiredQuestions = await db
    .select({
      questionId: templateQuestions.id,
    })
    .from(templateQuestions)
    .innerJoin(
      templateSections,
      eq(
        templateSections.id,
        templateQuestions.sectionId,
      ),
    )
    .where(
      and(
        eq(
          templateSections.templateVersionId,
          assessment.templateVersionId,
        ),
        eq(
          templateQuestions.isRequired,
          true,
        ),
      ),
    );

  const responses = await db
    .select({
      questionId:
        assessmentResponses.questionId,
    })
    .from(assessmentResponses)
    .where(
      and(
        eq(
          assessmentResponses.assessmentId,
          assessment.id,
        ),
        isNotNull(
          assessmentResponses.selectedOptionId,
        ),
      ),
    );

  const answeredQuestionIds =
    new Set(
      responses.map(
        (response) => response.questionId,
      ),
    );

  const unansweredRequiredQuestions =
    requiredQuestions.filter(
      (question) =>
        !answeredQuestionIds.has(
          question.questionId,
        ),
    );

  if (
    unansweredRequiredQuestions.length > 0
  ) {
    throw new Error(
      `Assessment cannot be completed. ${unansweredRequiredQuestions.length} required question(s) remain unanswered.`,
    );
  }

  await db
    .update(assessments)
    .set({
      status: "completed",
      submittedAt: new Date(),
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      eq(
        assessments.id,
        assessment.id,
      ),
    );

  revalidatePath(
    `/assessments/${assessmentCode}`,
  );

  revalidatePath("/assessments");
}