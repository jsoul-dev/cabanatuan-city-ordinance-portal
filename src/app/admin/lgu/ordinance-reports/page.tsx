import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getReportFilterOptions } from "@/lib/ordinance-report-queries";
import { OrdinanceReportsClient } from "./ordinance-reports-client";

export default async function LguOrdinanceReportsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "LGU_ADMIN") redirect("/login");

  const filterOptions = await getReportFilterOptions();

  return (
    <OrdinanceReportsClient
      filterOptions={filterOptions}
      userName={user.name}
      userRole="LGU Super Admin"
    />
  );
}
