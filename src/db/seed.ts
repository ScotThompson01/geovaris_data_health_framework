import { and, eq, isNull } from "drizzle-orm";

import { db } from "./client";
import {
  assessmentMethodologies,
  assessmentResponseScores,
  assessmentResponses,
  assessments,
  assessmentScores,
  assessmentTemplates,
  assessmentTemplateVersions,
  clients,
  frameworks,
  organizations,
  templateQuestionOptions,
  templateQuestions,
  templateSections,
} from "./schema";

async function seed() {
  console.log("Starting GeoVaris database seed...");

  // ==================================================
  // 1. GeoVaris Organization
  // ==================================================

  let [geovaris] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.name, "GeoVaris"))
    .limit(1);

  if (!geovaris) {
    [geovaris] = await db
      .insert(organizations)
      .values({
        name: "GeoVaris",
        legalName: "GeoVaris LLC",
        organizationType: "consulting",
        status: "active",
      })
      .returning();

    console.log("Created organization: GeoVaris");
  } else {
    console.log("Organization already exists: GeoVaris");
  }

  // ==================================================
  // 2. GeoVaris Data Health Framework
  // ==================================================

  let [gdhf] = await db
    .select()
    .from(frameworks)
    .where(
      and(
        eq(frameworks.organizationId, geovaris.id),
        eq(frameworks.code, "GDHF"),
      ),
    )
    .limit(1);

  if (!gdhf) {
    [gdhf] = await db
      .insert(frameworks)
      .values({
        organizationId: geovaris.id,
        name: "GeoVaris Data Health Framework™",
        code: "GDHF",
        description:
          "A configurable framework for assessing data governance, data quality, architecture, analytics, AI readiness, and operational data maturity.",
        status: "active",
      })
      .returning();

    console.log(
      "Created framework: GeoVaris Data Health Framework™",
    );
  } else {
    console.log(
      "Framework already exists: GeoVaris Data Health Framework™",
    );
  }

  // ==================================================
  // 3. Data Health Assessment Methodology
  // ==================================================

  let [methodology] = await db
    .select()
    .from(assessmentMethodologies)
    .where(
      and(
        eq(assessmentMethodologies.frameworkId, gdhf.id),
        eq(assessmentMethodologies.code, "DATA-HEALTH"),
      ),
    )
    .limit(1);

  if (!methodology) {
    [methodology] = await db
      .insert(assessmentMethodologies)
      .values({
        organizationId: geovaris.id,
        frameworkId: gdhf.id,
        name: "Data Health Assessment Methodology",
        code: "DATA-HEALTH",
        description:
          "GeoVaris methodology for evaluating organizational data health and maturity.",
        methodologyType: "data_health",
        status: "active",
      })
      .returning();

    console.log(
      "Created methodology: Data Health Assessment Methodology",
    );
  } else {
    console.log(
      "Methodology already exists: Data Health Assessment Methodology",
    );
  }

  // ==================================================
  // 4. Small Business Data Health Assessment Template
  // ==================================================

  let [template] = await db
    .select()
    .from(assessmentTemplates)
    .where(
      and(
        eq(assessmentTemplates.methodologyId, methodology.id),
        eq(
          assessmentTemplates.name,
          "Small Business Data Health Assessment",
        ),
      ),
    )
    .limit(1);

  if (!template) {
    [template] = await db
      .insert(assessmentTemplates)
      .values({
        organizationId: geovaris.id,
        methodologyId: methodology.id,
        name: "Small Business Data Health Assessment",
        description:
          "Initial GDHF assessment template designed for small and medium-sized organizations.",
        templateScope: "master",
        status: "active",
      })
      .returning();

    console.log(
      "Created template: Small Business Data Health Assessment",
    );
  } else {
    console.log(
      "Template already exists: Small Business Data Health Assessment",
    );
  }

  // ==================================================
  // 5. Template Version 1.0
  // ==================================================

  let [templateVersion] = await db
    .select()
    .from(assessmentTemplateVersions)
    .where(
      and(
        eq(assessmentTemplateVersions.templateId, template.id),
        eq(assessmentTemplateVersions.versionNumber, 1),
      ),
    )
    .limit(1);

  if (!templateVersion) {
    [templateVersion] = await db
      .insert(assessmentTemplateVersions)
      .values({
        organizationId: geovaris.id,
        templateId: template.id,
        versionNumber: 1,
        versionLabel: "1.0",
        status: "published",
        changeSummary: "Initial GDHF prototype assessment version.",
        publishedAt: new Date(),
      })
      .returning();

    console.log("Created template version: 1.0");
  } else {
    console.log("Template version already exists: 1.0");
  }

  // ==================================================
  // 6. Data Governance Section
  // ==================================================

  let [governanceSection] = await db
    .select()
    .from(templateSections)
    .where(
      and(
        eq(
          templateSections.templateVersionId,
          templateVersion.id,
        ),
        eq(templateSections.code, "GOV"),
      ),
    )
    .limit(1);

  if (!governanceSection) {
    [governanceSection] = await db
      .insert(templateSections)
      .values({
        organizationId: geovaris.id,
        templateVersionId: templateVersion.id,
        name: "Data Governance",
        code: "GOV",
        description:
          "Evaluates organizational ownership, stewardship, policies, standards, and accountability for data.",
        displayOrder: 1,
        isRequired: true,
        status: "active",
      })
      .returning();

    console.log("Created section: Data Governance");
  } else {
    console.log("Section already exists: Data Governance");
  }

  // ==================================================
  // 7. GOV-001 Question
  // ==================================================

  let [governanceQuestion] = await db
    .select()
    .from(templateQuestions)
    .where(
      and(
        eq(
          templateQuestions.templateVersionId,
          templateVersion.id,
        ),
        eq(templateQuestions.questionCode, "GOV-001"),
      ),
    )
    .limit(1);

  if (!governanceQuestion) {
    [governanceQuestion] = await db
      .insert(templateQuestions)
      .values({
        organizationId: geovaris.id,
        templateVersionId: templateVersion.id,
        sectionId: governanceSection.id,
        questionCode: "GOV-001",
        questionText:
          "Does the organization have clearly defined ownership for important data?",
        guidanceText:
          "Consider whether critical datasets have identified business owners who are accountable for data definition, quality, access, and appropriate use.",
        answerType: "single_select",
        displayOrder: 1,
        isRequired: true,
        allowsNotApplicable: true,
        requiresComment: false,
        requiresEvidence: false,
        status: "active",
      })
      .returning();

    console.log("Created question: GOV-001");
  } else {
    console.log("Question already exists: GOV-001");
  }

  // ==================================================
  // 8. GOV-001 Answer Options
  // ==================================================

  const answerOptions = [
    {
      optionCode: "NO",
      optionLabel: "No",
      optionDescription:
        "Important data does not have clearly identified ownership.",
      optionValue: "no",
      scoreValue: "0",
      displayOrder: 1,
      isNotApplicable: false,
    },
    {
      optionCode: "PARTIAL",
      optionLabel: "Partially",
      optionDescription:
        "Ownership exists informally or only for some important data.",
      optionValue: "partial",
      scoreValue: "2",
      displayOrder: 2,
      isNotApplicable: false,
    },
    {
      optionCode: "YES",
      optionLabel: "Yes",
      optionDescription:
        "Important data has clearly identified and documented ownership.",
      optionValue: "yes",
      scoreValue: "4",
      displayOrder: 3,
      isNotApplicable: false,
    },
    {
      optionCode: "NA",
      optionLabel: "Not Applicable",
      optionDescription:
        "The question does not apply to the assessment scope.",
      optionValue: "not_applicable",
      scoreValue: null,
      displayOrder: 4,
      isNotApplicable: true,
    },
  ];

  for (const option of answerOptions) {
    const [existingOption] = await db
      .select()
      .from(templateQuestionOptions)
      .where(
        and(
          eq(
            templateQuestionOptions.questionId,
            governanceQuestion.id,
          ),
          eq(
            templateQuestionOptions.optionCode,
            option.optionCode,
          ),
        ),
      )
      .limit(1);

    if (!existingOption) {
      await db.insert(templateQuestionOptions).values({
        organizationId: geovaris.id,
        questionId: governanceQuestion.id,
        optionCode: option.optionCode,
        optionLabel: option.optionLabel,
        optionDescription: option.optionDescription,
        optionValue: option.optionValue,
        scoreValue: option.scoreValue,
        displayOrder: option.displayOrder,
        isNotApplicable: option.isNotApplicable,
        requiresComment: false,
        requiresEvidence: false,
        status: "active",
      });

      console.log(
        `Created GOV-001 option: ${option.optionLabel}`,
      );
    } else {
      console.log(
        `GOV-001 option already exists: ${option.optionLabel}`,
      );
    }
  }

  // ==================================================
  // 9. GeoVaris Demo Client
  // ==================================================

  let [demoClient] = await db
    .select()
    .from(clients)
    .where(
      and(
        eq(clients.organizationId, geovaris.id),
        eq(clients.name, "GeoVaris Demo Client"),
      ),
    )
    .limit(1);

  if (!demoClient) {
    [demoClient] = await db
      .insert(clients)
      .values({
        organizationId: geovaris.id,
        name: "GeoVaris Demo Client",
        legalName: "GeoVaris Demo Client",
        industry: "Demonstration",
        status: "active",
        description:
          "Internal demonstration client used to validate the GeoVaris Assessment Platform.",
      })
      .returning();

    console.log("Created client: GeoVaris Demo Client");
  } else {
    console.log("Client already exists: GeoVaris Demo Client");
  }

  // ==================================================
  // 10. GDHF Demo Assessment
  // ==================================================

  let [demoAssessment] = await db
    .select()
    .from(assessments)
    .where(
      and(
        eq(assessments.organizationId, geovaris.id),
        eq(assessments.assessmentCode, "GDHF-DEMO-001"),
      ),
    )
    .limit(1);

  if (!demoAssessment) {
    [demoAssessment] = await db
      .insert(assessments)
      .values({
        organizationId: geovaris.id,
        clientId: demoClient.id,
        frameworkId: gdhf.id,
        methodologyId: methodology.id,
        templateId: template.id,
        templateVersionId: templateVersion.id,
        assessmentCode: "GDHF-DEMO-001",
        name: "GeoVaris Demo Data Health Assessment",
        description:
          "Prototype assessment used to validate the GDHF execution and scoring workflow.",
        status: "in_progress",
      })
      .returning();

    console.log("Created assessment: GDHF-DEMO-001");
  } else {
    console.log("Assessment already exists: GDHF-DEMO-001");
  }

  // ==================================================
  // 11. Find GOV-001 YES Option
  // ==================================================

  const [yesOption] = await db
    .select()
    .from(templateQuestionOptions)
    .where(
      and(
        eq(
          templateQuestionOptions.questionId,
          governanceQuestion.id,
        ),
        eq(templateQuestionOptions.optionCode, "YES"),
      ),
    )
    .limit(1);

  if (!yesOption) {
    throw new Error(
      "GOV-001 YES option was not found. Run configuration seed first.",
    );
  }

  // ==================================================
  // 12. GOV-001 Assessment Response
  // ==================================================

  let [demoResponse] = await db
    .select()
    .from(assessmentResponses)
    .where(
      and(
        eq(
          assessmentResponses.assessmentId,
          demoAssessment.id,
        ),
        eq(
          assessmentResponses.questionId,
          governanceQuestion.id,
        ),
      ),
    )
    .limit(1);

  if (!demoResponse) {
    [demoResponse] = await db
      .insert(assessmentResponses)
      .values({
        organizationId: geovaris.id,
        assessmentId: demoAssessment.id,
        questionId: governanceQuestion.id,
        selectedOptionId: yesOption.id,
        respondentComment:
          "The organization has documented ownership for important data.",
        status: "submitted",
        submittedAt: new Date(),
      })
      .returning();

    console.log("Created response: GOV-001 = YES");
  } else {
    console.log("Response already exists: GOV-001");
  }

  // ==================================================
  // 13. GOV-001 Response Score
  // ==================================================

  let [responseScore] = await db
    .select()
    .from(assessmentResponseScores)
    .where(
      eq(
        assessmentResponseScores.assessmentResponseId,
        demoResponse.id,
      ),
    )
    .limit(1);

  if (!responseScore) {
    [responseScore] = await db
      .insert(assessmentResponseScores)
      .values({
        organizationId: geovaris.id,
        assessmentId: demoAssessment.id,
        assessmentResponseId: demoResponse.id,
        questionId: governanceQuestion.id,
        rawScore: "4",
        maximumScore: "4",
        normalizedScore: "100",
        questionWeight: "1",
        weightedScore: "4",
        scoringStatus: "calculated",
        scoringNotes:
          "Prototype score calculated from GOV-001 YES response.",
        calculatedAt: new Date(),
      })
      .returning();

    console.log("Created response score: GOV-001 = 100%");
  } else {
    console.log("Response score already exists: GOV-001");
  }

  // ==================================================
  // 14. Data Governance Section Score
  // ==================================================

  let [sectionScore] = await db
    .select()
    .from(assessmentScores)
    .where(
      and(
        eq(
          assessmentScores.assessmentId,
          demoAssessment.id,
        ),
        eq(assessmentScores.scoreScope, "section"),
        eq(
          assessmentScores.sectionId,
          governanceSection.id,
        ),
      ),
    )
    .limit(1);

  if (!sectionScore) {
    [sectionScore] = await db
      .insert(assessmentScores)
      .values({
        organizationId: geovaris.id,
        assessmentId: demoAssessment.id,
        sectionId: governanceSection.id,
        scoreScope: "section",
        rawScore: "4",
        maximumScore: "4",
        normalizedScore: "100",
        weightedScore: "4",
        scoringStatus: "calculated",
        scoringNotes:
          "Prototype Data Governance section score.",
        calculatedAt: new Date(),
      })
      .returning();

    console.log("Created section score: Data Governance = 100%");
  } else {
    console.log(
      "Section score already exists: Data Governance",
    );
  }

  // ==================================================
  // 15. Overall Assessment Score
  // ==================================================

  let [overallScore] = await db
    .select()
    .from(assessmentScores)
    .where(
      and(
        eq(
          assessmentScores.assessmentId,
          demoAssessment.id,
        ),
        eq(assessmentScores.scoreScope, "overall"),
        isNull(assessmentScores.sectionId),
      ),
    )
    .limit(1);

  if (!overallScore) {
    [overallScore] = await db
      .insert(assessmentScores)
      .values({
        organizationId: geovaris.id,
        assessmentId: demoAssessment.id,
        sectionId: null,
        scoreScope: "overall",
        rawScore: "4",
        maximumScore: "4",
        normalizedScore: "100",
        weightedScore: "4",
        scoringStatus: "calculated",
        scoringNotes:
          "Prototype overall GDHF assessment score.",
        calculatedAt: new Date(),
      })
      .returning();

    console.log("Created overall assessment score: 100%");
  } else {
    console.log("Overall assessment score already exists");
  }
  
  // ==================================================
  // Complete
  // ==================================================

  console.log("----------------------------------------");
  console.log("GDHF end-to-end validation complete.");
  console.log("----------------------------------------");
  console.log("GeoVaris");
  console.log("├── GDHF Configuration");
  console.log("│   └── GOV-001");
  console.log("│       └── YES = 4 points");
  console.log("│");
  console.log("└── GeoVaris Demo Client");
  console.log("    └── GDHF-DEMO-001");
  console.log("        └── GOV-001 Response: YES");
  console.log("            └── Response Score: 100%");
  console.log("                └── Section Score: 100%");
  console.log("                    └── Overall Score: 100%");
  console.log("----------------------------------------");

  console.log("Database seed complete.");
}

seed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Database seed failed:");
    console.error(error);
    process.exit(1);
  });