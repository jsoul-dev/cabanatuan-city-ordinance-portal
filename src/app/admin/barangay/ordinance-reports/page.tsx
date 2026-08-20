import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getReportFilterOptions } from "@/lib/ordinance-report-queries";
import { BarangayOrdinanceReportsClient } from "./ordinance-reports-client";

export default async function BarangayOrdinanceReportsPage() {
  const user = await getCurrentUser();
  if (!user || user.role === "LGU_ADMIN" || !user.barangayId) redirect("/login");

  const filterOptions = await getReportFilterOptions(user.barangayId);

  return (
    <BarangayOrdinanceReportsClient
      filterOptions={filterOptions}
      userName={user.name}
      userRole={`Barangay Admin${user.barangay?.name ? ` · ${user.barangay.name}` : ""}`}
      scopedBarangayId={user.barangayId}
    />
  );
}
