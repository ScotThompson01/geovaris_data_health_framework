import postgres from "postgres";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

function getMigrationUrl(): string {
  const migrationUrl =
    process.env.DATABASE_URL_UNPOOLED ??
    process.env.DATABASE_URL;

  if (!migrationUrl) {
    throw new Error(
      "DATABASE_URL_UNPOOLED or DATABASE_URL is not configured.",
    );
  }

  return migrationUrl;
}

async function runMigrations() {
  console.log("Starting database migrations...");

  const migrationUrl =
    getMigrationUrl();

  const migrationClient = postgres(
    migrationUrl,
    {
      max: 1,
    },
  );

  const db = drizzle(migrationClient);

  try {
    await migrate(db, {
      migrationsFolder: "./drizzle",
    });

    console.log("Database migrations completed successfully.");
  } finally {
    await migrationClient.end();
  }
}

runMigrations().catch((error) => {
  console.error("Database migration failed:");
  console.error(error);
  process.exit(1);
});
