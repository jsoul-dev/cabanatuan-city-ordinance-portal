import type { Metadata } from "next";
import { getLguAnalyticsData } from "@/lib/dashboard-queries";
import { LguAnalyticsView } from "./lgu-analytics-view";

export const metadata: Metadata = {
  title: "LGU Executive Analytics — LGU Super Admin",
  description: "Komprehensibong pagsusuri sa mga ordinansa at ulat ng komunidad sa buong lungsod.",
};

export default async function LguAnalyticsPage() {
  const { ordinances, reports, barangaysWithCounts } = await getLguAnalyticsData();

  return (
    <div className="space-y-6 w-full">
      <LguAnalyticsView
        ordinances={ordinances}
        reports={reports}
        barangays={barangaysWithCounts}
      />
    </div>
  );
}
