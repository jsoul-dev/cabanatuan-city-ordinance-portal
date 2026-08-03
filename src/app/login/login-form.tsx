"use client";

import { useActionState, useState } from "react";
import { login, type LoginResult } from "@/lib/auth-actions";

interface LoginFormProps {
  theme?: "dark" | "light";
}

/**
 * Premium Login Form — modeled after ultra-sleek dark glassmorphic auth portals (winauth.net style).
 * Includes global theme sync via Tailwind dark: utilities and quick-fill test account chips.
 */
export function LoginForm({ theme }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState<
    LoginResult | undefined,
    FormData
  >(login, undefined);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleQuickFill = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("Cabanatuan2026!");
  };

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-4">
        {/* A11Y: Error announcement region */}
        {state?.error && (
          <div
            role="alert"
            className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-500 font-medium"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="shrink-0 text-red-500"
              aria-hidden="true"
            >
              <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm0 10.5a.75.75 0 100 1.5.75.75 0 000-1.5zM8 4a.75.75 0 00-.75.75v4.5a.75.75 0 001.5 0v-4.5A.75.75 0 008 4z" />
            </svg>
            <span>{state.error}</span>
          </div>
        )}

        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email-input"
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
          >
            Email
          </label>
          <input
            id="email-input"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@cabanatuan.gov.ph"
            autoComplete="email"
            required
            disabled={isPending}
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 dark:border-white/10 dark:bg-[#121815]/90 dark:text-white dark:placeholder-neutral-500"
          />
        </div>

        {/* Password Field with Forgot Password Link */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password-input"
              className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Password
            </label>
            <span className="cursor-pointer text-xs transition-colors text-neutral-500 hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400">
              Forgot password?
            </span>
          </div>
          <input
            id="password-input"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            disabled={isPending}
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 dark:border-white/10 dark:bg-[#121815]/90 dark:text-white dark:placeholder-neutral-500"
          />
        </div>

        {/* Sleek High-Contrast Button (winauth.net style) */}
        <button
          type="submit"
          disabled={isPending}
          className="mt-2 flex w-full items-center justify-center rounded-xl bg-[#0a0f0d] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-neutral-900/10 transition-all duration-200 hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-black dark:shadow-white/5 dark:hover:bg-neutral-200"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  className="opacity-75"
                />
              </svg>
              Naglo-login...
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Quick-Fill Test Accounts Selector */}
      <div className="mt-2 border-t border-neutral-200 pt-5 dark:border-white/10">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-[11px] font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
            Quick-Fill Test Accounts
          </span>
          <span className="text-[10px] font-mono font-bold text-emerald-700 dark:font-normal dark:text-emerald-400">
            CLICK TO AUTO-FILL
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill("admin@cabanatuan.gov.ph")}
            className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-left text-xs text-neutral-700 transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-500/10 dark:hover:text-white"
          >
            <span className="text-emerald-500 font-bold">🏛️</span>
            <div>
              <div className="font-semibold text-neutral-900 dark:text-white">
                LGU Admin
              </div>
              <div className="text-[10px] truncate text-neutral-500 dark:text-neutral-400">
                admin@cabanatuan
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill("captain.kapitan@cabanatuan.gov.ph")}
            className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-left text-xs text-neutral-700 transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-500/10 dark:hover:text-white"
          >
            <span className="text-emerald-500 font-bold">🛡️</span>
            <div>
              <div className="font-semibold text-neutral-900 dark:text-white">
                Captain
              </div>
              <div className="text-[10px] truncate text-neutral-500 dark:text-neutral-400">
                captain.kapitan@
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              handleQuickFill("secretary.kalihim@cabanatuan.gov.ph")
            }
            className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-left text-xs text-neutral-700 transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-500/10 dark:hover:text-white"
          >
            <span className="text-emerald-500 font-bold">📋</span>
            <div>
              <div className="font-semibold text-neutral-900 dark:text-white">
                Secretary
              </div>
              <div className="text-[10px] truncate text-neutral-500 dark:text-neutral-400">
                secretary.kalihim@
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill("citizen@cabanatuan.gov.ph")}
            className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-left text-xs text-neutral-700 transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-900 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-500/10 dark:hover:text-white"
          >
            <span className="text-emerald-500 font-bold">👤</span>
            <div>
              <div className="font-semibold text-neutral-900 dark:text-white">
                Citizen
              </div>
              <div className="text-[10px] truncate text-neutral-500 dark:text-neutral-400">
                citizen@cabanatuan
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
