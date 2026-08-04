import type { Metadata } from "next";
import { getAllBarangaysWithDetails } from "@/lib/dashboard-queries";
import { BarangayManager } from "./barangay-manager";

export const metadata: Metadata = {
  title: "Mga Barangay — LGU Super Admin",
  description: "Pamahalaan ang rehistrasyon ng mga Barangay at kani-kanilang Admin Accounts.",
};

export default async function LguBarangaysPage() {
  const barangays = await getAllBarangaysWithDetails();

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-ink)] tracking-tight">
          Pamamahala ng mga Barangay
        </h1>
        <p className="text-sm text-[var(--text-body)] mt-1">
          Dito pwedeng mag-rehistro ng bagong Barangay at mag-manage ng kani-kanilang Barangay Admin Account (Punong Barangay o Kalihim).
        </p>
      </div>

      <BarangayManager initialBarangays={barangays} />
    </div>
  );
}
