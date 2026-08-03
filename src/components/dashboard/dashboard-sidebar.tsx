"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { logout } from "@/lib/auth-actions";
import { IconMap, LayoutDashboardIcon, LogOutIcon, ChevronLeftIcon } from "./icons";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  description?: string;
}

interface DashboardSidebarProps {
  navItems: NavItem[];
  user: {
    name: string;
    email: string;
    role: string;
    barangayName?: string | null;
  };
  portalLabel: string;
  homeHref?: string;
}

const roleLabel: Record<string, string> = {
  LGU_ADMIN: "LGU Super Admin",
  CAPTAIN: "Punong Barangay",
  SECRETARY: "Kalihim ng Barangay",
  KAGAWAD: "Kagawad",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function DashboardSidebar({
  navItems,
  user,
  portalLabel,
  homeHref = "/admin",
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = useCallback(async () => {
    await logout();
  }, []);

  return (
    <aside
      className={`flex flex-col h-screen sticky top-0 bg-[#0d1810] border-r border-[#1f2923] transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-64"
      } flex-shrink-0 z-30`}
      aria-label="Dashboard Navigation"
    >
      {/* Header */}
      <div
        className={`flex items-center gap-3 px-4 py-4 border-b border-[#1f2923] min-h-[64px] ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <Link href={homeHref} className="flex items-center gap-3 min-w-0">
          <div className="relative w-9 h-9 flex-shrink-0">
            <Image
              src="/lgu-logo.png"
              alt="Cabanatuan City LGU Seal"
              width={36}
              height={36}
              className="rounded-full object-contain"
              priority
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-emerald-400 leading-tight truncate">
                {portalLabel}
              </span>
              <span className="text-[10px] text-[#4a6657] leading-tight truncate">
                Cabanatuan City
              </span>
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className={`ml-auto flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] text-[#4a6657] hover:text-emerald-400 hover:bg-[#1a2b20] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            collapsed ? "ml-0" : ""
          }`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          <ChevronLeftIcon
            size={16}
            className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Nav Items */}
      <nav
        className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-1"
        aria-label="Main dashboard navigation"
      >
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(item.href + "/") && item.href !== "/admin/lgu" && item.href !== "/admin/barangay");
          const IconComponent = IconMap[item.icon] || LayoutDashboardIcon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? item.label : undefined}
              className={`group flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 relative ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-300 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1 before:rounded-r-full before:bg-emerald-500"
                  : "text-[#7a9882] hover:bg-[#1a2b20] hover:text-emerald-200"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <span
                className={`flex-shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? "scale-110 text-emerald-400" : "text-[#7a9882]"
                }`}
                aria-hidden="true"
              >
                <IconComponent size={18} />
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Card */}
      <div className={`border-t border-[#1f2923] p-3 ${collapsed ? "px-2" : ""}`}>
        <div
          className={`flex items-center gap-3 rounded-[var(--radius-sm)] bg-[#1a2b20] p-2.5 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 text-xs font-bold flex-shrink-0"
            aria-hidden="true"
          >
            {getInitials(user.name)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#d1fae5] truncate">{user.name}</p>
              <p className="text-[10px] text-[#4a6657] truncate">
                {roleLabel[user.role] ?? user.role}
                {user.barangayName ? ` · ${user.barangayName}` : ""}
              </p>
            </div>
          )}
          {!collapsed && (
            <form action={handleLogout}>
              <button
                type="submit"
                title="Mag-logout"
                aria-label="Mag-logout"
                className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-[var(--radius-sm)] text-[#4a6657] hover:text-red-400 hover:bg-red-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                <LogOutIcon size={16} />
              </button>
            </form>
          )}
        </div>
        {collapsed && (
          <form action={handleLogout} className="mt-2 flex justify-center">
            <button
              type="submit"
              title="Mag-logout"
              aria-label="Mag-logout"
              className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] text-[#4a6657] hover:text-red-400 hover:bg-red-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <LogOutIcon size={16} />
            </button>
          </form>
        )}
      </div>
    </aside>
  );
}
