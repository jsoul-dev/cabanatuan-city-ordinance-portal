import type { Metadata } from "next";
import { getLguAllReports } from "@/lib/dashboard-queries";
import { ReportsManager } from "./reports-manager";

export const metadata: Metadata = {
  title: "Mga Ulat ng Komunidad — LGU Admin",
  description: "Suriin at pamahalaan ang mga ulat mula sa komunidad ng Lungsod ng Cabanatuan.",
};

export default async function LguReportsPage() {
  const reports = await getLguAllReports();

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-ink)] tracking-tight">Mga Ulat ng Komunidad</h1>
        <p className="text-sm text-[var(--text-body)] mt-1">
          Suriin at i-update ang status ng mga ulat mula sa mga mamamayan ng Cabanatuan City.
        </p>
      </div>
      <ReportsManager initialReports={reports} />
    </div>
  );
}
