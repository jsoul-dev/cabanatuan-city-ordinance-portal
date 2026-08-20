import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

const LGU_NAV = [
  { href: "/admin/lgu",            icon: "overview",   label: "Overview" },
  { href: "/admin/lgu/ordinances", icon: "ordinances", label: "Mga Ordinansa" },
  { href: "/admin/lgu/barangays",  icon: "barangays",  label: "Mga Barangay" },
  { href: "/admin/lgu/analytics",  icon: "analytics",  label: "Analytics & Pagsusuri" },
  { href: "/admin/lgu/ordinance-reports", icon: "ordinanceReports", label: "Mga Ulat ng Ordinansa" },
  { href: "/admin/lgu/users",      icon: "users",      label: "Mga Opisyal" },
  { href: "/admin/lgu/news",       icon: "news",       label: "Balita & Anunsyo" },
  { href: "/admin/lgu/reports",    icon: "reports",    label: "Mga Ulat ng Komunidad" },
];

export default async function LguLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user || user.role !== "LGU_ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex-1 flex min-h-0 w-full bg-[var(--bg-canvas)] overflow-hidden">
      <DashboardSidebar
        navItems={LGU_NAV}
        portalLabel="LGU Super Admin"
        homeHref="/admin/lgu"
        user={{
          name: user.name,
          email: user.email,
          role: user.role,
          barangayName: user.barangay?.name,
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        <DashboardHeader
          title="LGU Super Admin Portal"
          subtitle="Cabanatuan City Ordinance & Governance Dashboard"
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
