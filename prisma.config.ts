import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 configuration file — connection URLs and migration settings.
 * Required since Prisma 7 removed url/directUrl from schema.prisma datasource block.
 *
 * NOTE: For CLI operations (db push, migrate), we use DIRECT_URL (port 5432)
 * to avoid Supabase PgBouncer (port 6543) transaction-mode advisory lock hangs.
 */
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),

  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL!,
  },

  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
