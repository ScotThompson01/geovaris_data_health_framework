import {
  and,
  eq,
  isNull,
} from "drizzle-orm";

import { db } from "@/db/client";

import {
  assessmentResponses,
  assessmentResponseScores,
  assessmentScores,
  templateQuestionOptions,
  templateQuestions,
} from "@/db/schema";

export async function recalculateAssessmentScores(
  assessmentId: string,
) {
  // --------------------------------------------------
  // Load Assessment Responses + Question Configuration
  // --------------------------------------------------

  const responses = await db
    .select({
      responseId: assessmentResponses.id,
      organizationId:
        assessmentResponses.organizationId,
      questionId: assessmentResponses.questionId,
      selectedOptionId:
        assessmentResponses.selectedOptionId,

      sectionId: templateQuestions.sectionId,
      questionWeight: templateQuestions.weight,

      optionScore:
        templateQuestionOptions.scoreValue,

      isNotApplicable:
        templateQuestionOptions.isNotApplicable,
    })
    .from(assessmentResponses)
    .innerJoin(
      templateQuestions,
      eq(
        templateQuestions.id,
        assessmentResponses.questionId,
      ),
    )
    .leftJoin(
      templateQuestionOptions,
      eq(
        templateQuestionOptions.id,
        assessmentResponses.selectedOptionId,
      ),
    )
    .where(
      eq(
        assessmentResponses.assessmentId,
        assessmentId,
      ),
    );

  if (responses.length === 0) {
    return;
  }

  // --------------------------------------------------
  // Calculate / Recalculate Question Scores
  // --------------------------------------------------

  for (const response of responses) {
    if (!response.selectedOptionId) {
      continue;
    }

    const isNotApplicable =
      response.isNotApplicable ?? false;

    const questionWeight = Number(
      response.questionWeight ?? 1,
    );

    let rawScore: number | null = null;
    let maximumScore = 0;
    let normalizedScore: number | null = null;
    let weightedScore: number | null = null;

    if (!isNotApplicable) {
      rawScore = Number(
        response.optionScore ?? 0,
      );

      // Current prototype GDHF response scale:
      // No        = 0
      // Partially = 2
      // Yes       = 4
      //
      // N/A is excluded from scoring.

      maximumScore = 4;

      normalizedScore =
        (rawScore / maximumScore) * 100;

      weightedScore =
        normalizedScore * questionWeight;
    }

    const [existingScore] = await db
      .select({
        id: assessmentResponseScores.id,
      })
      .from(assessmentResponseScores)
      .where(
        eq(
          assessmentResponseScores.assessmentResponseId,
          response.responseId,
        ),
      )
      .limit(1);

    const scoreValues = {
      rawScore:
        rawScore?.toString() ?? null,

      maximumScore:
        maximumScore.toString(),

      normalizedScore:
        normalizedScore?.toString() ?? null,

      questionWeight:
        questionWeight.toString(),

      weightedScore:
        weightedScore?.toString() ?? null,

      scoringStatus: isNotApplicable
        ? "excluded"
        : "calculated",

      scoringNotes: isNotApplicable
        ? "Question excluded as Not Applicable."
        : null,

      calculatedAt: new Date(),

      updatedAt: new Date(),
    };

    if (existingScore) {
      await db
        .update(assessmentResponseScores)
        .set(scoreValues)
        .where(
          eq(
            assessmentResponseScores.id,
            existingScore.id,
          ),
        );
    } else {
      await db
        .insert(assessmentResponseScores)
        .values({
          organizationId:
            response.organizationId,

          assessmentId,

          assessmentResponseId:
            response.responseId,

          questionId:
            response.questionId,

          ...scoreValues,
        });
    }
  }

  // --------------------------------------------------
  // Reload Question Scores
  // --------------------------------------------------

  const questionScores = await db
    .select({
      organizationId:
        assessmentResponseScores.organizationId,

      sectionId:
        templateQuestions.sectionId,

      rawScore:
        assessmentResponseScores.rawScore,

      maximumScore:
        assessmentResponseScores.maximumScore,

      normalizedScore:
        assessmentResponseScores.normalizedScore,

      weightedScore:
        assessmentResponseScores.weightedScore,

      questionWeight:
        assessmentResponseScores.questionWeight,
    })
    .from(assessmentResponseScores)
    .innerJoin(
      templateQuestions,
      eq(
        templateQuestions.id,
        assessmentResponseScores.questionId,
      ),
    )
    .where(
      eq(
        assessmentResponseScores.assessmentId,
        assessmentId,
      ),
    );

  // --------------------------------------------------
  // Initialize Every Section
  //
  // Important:
  // We create a section entry even if all of its
  // questions are N/A. This prevents stale section
  // scores from remaining in the database.
  // --------------------------------------------------

  const sectionMap = new Map<
    string,
    {
      organizationId: string;
      rawScoreTotal: number;
      maximumScoreTotal: number;
      weightedScoreTotal: number;
      weightTotal: number;
    }
  >();

  for (const response of responses) {
    if (!sectionMap.has(response.sectionId)) {
      sectionMap.set(
        response.sectionId,
        {
          organizationId:
            response.organizationId,
          rawScoreTotal: 0,
          maximumScoreTotal: 0,
          weightedScoreTotal: 0,
          weightTotal: 0,
        },
      );
    }
  }

  // --------------------------------------------------
  // Aggregate Applicable Question Scores
  // --------------------------------------------------

  for (const score of questionScores) {
    const section = sectionMap.get(
      score.sectionId,
    );

    if (!section) {
      continue;
    }

    const maximumScore = Number(
      score.maximumScore ?? 0,
    );

    // maximumScore = 0 means the question
    // is excluded from scoring (N/A).
    if (maximumScore === 0) {
      continue;
    }

    const rawScore = Number(
      score.rawScore ?? 0,
    );

    const weight = Number(
      score.questionWeight ?? 1,
    );

    const weightedScore = Number(
      score.weightedScore ?? 0,
    );

    section.rawScoreTotal += rawScore;
    section.maximumScoreTotal += maximumScore;

    section.weightedScoreTotal +=
      weightedScore;

    section.weightTotal += weight;
  }

  // --------------------------------------------------
  // Save Section Scores
  // --------------------------------------------------

  for (const [
    sectionId,
    section,
  ] of sectionMap.entries()) {
    const hasApplicableQuestions =
      section.weightTotal > 0 &&
      section.maximumScoreTotal > 0;

    const normalizedScore =
      hasApplicableQuestions
        ? section.weightedScoreTotal /
          section.weightTotal
        : null;

    const [existingSectionScore] = await db
      .select({
        id: assessmentScores.id,
      })
      .from(assessmentScores)
      .where(
        and(
          eq(
            assessmentScores.assessmentId,
            assessmentId,
          ),
          eq(
            assessmentScores.scoreScope,
            "section",
          ),
          eq(
            assessmentScores.sectionId,
            sectionId,
          ),
        ),
      )
      .limit(1);

    const sectionValues = {
      rawScore: hasApplicableQuestions
        ? section.rawScoreTotal.toString()
        : null,

      maximumScore: hasApplicableQuestions
        ? section.maximumScoreTotal.toString()
        : null,

      normalizedScore:
        normalizedScore?.toString() ?? null,

      weightedScore:
        normalizedScore?.toString() ?? null,

      scoringStatus: hasApplicableQuestions
        ? "calculated"
        : "not_applicable",

      scoringNotes: hasApplicableQuestions
        ? null
        : "No applicable scored questions remain in this section.",

      calculatedAt: new Date(),

      updatedAt: new Date(),
    };

    if (existingSectionScore) {
      await db
        .update(assessmentScores)
        .set(sectionValues)
        .where(
          eq(
            assessmentScores.id,
            existingSectionScore.id,
          ),
        );
    } else {
      await db
        .insert(assessmentScores)
        .values({
          organizationId:
            section.organizationId,

          assessmentId,

          sectionId,

          scoreScope: "section",

          ...sectionValues,
        });
    }
  }

  // --------------------------------------------------
  // Calculate Overall Assessment Score
  // --------------------------------------------------

  const sectionValues = Array.from(
    sectionMap.values(),
  );

  const overallRawScore =
    sectionValues.reduce(
      (total, section) =>
        total + section.rawScoreTotal,
      0,
    );

  const overallMaximumScore =
    sectionValues.reduce(
      (total, section) =>
        total + section.maximumScoreTotal,
      0,
    );

  const overallWeightedTotal =
    sectionValues.reduce(
      (total, section) =>
        total +
        section.weightedScoreTotal,
      0,
    );

  const overallWeightTotal =
    sectionValues.reduce(
      (total, section) =>
        total + section.weightTotal,
      0,
    );

  const hasApplicableAssessmentScore =
    overallWeightTotal > 0 &&
    overallMaximumScore > 0;

  const overallNormalizedScore =
    hasApplicableAssessmentScore
      ? overallWeightedTotal /
        overallWeightTotal
      : null;

  const organizationId =
    responses[0].organizationId;

  const [existingOverallScore] = await db
    .select({
      id: assessmentScores.id,
    })
    .from(assessmentScores)
    .where(
      and(
        eq(
          assessmentScores.assessmentId,
          assessmentId,
        ),
        eq(
          assessmentScores.scoreScope,
          "overall",
        ),
        isNull(
          assessmentScores.sectionId,
        ),
      ),
    )
    .limit(1);

  const overallValues = {
    rawScore: hasApplicableAssessmentScore
      ? overallRawScore.toString()
      : null,

    maximumScore:
      hasApplicableAssessmentScore
        ? overallMaximumScore.toString()
        : null,

    normalizedScore:
      overallNormalizedScore?.toString() ??
      null,

    weightedScore:
      overallNormalizedScore?.toString() ??
      null,

    scoringStatus:
      hasApplicableAssessmentScore
        ? "calculated"
        : "not_applicable",

    scoringNotes:
      hasApplicableAssessmentScore
        ? null
        : "No applicable scored questions remain in this assessment.",

    calculatedAt: new Date(),

    updatedAt: new Date(),
  };

  if (existingOverallScore) {
    await db
      .update(assessmentScores)
      .set(overallValues)
      .where(
        eq(
          assessmentScores.id,
          existingOverallScore.id,
        ),
      );
  } else {
    await db
      .insert(assessmentScores)
      .values({
        organizationId,

        assessmentId,

        sectionId: null,

        scoreScope: "overall",

        ...overallValues,
      });
  }
}
