import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getBarangayReports } from "@/lib/dashboard-queries";
import { BarangayReportsManager } from "./reports-manager";

export const metadata: Metadata = {
  title: "Mga Ulat ng Komunidad — Barangay Dashboard",
  description: "Tingnan at i-update ang status ng mga ulat mula sa inyong komunidad.",
};

export default async function BarangayReportsPage() {
  const session = await getSession();

  if (!session?.barangayId) redirect("/login");

  const reports = await getBarangayReports(session.barangayId);

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-ink)] tracking-tight">Mga Ulat ng Komunidad</h1>
        <p className="text-sm text-[var(--text-body)] mt-1">
          Tingnan at i-update ang status ng mga ulat mula sa mga mamamayan ng inyong barangay.
        </p>
      </div>
      <BarangayReportsManager initialReports={reports} />
    </div>
  );
}
