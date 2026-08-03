"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { LoginForm } from "./login-form";

/**
 * Client Wrapper for Login Page — integrated with global next-themes,
 * zero hydration theme flash, winauth.net-inspired aurora mesh, and sleek civic branding.
 */
export function LoginClient() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    const current = resolvedTheme || theme;
    setTheme(current === "dark" ? "light" : "dark");
  };

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  return (
    <div className="relative min-h-screen w-full overflow-hidden transition-colors duration-500 bg-[#fafaf9] text-neutral-900 selection:bg-emerald-600 selection:text-white dark:bg-[#050807] dark:text-white dark:selection:bg-emerald-500 dark:selection:text-black">
      {/* Aurora Ambient Background Gradients */}
      <div
        className="pointer-events-none absolute -left-1/4 top-1/4 h-[600px] w-[600px] rounded-full blur-[130px] transition-opacity duration-500 bg-emerald-500/15 opacity-80 dark:bg-emerald-600/20 dark:opacity-100"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/3 top-0 h-[450px] w-[450px] rounded-full blur-[120px] transition-opacity duration-500 bg-emerald-400/15 opacity-70 dark:bg-emerald-500/15 dark:opacity-100"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-10 h-[500px] w-[500px] rounded-full blur-[140px] transition-opacity duration-500 bg-amber-400/10 opacity-60 dark:bg-amber-500/10 dark:opacity-100"
        aria-hidden="true"
      />

      {/* Vertical Glass Grid / Scanline overlay (inspired by winauth.net) */}
      <div
        className="pointer-events-none absolute inset-0 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-[linear-gradient(to_right,#00000006_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px)]"
        aria-hidden="true"
      />

      {/* Main Grid: 2-Column Split Layout on Desktop */}
      <div className="relative z-10 grid min-h-screen lg:grid-cols-12">
        {/* Left Column: Hero Branding & Tagline */}
        <div className="flex flex-col justify-between p-8 sm:p-12 lg:col-span-7 lg:p-16">
          {/* Top Brand Bar with Theme Toggle */}
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/20">
                <span className="text-base" aria-hidden="true">
                  🏛️
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-sm tracking-tight">
                <span className="font-bold text-neutral-900 dark:text-white">
                  cabanatuan.gov.ph
                </span>
                <span className="text-neutral-500">/</span>
                <span className="text-neutral-400">ordinance-portal</span>
              </div>
            </Link>

            <div className="flex items-center gap-2.5">
              {/* Theme Toggle Button */}
              {mounted && (
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle light or dark theme"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm backdrop-blur-md transition-all hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-950 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <span>{isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}</span>
                </button>
              )}

              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur-md transition-all hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-950 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <span>← Bumalik sa Home</span>
              </Link>
            </div>
          </div>

          {/* Center Hero Content */}
          <div className="my-12 max-w-xl lg:my-0">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-100 px-3 py-1 font-mono text-xs font-semibold tracking-widest text-emerald-800 uppercase dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full animate-pulse bg-emerald-600 dark:bg-emerald-400" />
              <span>Mag-login sa Portal</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl lg:leading-[1.1] dark:text-white">
              Batas ng Lungsod. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 via-emerald-600 to-neutral-900 dark:from-emerald-400 dark:via-emerald-200 dark:to-white">
                Malinaw para sa lahat.
              </span>
            </h1>

            <p className="mt-6 text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
              Ang opisyal na digital ordinance hub at AI citizen legal assistant
              ng Lungsod ng Cabanatuan. Mag-login upang mamahala ng mga barangay
              ordinance, ulat ng mamamayan, at mga talaan ng lungsod.
            </p>

            {/* Civic Highlight Badges */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
                <span className="text-emerald-600 font-bold dark:text-emerald-400 dark:font-normal">
                  ✓
                </span>
                <span>75 Barangay Linked</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
                <span className="text-emerald-600 font-bold dark:text-emerald-400 dark:font-normal">
                  ✓
                </span>
                <span>AI Ordinance Advisor</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
                <span className="text-emerald-600 font-bold dark:text-emerald-400 dark:font-normal">
                  ✓
                </span>
                <span>RLS Secured</span>
              </div>
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-6 text-xs text-neutral-500 dark:border-white/10 dark:text-neutral-500">
            <div>
              &copy; {new Date().getFullYear()}{" "}
              <span className="font-medium text-neutral-700 dark:text-neutral-400">
                Pamahalaang Lungsod ng Cabanatuan
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:font-medium dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full animate-ping bg-emerald-600 dark:bg-emerald-500" />
                <span>System Operational</span>
              </span>
              <span>•</span>
              <Link
                href="/privacy"
                className="hover:text-neutral-400 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-neutral-400 transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Dark/Light Glassmorphic Card (winauth.net style) */}
        <div className="flex items-center justify-center p-6 sm:p-12 lg:col-span-5 lg:border-l lg:border-neutral-200 lg:bg-neutral-100/50 dark:lg:border-white/10 dark:lg:bg-black/20">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200/80 bg-white/95 p-8 sm:p-10 shadow-2xl shadow-neutral-300/60 backdrop-blur-2xl transition-all duration-500 dark:border-white/10 dark:bg-[#0a0f0d]/90 dark:shadow-emerald-950/50">
            {/* Card Header */}
            <div className="mb-8">
              <div className="mb-2 font-mono text-xs font-bold tracking-widest uppercase text-emerald-700 dark:text-emerald-400">
                SIGN IN
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
                Welcome back
              </h2>
              <p className="mt-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                Manage your ordinances, citizen reports, and LGU records.
              </p>
            </div>

            {/* Login Form component with Quick-Fill buttons and global theme support */}
            <LoginForm />

            <div className="mt-6 text-center">
              <span className="text-xs text-neutral-600 dark:text-neutral-500">
                Don&apos;t have an account?{" "}
              </span>
              <Link
                href="/"
                className="text-xs font-semibold underline underline-offset-4 transition-colors text-neutral-900 hover:text-emerald-700 dark:text-white dark:hover:text-emerald-400"
              >
                Request LGU Access
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
