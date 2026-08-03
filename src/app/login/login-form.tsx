"use client";

import { useActionState } from "react";
import { login, type LoginResult } from "@/lib/auth-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Login form — client component using React 19 useActionState.
 *
 * A11Y: Explicit labels, aria-live error region, form validation.
 */
export function LoginForm() {
  const [state, formAction, isPending] = useActionState<
    LoginResult | undefined,
    FormData
  >(login, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/* A11Y: Error announcement region */}
      {state?.error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 p-3 text-sm text-[var(--color-error)]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm0 10.5a.75.75 0 100 1.5.75.75 0 000-1.5zM8 4a.75.75 0 00-.75.75v4.5a.75.75 0 001.5 0v-4.5A.75.75 0 008 4z" />
          </svg>
          {state.error}
        </div>
      )}

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="admin@cabanatuan.gov.ph"
        autoComplete="email"
        required
        disabled={isPending}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        required
        disabled={isPending}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="mt-2 w-full"
        disabled={isPending}
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
          "Mag-login"
        )}
      </Button>
    </form>
  );
}
