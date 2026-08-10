import { and, eq } from "drizzle-orm";

import { db } from "./client";
import {
  assessmentMethodologies,
  assessmentTemplates,
  assessmentTemplateVersions,
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
  // Complete
  // ==================================================

  console.log("----------------------------------------");
  console.log("GDHF seed validation configuration ready.");
  console.log("----------------------------------------");
  console.log("GeoVaris");
  console.log("└── GDHF");
  console.log("    └── Data Health Assessment Methodology");
  console.log("        └── Small Business Data Health Assessment");
  console.log("            └── Version 1.0");
  console.log("                └── Data Governance");
  console.log("                    └── GOV-001");
  console.log("                        ├── No");
  console.log("                        ├── Partially");
  console.log("                        ├── Yes");
  console.log("                        └── Not Applicable");
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