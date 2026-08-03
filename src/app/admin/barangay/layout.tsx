import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

const BARANGAY_ROLES = ["CAPTAIN", "SECRETARY", "KAGAWAD"] as const;
type BarangayRole = typeof BARANGAY_ROLES[number];

const NAV_BY_ROLE: Record<BarangayRole, { href: string; icon: string; label: string }[]> = {
  CAPTAIN: [
    { href: "/admin/barangay",             icon: "📊", label: "Overview" },
    { href: "/admin/barangay/ordinances",  icon: "📜", label: "Mga Ordinansa" },
    { href: "/admin/barangay/reports",     icon: "📣", label: "Mga Ulat" },
  ],
  SECRETARY: [
    { href: "/admin/barangay",             icon: "📊", label: "Overview" },
    { href: "/admin/barangay/ordinances",  icon: "📜", label: "Mga Ordinansa" },
    { href: "/admin/barangay/reports",     icon: "📣", label: "Mga Ulat" },
  ],
  KAGAWAD: [
    { href: "/admin/barangay",             icon: "📊", label: "Overview" },
    { href: "/admin/barangay/ordinances",  icon: "📜", label: "Mga Ordinansa" },
    { href: "/admin/barangay/reports",     icon: "📣", label: "Mga Ulat" },
  ],
};

export default async function BarangayLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user || !BARANGAY_ROLES.includes(user.role as BarangayRole)) {
    redirect("/login");
  }

  const navItems = NAV_BY_ROLE[user.role as BarangayRole];

  const portalLabel =
    user.role === "CAPTAIN" ? "Kapitan Portal" :
    user.role === "SECRETARY" ? "Kalihim Portal" :
    "Kagawad Portal";

  return (
    <div className="flex min-h-screen bg-[var(--bg-canvas)]">
      <DashboardSidebar
        navItems={navItems}
        portalLabel={portalLabel}
        user={{
          name: user.name,
          email: user.email,
          role: user.role,
          barangayName: user.barangay?.name,
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <main id="main-content" className="flex-1 p-6 lg:p-8">
          <a href="#main-content" className="skip-link">
            Laktawan sa pangunahing nilalaman
          </a>
          {children}
        </main>
      </div>
    </div>
  );
}
