import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

const BARANGAY_NAV = [
  { href: "/admin/barangay",            icon: "overview",   label: "Overview" },
  { href: "/admin/barangay/ordinances", icon: "ordinances", label: "Mga Ordinansa" },
  { href: "/admin/barangay/reports",    icon: "reports",    label: "Mga Ulat ng Komunidad" },
];

export default async function BarangayLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user || user.role === "LGU_ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex h-screen w-full bg-[var(--bg-canvas)] overflow-hidden">
      <DashboardSidebar
        navItems={BARANGAY_NAV}
        portalLabel="Barangay Admin"
        homeHref="/admin/barangay"
        user={{
          name: user.name,
          email: user.email,
          role: user.role,
          barangayName: user.barangay?.name,
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader
          title={user.barangay?.name ? `Barangay ${user.barangay.name}` : "Barangay Admin Portal"}
          subtitle="Pamahalaan ang mga ordinansa at ulat ng inyong barangay"
          user={{
            name: user.name,
            role: user.role,
            barangayName: user.barangay?.name,
          }}
        />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
