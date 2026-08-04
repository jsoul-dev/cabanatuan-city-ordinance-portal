import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getBarangayAnalyticsData } from "@/lib/dashboard-queries";
import { BarangayAnalyticsView } from "./barangay-analytics-view";
import { AlertTriangleIcon } from "@/components/dashboard/icons";

export const metadata: Metadata = {
  title: "Analytics — Barangay Admin",
  description: "Lokal na pagsusuri sa mga ordinansa at ulat ng inyong barangay.",
};

export default async function BarangayAnalyticsPage() {
  const session = await getSession();
  if (!session || session.role === "LGU_ADMIN") {
    redirect("/login");
  }

  const barangayId = session.barangayId;
  if (!barangayId) {
    return (
      <div className="card-elevated p-8 text-center max-w-lg mx-auto my-12">
        <AlertTriangleIcon size={36} className="text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[var(--text-ink)]">
          Walang Nakatalagang Barangay
        </h2>
        <p className="text-sm text-[var(--text-body)] mt-2">
          Ang iyong account ay hindi pa nakatalaga sa isang barangay.
          Makipag-ugnayan sa LGU Admin.
        </p>
      </div>
    );
  }

  const { ordinances, reports, barangay } = await getBarangayAnalyticsData(barangayId);

  return (
    <div className="space-y-6 w-full">
      <BarangayAnalyticsView
        ordinances={ordinances}
        reports={reports}
        barangayName={barangay?.name || "Barangay"}
      />
    </div>
  );
}
