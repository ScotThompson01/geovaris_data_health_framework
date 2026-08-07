

import { eq } from "drizzle-orm";

import { db } from "./client";
import { frameworks, organizations } from "./schema";

async function seed() {
  console.log("Starting GeoVaris database seed...");

  // --------------------------------------------------
  // GeoVaris Organization
  // --------------------------------------------------

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

  // --------------------------------------------------
  // GeoVaris Data Health Framework
  // --------------------------------------------------

  const [existingFramework] = await db
    .select()
    .from(frameworks)
    .where(eq(frameworks.code, "GDHF"))
    .limit(1);

  if (!existingFramework) {
    await db.insert(frameworks).values({
      organizationId: geovaris.id,
      name: "GeoVaris Data Health Framework™",
      code: "GDHF",
      description:
        "A configurable framework for assessing data governance, data quality, architecture, analytics, AI readiness, and operational data maturity.",
      status: "draft",
    });

    console.log(
      "Created framework: GeoVaris Data Health Framework™",
    );
  } else {
    console.log(
      "Framework already exists: GeoVaris Data Health Framework™",
    );
  }

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