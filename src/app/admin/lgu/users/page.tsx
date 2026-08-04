import type { Metadata } from "next";
import { getLguAllUsers, getAllBarangays } from "@/lib/dashboard-queries";
import { UserManager } from "./user-manager";

export const metadata: Metadata = {
  title: "Mga Opisyal — LGU Admin",
  description: "Pamahalaan ang mga barangay at LGU officials sa sistema.",
};

export default async function LguUsersPage() {
  const [users, barangays] = await Promise.all([getLguAllUsers(), getAllBarangays()]);

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-ink)] tracking-tight">Mga Opisyal</h1>
        <p className="text-sm text-[var(--text-body)] mt-1">
          Pamahalaan ang mga barangay at LGU officials na may access sa sistema.
        </p>
      </div>
      <UserManager initialUsers={users} barangays={barangays} />
    </div>
  );
}
