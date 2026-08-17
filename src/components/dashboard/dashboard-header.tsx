"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheckIcon, HomeIcon } from "./icons";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
  BARANGAY_ADMIN: "Barangay Admin",
};

export function DashboardHeader({ title, subtitle, user }: DashboardHeaderProps) {
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

      <div className="flex items-center gap-2.5 sm:gap-3">


        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* User Role Badge */}
        {user && (
          <div className="hidden md:flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-1.5">
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
