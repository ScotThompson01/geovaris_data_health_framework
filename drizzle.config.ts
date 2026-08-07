import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: ".env.local" });

const migrationUrl =
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.DATABASE_URL;

if (!migrationUrl) {
  throw new Error(
    "DATABASE_URL_UNPOOLED or DATABASE_URL is not defined in .env.local",
  );
}

export default defineConfig({
  dialect: "postgresql",

  schema: "./src/db/schema/index.ts",

  out: "./drizzle",

  dbCredentials: {
    url: migrationUrl,
  },

  strict: true,
  verbose: true,
});