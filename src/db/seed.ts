import { and, eq } from "drizzle-orm";

import { db } from "./client";
import { recalculateAssessmentScores } from "./services/assessment-scoring-service";

import {
  answerOptionSetItems,
  answerOptionSets,
  assessmentMethodologies,
  assessmentResponses,
  assessments,
  assessmentTemplates,
  assessmentTemplateVersions,
  clients,
  frameworks,
  organizations,
  templateQuestionOptions,
  templateQuestions,
  templateSections,
} from "./schema";

// ==================================================
// GDHF Prototype Assessment Definition
// ==================================================

const assessmentDefinition = [
  {
    code: "GOV",
    name: "Data Governance",
    description:
      "Evaluates ownership, stewardship, policies, standards, and accountability for organizational data.",
    displayOrder: 1,
    questions: [
      {
        code: "GOV-001",
        text:
          "Does the organization have clearly defined ownership for important data?",
        guidance:
          "Consider whether critical datasets have identified business owners who are accountable for data definition, quality, access, and appropriate use.",
        displayOrder: 1,
      },
      {
        code: "GOV-002",
        text:
          "Are data stewardship responsibilities clearly defined and understood?",
        guidance:
          "Consider whether individuals responsible for day-to-day data quality, definitions, and issue resolution have been identified.",
        displayOrder: 2,
      },
      {
        code: "GOV-003",
        text:
          "Does the organization maintain documented data policies and standards?",
        guidance:
          "Consider whether standards exist for data naming, ownership, quality, access, retention, and acceptable use.",
        displayOrder: 3,
      },
    ],
  },

  {
    code: "DQ",
    name: "Data Quality",
    description:
      "Evaluates the controls, monitoring, and processes used to maintain trusted and reliable data.",
    displayOrder: 2,
    questions: [
      {
        code: "DQ-001",
        text:
          "Are important datasets subject to defined data-quality checks?",
        guidance:
          "Consider completeness, validity, consistency, accuracy, uniqueness, and timeliness controls.",
        displayOrder: 1,
      },
      {
        code: "DQ-002",
        text:
          "Are recurring data-quality issues tracked to their source and corrected?",
        guidance:
          "Consider whether recurring errors are documented, assigned, root-caused, and permanently remediated.",
        displayOrder: 2,
      },
      {
        code: "DQ-003",
        text:
          "Is the completeness of critical business data regularly measured?",
        guidance:
          "Consider whether required fields, records, and business-critical attributes are monitored for missing or incomplete values.",
        displayOrder: 3,
      },
    ],
  },

  {
    code: "AN",
    name: "Analytics & Reporting",
    description:
      "Evaluates the consistency, reliability, and automation of reporting and analytics processes.",
    displayOrder: 3,
    questions: [
      {
        code: "AN-001",
        text:
          "Do executive reports use consistently defined business metrics?",
        guidance:
          "Consider whether important KPIs have common definitions and produce consistent results across departments and reporting tools.",
        displayOrder: 1,
      },
      {
        code: "AN-002",
        text:
          "Are important reports built from trusted and governed data sources?",
        guidance:
          "Consider whether report data sources are documented, approved, understood, and monitored for quality.",
        displayOrder: 2,
      },
      {
        code: "AN-003",
        text:
          "Are recurring reporting and analytics processes substantially automated?",
        guidance:
          "Consider whether manual extraction, spreadsheet manipulation, reconciliation, and report preparation have been reduced through repeatable workflows.",
        displayOrder: 3,
      },
    ],
  },

  {
    code: "AI",
    name: "AI Readiness",
    description:
      "Evaluates whether organizational data is sufficiently governed, documented, accessible, and trusted to support responsible AI adoption.",
    displayOrder: 4,
    questions: [
      {
        code: "AI-001",
        text:
          "Does the organization have trusted and governed data suitable for AI use cases?",
        guidance:
          "Consider whether candidate AI datasets have known ownership, quality, lineage, access controls, and appropriate usage rights.",
        displayOrder: 1,
      },
      {
        code: "AI-002",
        text:
          "Is important data sufficiently documented for analytics and AI teams to understand and use correctly?",
        guidance:
          "Consider whether business definitions, metadata, lineage, context, and known limitations are available.",
        displayOrder: 2,
      },
      {
        code: "AI-003",
        text:
          "Are access controls and data-use rules defined for sensitive data used in analytics or AI?",
        guidance:
          "Consider privacy, security, authorized use, data classification, and restrictions on sensitive information.",
        displayOrder: 3,
      },
    ],
  },
];

const standardAnswerOptions = [
  {
    optionCode: "NO",
    optionLabel: "No",
    optionDescription:
      "The capability is not currently established or consistently practiced.",
    optionValue: "no",
    scoreValue: "0",
    displayOrder: 1,
    isNotApplicable: false,
  },
  {
    optionCode: "PARTIAL",
    optionLabel: "Partially",
    optionDescription:
      "The capability exists in some areas or is implemented inconsistently.",
    optionValue: "partial",
    scoreValue: "2",
    displayOrder: 2,
    isNotApplicable: false,
  },
  {
    optionCode: "YES",
    optionLabel: "Yes",
    optionDescription:
      "The capability is clearly established and consistently practiced.",
    optionValue: "yes",
    scoreValue: "4",
    displayOrder: 3,
    isNotApplicable: false,
  },
  {
    optionCode: "NA",
    optionLabel: "Not Applicable",
    optionDescription:
      "The question does not apply to the current assessment scope.",
    optionValue: "not_applicable",
    scoreValue: null,
    displayOrder: 4,
    isNotApplicable: true,
  },
];

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
  // GDHF Standard Answer Option Set
  // ==================================================

  let [standardAnswerSet] = await db
    .select()
    .from(answerOptionSets)
    .where(
      and(
        eq(
          answerOptionSets.organizationId,
          geovaris.id,
        ),
        eq(
          answerOptionSets.code,
          "GDHF-STANDARD-024-NA",
        ),
      ),
    )
    .limit(1);

  if (!standardAnswerSet) {
    [standardAnswerSet] = await db
      .insert(answerOptionSets)
      .values({
        organizationId:
          geovaris.id,

        name:
          "GDHF Standard 0-2-4 + N/A",

        code:
          "GDHF-STANDARD-024-NA",

        description:
          "Standard GDHF answer scale using No, Partially, Yes, and Not Applicable.",

        status:
          "active",
      })
      .returning();

    console.log(
      "Created answer option set: GDHF Standard 0-2-4 + N/A",
    );
  } else {
    console.log(
      "Answer option set already exists: GDHF Standard 0-2-4 + N/A",
    );
  }

  // ==================================================
  // GDHF Standard Answer Option Set Items
  // ==================================================

  for (const option of standardAnswerOptions) {
    const [existingSetItem] = await db
      .select()
      .from(answerOptionSetItems)
      .where(
        and(
          eq(
            answerOptionSetItems.answerOptionSetId,
            standardAnswerSet.id,
          ),
          eq(
            answerOptionSetItems.optionCode,
            option.optionCode,
          ),
        ),
      )
      .limit(1);

    if (!existingSetItem) {
      await db
        .insert(answerOptionSetItems)
        .values({
          answerOptionSetId:
            standardAnswerSet.id,

          optionCode:
            option.optionCode,

          optionLabel:
            option.optionLabel,

          optionDescription:
            option.optionDescription,

          optionValue:
            option.optionValue,

          scoreValue:
            option.scoreValue,

          displayOrder:
            option.displayOrder,

          isNotApplicable:
            option.isNotApplicable,

          requiresComment:
            false,

          requiresEvidence:
            false,

          status:
            "active",
        });

      console.log(
        `Created answer set item: ${option.optionLabel}`,
      );
    } else {
      console.log(
        `Answer set item already exists: ${option.optionLabel}`,
      );
    }
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
        eq(
          assessmentMethodologies.code,
          "DATA-HEALTH",
        ),
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
        eq(
          assessmentTemplates.methodologyId,
          methodology.id,
        ),
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
        eq(
          assessmentTemplateVersions.templateId,
          template.id,
        ),
        eq(
          assessmentTemplateVersions.versionNumber,
          1,
        ),
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
        changeSummary:
          "Initial GDHF prototype assessment version.",
        publishedAt: new Date(),
      })
      .returning();

    console.log("Created template version: 1.0");
  } else {
    console.log(
      "Template version already exists: 1.0",
    );
  }

  // ==================================================
  // 6. Seed Assessment Sections, Questions, and Options
  // ==================================================

  let governanceQuestion:
    | typeof templateQuestions.$inferSelect
    | undefined;

  for (const sectionDefinition of assessmentDefinition) {
    let [section] = await db
      .select()
      .from(templateSections)
      .where(
        and(
          eq(
            templateSections.templateVersionId,
            templateVersion.id,
          ),
          eq(
            templateSections.code,
            sectionDefinition.code,
          ),
        ),
      )
      .limit(1);

    if (!section) {
      [section] = await db
        .insert(templateSections)
        .values({
          organizationId: geovaris.id,
          templateVersionId: templateVersion.id,
          name: sectionDefinition.name,
          code: sectionDefinition.code,
          description:
            sectionDefinition.description,
          displayOrder:
            sectionDefinition.displayOrder,
          isRequired: true,
          status: "active",
        })
        .returning();

      console.log(
        `Created section: ${sectionDefinition.name}`,
      );
    } else {
      console.log(
        `Section already exists: ${sectionDefinition.name}`,
      );
    }

    for (const questionDefinition of sectionDefinition.questions) {
      let [question] = await db
        .select()
        .from(templateQuestions)
        .where(
          and(
            eq(
              templateQuestions.templateVersionId,
              templateVersion.id,
            ),
            eq(
              templateQuestions.questionCode,
              questionDefinition.code,
            ),
          ),
        )
        .limit(1);

      if (!question) {
        [question] = await db
          .insert(templateQuestions)
          .values({
            organizationId: geovaris.id,
            templateVersionId:
              templateVersion.id,
            sectionId: section.id,
            questionCode:
              questionDefinition.code,
            questionText:
              questionDefinition.text,
            guidanceText:
              questionDefinition.guidance,
            answerType: "single_select",
            displayOrder:
              questionDefinition.displayOrder,
            weight: "1",
            isRequired: true,
            allowsNotApplicable: true,
            requiresComment: false,
            requiresEvidence: false,
            status: "active",
          })
          .returning();

        console.log(
          `Created question: ${questionDefinition.code}`,
        );
      } else {
        console.log(
          `Question already exists: ${questionDefinition.code}`,
        );
      }

      if (
        questionDefinition.code === "GOV-001"
      ) {
        governanceQuestion = question;
      }

      for (const option of standardAnswerOptions) {
        const [existingOption] = await db
          .select()
          .from(templateQuestionOptions)
          .where(
            and(
              eq(
                templateQuestionOptions.questionId,
                question.id,
              ),
              eq(
                templateQuestionOptions.optionCode,
                option.optionCode,
              ),
            ),
          )
          .limit(1);

        if (!existingOption) {
          await db
            .insert(templateQuestionOptions)
            .values({
              organizationId: geovaris.id,
              questionId: question.id,
              optionCode: option.optionCode,
              optionLabel: option.optionLabel,
              optionDescription:
                option.optionDescription,
              optionValue: option.optionValue,
              scoreValue: option.scoreValue,
              displayOrder:
                option.displayOrder,
              isNotApplicable:
                option.isNotApplicable,
              requiresComment: false,
              requiresEvidence: false,
              status: "active",
            });

          console.log(
            `Created ${questionDefinition.code} option: ${option.optionLabel}`,
          );
        }
      }
    }
  }

  if (!governanceQuestion) {
    throw new Error(
      "GOV-001 was not found after assessment configuration seed.",
    );
  }

  // ==================================================
  // 7. GeoVaris Demo Client
  // ==================================================

  let [demoClient] = await db
    .select()
    .from(clients)
    .where(
      and(
        eq(
          clients.organizationId,
          geovaris.id,
        ),
        eq(
          clients.name,
          "GeoVaris Demo Client",
        ),
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

    console.log(
      "Created client: GeoVaris Demo Client",
    );
  } else {
    console.log(
      "Client already exists: GeoVaris Demo Client",
    );
  }

  // ==================================================
  // 8. GDHF Demo Assessment
  // ==================================================

  let [demoAssessment] = await db
    .select()
    .from(assessments)
    .where(
      and(
        eq(
          assessments.organizationId,
          geovaris.id,
        ),
        eq(
          assessments.assessmentCode,
          "GDHF-DEMO-001",
        ),
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
        templateVersionId:
          templateVersion.id,
        assessmentCode:
          "GDHF-DEMO-001",
        name:
          "GeoVaris Demo Data Health Assessment",
        description:
          "Prototype assessment used to validate the GDHF execution and scoring workflow.",
        status: "in_progress",
      })
      .returning();

    console.log(
      "Created assessment: GDHF-DEMO-001",
    );
  } else {
    console.log(
      "Assessment already exists: GDHF-DEMO-001",
    );
  }

  // ==================================================
  // 9. Preserve / Create GOV-001 Demo Response
  //
  // Only GOV-001 is seeded with a response.
  // The other 11 questions intentionally remain
  // unanswered so progress tracking can be validated.
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
    const [yesOption] = await db
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
            "YES",
          ),
        ),
      )
      .limit(1);

    if (!yesOption) {
      throw new Error(
        "GOV-001 YES option was not found.",
      );
    }

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

    console.log(
      "Created demo response: GOV-001 = YES",
    );
  } else {
    console.log(
      "Existing GOV-001 response preserved.",
    );
  }

  // ==================================================
  // 10. Recalculate Scores
  //
  // Scoring logic belongs to the scoring service.
  // seed.ts does not manually calculate scores.
  // ==================================================

  await recalculateAssessmentScores(
    demoAssessment.id,
  );

  console.log(
    "Assessment scores recalculated.",
  );

  // ==================================================
  // Complete
  // ==================================================

  console.log("----------------------------------------");
  console.log("GDHF expanded demo assessment ready.");
  console.log("----------------------------------------");

  console.log("Sections: 4");
  console.log("Questions: 12");
  console.log("Seeded responses: 1");
  console.log("Unanswered questions: 11");

  console.log("----------------------------------------");

  console.log("Data Governance");
  console.log("  GOV-001");
  console.log("  GOV-002");
  console.log("  GOV-003");

  console.log("Data Quality");
  console.log("  DQ-001");
  console.log("  DQ-002");
  console.log("  DQ-003");

  console.log("Analytics & Reporting");
  console.log("  AN-001");
  console.log("  AN-002");
  console.log("  AN-003");

  console.log("AI Readiness");
  console.log("  AI-001");
  console.log("  AI-002");
  console.log("  AI-003");

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