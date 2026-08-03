import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

const LGU_NAV = [
  { href: "/admin/lgu",           icon: "📊", label: "Overview" },
  { href: "/admin/lgu/ordinances",icon: "📜", label: "Mga Ordinansa" },
  { href: "/admin/lgu/users",     icon: "👥", label: "Mga Opisyal" },
  { href: "/admin/lgu/news",      icon: "📰", label: "Balita & Anunsyo" },
  { href: "/admin/lgu/reports",   icon: "📣", label: "Mga Ulat ng Komunidad" },
];

export default async function LguLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user || user.role !== "LGU_ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-canvas)]">
      <DashboardSidebar
        navItems={LGU_NAV}
        portalLabel="LGU Admin Portal"
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
