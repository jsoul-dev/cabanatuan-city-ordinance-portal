import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getBarangayAllOrdinances } from "@/lib/dashboard-queries";
import { BarangayOrdinanceManager } from "./ordinance-manager";

export const metadata: Metadata = {
  title: "Mga Ordinansa ng Barangay — Dashboard",
  description: "Pamahalaan ang mga ordinansa ng iyong barangay.",
};

export default async function BarangayOrdinancesPage() {
  const session = await getSession();

  if (!session?.barangayId) redirect("/login");

  const ordinances = await getBarangayAllOrdinances(session.barangayId);
  const canSubmit = session.role === "CAPTAIN" || session.role === "SECRETARY";

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-ink)] tracking-tight">Mga Ordinansa ng Barangay</h1>
        <p className="text-sm text-[var(--text-body)] mt-1">
          {canSubmit
            ? "Suriin ang status ng mga ordinansa o magsumite ng bagong ordinansa para sa pagsusuri ng LGU."
            : "Tingnan ang status ng lahat ng ordinansa ng inyong barangay."}
        </p>
      </div>
      <BarangayOrdinanceManager initialOrdinances={ordinances} canSubmit={canSubmit} />
    </div>
  );
}
