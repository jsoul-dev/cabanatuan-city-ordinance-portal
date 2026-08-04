"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@/components/dashboard/icons";

interface ThemeToggleProps {
  className?: string;
  size?: number;
}

export function ThemeToggle({ className = "", size = 18 }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <div
        className={`h-9 w-9 rounded-xl border border-neutral-200/60 bg-white/50 dark:border-white/10 dark:bg-neutral-900/50 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white/90 text-neutral-800 shadow-sm transition-all hover:bg-neutral-100 hover:border-neutral-300 dark:border-white/10 dark:bg-neutral-900/90 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:border-white/20 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${className}`}
      aria-label={isDark ? "Lumipat sa Light Mode" : "Lumipat sa Dark Mode"}
      title={isDark ? "Lumipat sa Light Mode" : "Lumipat sa Dark Mode"}
    >
      {isDark ? (
        <SunIcon size={size} className="text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <MoonIcon size={size} className="text-emerald-700 dark:text-emerald-400 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
