import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma 7 singleton — prevents hot-reload connection exhaustion in dev.
 * Uses official @prisma/adapter-pg PostgreSQL driver adapter.
 *
 * Optimized for Vercel serverless:
 * - Small connection pool (max 3) to avoid exhausting Supabase limits
 * - Short idle timeout so connections are released quickly between invocations
 * - Connection timeout to fail fast on cold starts rather than hanging
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const isProduction = process.env.NODE_ENV === "production";

const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString: `${process.env.DATABASE_URL}`,
    // Serverless-optimized pool settings
    max: isProduction ? 3 : 10,               // Small pool for serverless, larger for dev
    idleTimeoutMillis: isProduction ? 10_000 : 30_000, // Release idle connections quickly
    connectionTimeoutMillis: 5_000,            // Fail fast on cold starts
  });

if (!isProduction) globalForPrisma.pool = pool;

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: isProduction ? ["error"] : ["query", "error", "warn"],
  });

if (!isProduction) globalForPrisma.prisma = prisma;
