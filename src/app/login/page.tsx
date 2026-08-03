import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Mag-login",
  description: "Mag-login sa Cabanatuan City Ordinance Hub",
};

/**
 * Login page — clean Vercel-style card in Cabanatuan LGU emerald/gold/obsidian.
 * Server Component wrapper for the client-side form.
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-canvas)] px-4">
      {/* Background mesh gradient */}
      <div className="hero-mesh-cabanatuan fixed inset-0" aria-hidden="true" />

      <main
        id="main-content"
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--bg-card)] p-8 shadow-[var(--shadow-floating)]">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-primary)]/10">
              <span className="text-2xl" aria-hidden="true">
                🏛️
              </span>
            </div>
            <h1 className="text-heading-md text-[var(--text-ink)]">
              Mag-login
            </h1>
            <p className="mt-1 text-sm text-[var(--text-body)]">
              Cabanatuan City Ordinance Portal
            </p>
          </div>

          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-[var(--text-faint)]">
          Para sa mga mamamayan at opisyal ng Lungsod ng Cabanatuan
        </p>
      </main>
    </div>
  );
}
