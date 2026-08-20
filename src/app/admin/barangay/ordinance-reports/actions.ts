"use server";

import {
  getOrdinancesForReports,
  type ReportFilters,
  type OrdinanceReportRow,
} from "@/lib/ordinance-report-queries";

/**
 * Server action to fetch ordinances for report generation (barangay-scoped).
 */
export async function fetchOrdinancesForReport(
  filters: ReportFilters,
  scopedBarangayId?: string,
): Promise<OrdinanceReportRow[]> {
  return getOrdinancesForReports(filters, scopedBarangayId);
}
