import type { ReactNode } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />

      <div className="flex-1 bg-[var(--bg-canvas)] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Admin Header & Navigation Banner */}
          <div className="mb-8 rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--bg-card)] p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                  LGU Official Management Portal
                </span>
                <h1 className="mt-2 text-2xl font-bold text-[var(--text-ink)]">
                  Cabanatuan Law Portal Admin
                </h1>
                <p className="text-sm text-[var(--text-body)]">
                  Pamahalaan ang mga ordinansa, balita, at mga gumagamit sa system.
                </p>
              </div>

              {/* Quick Admin Navigation Tabs */}
              <nav aria-label="Admin Navigation" className="flex flex-wrap items-center gap-2">
                <Link
                  href="/admin"
                  className="rounded-[var(--radius-pill)] bg-[var(--bg-canvas)] px-4 py-2 text-sm font-medium text-[var(--text-ink)] border border-[var(--border-hairline)] hover:border-[var(--accent-primary)] transition-colors min-h-[44px] sm:min-h-[36px] flex items-center"
                >
                  📊 Overview
                </Link>
                <Link
                  href="/admin/ordinances"
                  className="rounded-[var(--radius-pill)] bg-[var(--bg-canvas)] px-4 py-2 text-sm font-medium text-[var(--text-ink)] border border-[var(--border-hairline)] hover:border-[var(--accent-primary)] transition-colors min-h-[44px] sm:min-h-[36px] flex items-center"
                >
                  📜 Ordinansa
                </Link>
                <Link
                  href="/admin/news"
                  className="rounded-[var(--radius-pill)] bg-[var(--bg-canvas)] px-4 py-2 text-sm font-medium text-[var(--text-ink)] border border-[var(--border-hairline)] hover:border-[var(--accent-primary)] transition-colors min-h-[44px] sm:min-h-[36px] flex items-center"
                >
                  📰 Balita
                </Link>
                <Link
                  href="/admin/users"
                  className="rounded-[var(--radius-pill)] bg-[var(--bg-canvas)] px-4 py-2 text-sm font-medium text-[var(--text-ink)] border border-[var(--border-hairline)] hover:border-[var(--accent-primary)] transition-colors min-h-[44px] sm:min-h-[36px] flex items-center"
                >
                  👥 Users
                </Link>
              </nav>
            </div>
          </div>

          {/* Admin Content Area */}
          <div className="space-y-6">{children}</div>
        </div>
      </div>

      <Footer />
    </>
  );
}
