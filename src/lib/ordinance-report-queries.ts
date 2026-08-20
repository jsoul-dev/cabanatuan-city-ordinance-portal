import { prisma } from "@/lib/prisma";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ReportFilters {
  year?: number;
  dateFrom?: string;
  dateTo?: string;
  type?: string;
  status?: string;
  category?: string;
  barangayId?: string;
  submittedById?: string;
}

export interface OrdinanceReportRow {
  id: string;
  resolutionNumber: string;
  ordinanceLabel: string | null;
  title: string;
  type: string;
  status: string;
  category: string | null;
  dateEnacted: Date | null;
  year: number | null;
  coverage: string | null;
  createdAt: Date;
  barangay: { id: string; name: string } | null;
  submittedBy: { id: string; name: string };
}

// ─── Main Report Query ──────────────────────────────────────────────────────

export async function getOrdinancesForReports(
  filters?: ReportFilters,
  scopedBarangayId?: string,
): Promise<OrdinanceReportRow[]> {
  const where: Record<string, unknown> = {};

  // Barangay-scoped access (for Barangay Admins)
  if (scopedBarangayId) {
    where.barangayId = scopedBarangayId;
  }

  // Filters
  if (filters?.year) {
    where.year = filters.year;
  }

  if (filters?.type && filters.type !== "ALL") {
    where.type = filters.type;
  }

  if (filters?.status && filters.status !== "ALL") {
    where.status = filters.status;
  }

  if (filters?.category && filters.category !== "ALL") {
    where.category = filters.category;
  }

  if (filters?.barangayId && filters.barangayId !== "ALL") {
    where.barangayId = filters.barangayId;
  }

  if (filters?.submittedById && filters.submittedById !== "ALL") {
    where.submittedById = filters.submittedById;
  }

  // Date range filter — use dateEnacted, fallback to createdAt
  if (filters?.dateFrom || filters?.dateTo) {
    const dateConditions: Record<string, unknown>[] = [];

    const fromDate = filters?.dateFrom ? new Date(filters.dateFrom) : undefined;
    const toDate = filters?.dateTo
      ? new Date(filters.dateTo + "T23:59:59.999Z")
      : undefined;

    // Match ordinances where dateEnacted is in range OR (dateEnacted is null AND createdAt is in range)
    const enactedCondition: Record<string, unknown> = { dateEnacted: { not: null } };
    const createdCondition: Record<string, unknown> = { dateEnacted: null };

    if (fromDate) {
      (enactedCondition.dateEnacted as Record<string, unknown>).gte = fromDate;
      createdCondition.createdAt = { ...((createdCondition.createdAt as Record<string, unknown>) ?? {}), gte: fromDate };
    }
    if (toDate) {
      (enactedCondition.dateEnacted as Record<string, unknown>).lte = toDate;
      createdCondition.createdAt = { ...((createdCondition.createdAt as Record<string, unknown>) ?? {}), lte: toDate };
    }

    dateConditions.push(enactedCondition, createdCondition);
    where.OR = dateConditions;
  }

  return prisma.ordinance.findMany({
    where,
    orderBy: [{ dateEnacted: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      resolutionNumber: true,
      ordinanceLabel: true,
      title: true,
      type: true,
      status: true,
      category: true,
      dateEnacted: true,
      year: true,
      coverage: true,
      createdAt: true,
      barangay: { select: { id: true, name: true } },
      submittedBy: { select: { id: true, name: true } },
    },
  }) as Promise<OrdinanceReportRow[]>;
}

// ─── Filter Options ─────────────────────────────────────────────────────────

export async function getReportFilterOptions(scopedBarangayId?: string) {
  const barangayWhere = scopedBarangayId ? { barangayId: scopedBarangayId } : {};

  const [barangays, submitters, ordinances] = await Promise.all([
    // All barangays (only for LGU admin)
    scopedBarangayId
      ? Promise.resolve([])
      : prisma.barangay.findMany({
          orderBy: { name: "asc" },
          select: { id: true, name: true },
        }),

    // Users who have submitted at least one ordinance
    prisma.user.findMany({
      where: {
        submittedOrdinances: { some: barangayWhere },
      },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),

    // Get distinct categories and years
    prisma.ordinance.findMany({
      where: barangayWhere,
      select: { category: true, year: true },
      distinct: ["category", "year"],
    }),
  ]);

  const categories = [...new Set(ordinances.map((o) => o.category).filter(Boolean))] as string[];
  categories.sort();

  const years = [...new Set(ordinances.map((o) => o.year).filter(Boolean))] as number[];
  years.sort((a, b) => b - a);

  return { barangays, submitters, categories, years };
}
