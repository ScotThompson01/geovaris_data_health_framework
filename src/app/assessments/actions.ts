"use server";

import {
  archiveCompletedAssessment,
  deleteDraftAssessment,
} from "@/db/repositories/assessment-repository";

import {
  and,
  eq,
} from "drizzle-orm";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db/client";

import {
  assessmentResponses,
  assessments,
  templateQuestionOptions,
  templateQuestions,
} from "@/db/schema";

import { recalculateAssessmentScores } from "@/db/services/assessment-scoring-service";

export async function saveAssessmentResponse(
  formData: FormData,
) {
  // --------------------------------------------------
  // Read Form Values
  // --------------------------------------------------

  const assessmentCode = String(
    formData.get("assessmentCode") ?? "",
  ).trim();

  const questionId = String(
    formData.get("questionId") ?? "",
  ).trim();

  const selectedOptionId = String(
    formData.get("selectedOptionId") ?? "",
  ).trim();

  const respondentComment = String(
    formData.get("respondentComment") ?? "",
  ).trim();

  // --------------------------------------------------
  // Validate Required Values
  // --------------------------------------------------

  if (
    !assessmentCode ||
    !questionId ||
    !selectedOptionId
  ) {
    throw new Error(
      "Assessment, question, and response option are required.",
    );
  }

  // --------------------------------------------------
  // Find Assessment
  // --------------------------------------------------

  const [assessment] = await db
    .select({
      id: assessments.id,
      organizationId: assessments.organizationId,
      templateVersionId: assessments.templateVersionId,
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

  // --------------------------------------------------
  // Validate Question Belongs to Assessment Version
  // --------------------------------------------------

  const [question] = await db
    .select({
      id: templateQuestions.id,
    })
    .from(templateQuestions)
    .where(
      and(
        eq(
          templateQuestions.id,
          questionId,
        ),
        eq(
          templateQuestions.templateVersionId,
          assessment.templateVersionId,
        ),
      ),
    )
    .limit(1);

  if (!question) {
    throw new Error(
      "The selected question does not belong to this assessment.",
    );
  }

  // --------------------------------------------------
  // Validate Option Belongs to Question
  // --------------------------------------------------

  const [option] = await db
    .select({
      id: templateQuestionOptions.id,
    })
    .from(templateQuestionOptions)
    .where(
      and(
        eq(
          templateQuestionOptions.id,
          selectedOptionId,
        ),
        eq(
          templateQuestionOptions.questionId,
          questionId,
        ),
      ),
    )
    .limit(1);

  if (!option) {
    throw new Error(
      "The selected answer option does not belong to this question.",
    );
  }

  // --------------------------------------------------
  // Find Existing Response
  // --------------------------------------------------

  const [existingResponse] = await db
    .select({
      id: assessmentResponses.id,
    })
    .from(assessmentResponses)
    .where(
      and(
        eq(
          assessmentResponses.assessmentId,
          assessment.id,
        ),
        eq(
          assessmentResponses.questionId,
          questionId,
        ),
      ),
    )
    .limit(1);

  // --------------------------------------------------
  // Update Existing Response
  // --------------------------------------------------

  if (existingResponse) {
    await db
      .update(assessmentResponses)
      .set({
        selectedOptionId,
        respondentComment:
          respondentComment || null,
        status: "submitted",
        submittedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        eq(
          assessmentResponses.id,
          existingResponse.id,
        ),
      );
  } else {
    // ------------------------------------------------
    // Create New Response
    // ------------------------------------------------

    await db
      .insert(assessmentResponses)
      .values({
        organizationId:
          assessment.organizationId,

        assessmentId:
          assessment.id,

        questionId,

        selectedOptionId,

        respondentComment:
          respondentComment || null,

        status: "submitted",

        submittedAt: new Date(),
      });
  }

  // --------------------------------------------------
  // Refresh Assessment Page
  // --------------------------------------------------

  await recalculateAssessmentScores(
    assessment.id,
  );
  revalidatePath(
    `/assessments/${assessmentCode}`,
  );
}
// ==================================================
// Delete Draft Assessment
// ==================================================

export async function deleteDraftAssessmentAction(
  formData: FormData,
) {
  const assessmentId =
    formData.get("assessmentId");

  if (
    typeof assessmentId !== "string" ||
    !assessmentId
  ) {
    throw new Error(
      "Assessment ID is required.",
    );
  }

  await deleteDraftAssessment(
    assessmentId,
  );

  revalidatePath(
    "/assessments",
  );

  revalidatePath(
    "/clients",
  );

  redirect(
    "/assessments",
  );
}
// ==================================================
// Archive Completed Assessment
// ==================================================

export async function archiveCompletedAssessmentAction(
  formData: FormData,
) {
  const assessmentId =
    formData.get("assessmentId");

  if (
    typeof assessmentId !== "string" ||
    !assessmentId
  ) {
    throw new Error(
      "Assessment ID is required.",
    );
  }

  await archiveCompletedAssessment(
    assessmentId,
  );

  revalidatePath(
    "/assessments",
  );

  revalidatePath(
    "/clients",
  );

  redirect(
    "/assessments",
  );
}