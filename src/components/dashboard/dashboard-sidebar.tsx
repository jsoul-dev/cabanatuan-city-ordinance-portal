"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { logout } from "@/lib/auth-actions";
import { IconMap, LayoutDashboardIcon, LogOutIcon, ChevronLeftIcon, HomeIcon } from "./icons";

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
  BARANGAY_ADMIN: "Barangay Admin",
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
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem("sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
  }, []);

  return (
    <aside
      className={`relative flex flex-col h-screen sticky top-0 bg-[var(--bg-card)] border-r border-[var(--border-hairline)] ${
        collapsed ? "w-[72px]" : "w-64"
      } ${mounted ? "transition-[width] duration-200 ease-in-out" : ""} flex-shrink-0 z-30`}
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-hairline)",
      }}
      aria-label="Dashboard Navigation"
    >
      {/* Floating Collapse / Expand Toggle Button */}
      <button
        type="button"
        onClick={toggleCollapsed}
        className="absolute -right-3.5 top-4.5 z-40 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-hairline)] bg-[var(--bg-card)] text-[var(--text-ink)] shadow-md hover:bg-[var(--accent-primary)] hover:text-white dark:hover:bg-emerald-600 active:scale-90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeftIcon
          size={14}
          className={collapsed ? "rotate-180" : ""}
        />
      </button>

      {/* Header */}
      <div
        className={`flex h-16 items-center px-4 border-b border-[var(--border-hairline)] ${
          collapsed ? "justify-center" : "justify-between"
        }`}
        style={{ borderColor: "var(--border-hairline)" }}
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
              <span className="text-xs font-bold text-[var(--accent-primary)] leading-tight truncate">
                {portalLabel}
              </span>
              <span className="text-[10px] text-[var(--text-mute)] leading-tight truncate">
                Cabanatuan City
              </span>
            </div>
          )}
        </Link>
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
                  ? "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1 before:rounded-r-full before:bg-emerald-600 dark:before:bg-emerald-500"
                  : "text-[var(--text-body)] hover:bg-emerald-500/10 hover:text-emerald-800 dark:hover:text-emerald-300"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <span
                className={`flex-shrink-0 transition-transform group-hover:scale-110 ${
                  isActive
                    ? "scale-110 text-emerald-600 dark:text-emerald-400"
                    : "text-[var(--text-mute)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
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

      {/* Back to Home / Public Portal Link */}
      <div className="px-2 pb-2">
        <Link
          href="/"
          title={collapsed ? "Bumalik sa Main Page" : undefined}
          className={`group flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-xs font-medium text-[var(--text-mute)] hover:bg-emerald-500/10 hover:text-emerald-800 dark:hover:text-emerald-300 transition-all ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <HomeIcon size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          {!collapsed && <span className="truncate">Bumalik sa Landing Page</span>}
        </Link>
      </div>

      {/* User Card */}
      <div
        className={`border-t border-[var(--border-hairline)] p-3 ${collapsed ? "px-2" : ""}`}
        style={{ borderColor: "var(--border-hairline)" }}
      >
        <div
          className={`flex items-center gap-3 rounded-[var(--radius-sm)] bg-emerald-500/10 dark:bg-[#1a2b20] border border-[var(--border-hairline)] p-2.5 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full bg-emerald-500/15 dark:bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-300 text-xs font-bold flex-shrink-0"
            aria-hidden="true"
          >
            {getInitials(user.name)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--text-ink)] truncate">{user.name}</p>
              <p className="text-[10px] text-[var(--text-mute)] truncate">
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
                className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-mute)] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
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
              className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-mute)] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <LogOutIcon size={16} />
            </button>
          </form>
        )}
      </div>
    </aside>
  );
}
