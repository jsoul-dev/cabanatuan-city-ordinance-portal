"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SearchIcon, SunIcon, MoonIcon, ShieldCheckIcon } from "./icons";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  user?: {
    name: string;
    role: string;
    barangayName?: string | null;
  };
}

const roleLabel: Record<string, string> = {
  LGU_ADMIN: "LGU Super Admin",
  CAPTAIN: "Punong Barangay",
  SECRETARY: "Kalihim ng Barangay",
  KAGAWAD: "Kagawad",
};

export function DashboardHeader({ title, subtitle, user }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <header
      className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[#1f2923] bg-[#0d1810] px-6 transition-colors dark:border-[#1f2923] dark:bg-[#0d1810] light:border-slate-200 light:bg-white"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-hairline)",
      }}
    >
      <div className="flex flex-col">
        <h1 className="text-base font-bold tracking-tight text-[var(--text-ink)] md:text-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-[var(--text-mute)]">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--text-mute)]">
            <SearchIcon size={15} />
          </span>
          <input
            type="search"
            placeholder="Maghanap..."
            className="h-9 w-64 rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] pl-9 pr-4 text-xs text-[var(--text-ink)] placeholder-[var(--text-mute)] transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Theme Toggle Button */}
        {mounted && (
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-ink)] hover:border-emerald-500/50 hover:text-emerald-400 transition-colors focus:outline-none"
            aria-label="Toggle Theme"
            title="Toggle Light / Dark Mode"
          >
            {theme === "dark" ? <SunIcon size={17} /> : <MoonIcon size={17} />}
          </button>
        )}

        {/* User Role Badge */}
        {user && (
          <div className="hidden sm:flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-1.5">
            <ShieldCheckIcon size={14} className="text-emerald-500" />
            <span className="text-xs font-medium text-[var(--text-ink)]">
              {roleLabel[user.role] || user.role}
            </span>
            {user.barangayName && (
              <span className="text-[11px] text-[var(--text-mute)] border-l border-[var(--border-hairline)] pl-2">
                {user.barangayName}
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
