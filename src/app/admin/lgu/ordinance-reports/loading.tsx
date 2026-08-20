import React from "react";

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* ── Page Header Skeleton ── */}
      <div>
        <div className="h-8 w-64 bg-[var(--bg-card)] border border-[var(--border-hairline)] rounded-[var(--radius-md)]"></div>
        <div className="h-4 w-96 bg-[var(--bg-card)] border border-[var(--border-hairline)] rounded-[var(--radius-md)] mt-2"></div>
      </div>

      {/* ── Report Selector + Filters Skeleton ── */}
      <div className="grid gap-4 md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_2fr]">
        {/* Report Type Selector Skeleton */}
        <div className="rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--bg-card)] p-4 space-y-3">
          <div className="h-5 w-24 bg-[var(--bg-canvas)] rounded"></div>
          <div className="space-y-1 mt-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[44px] w-full bg-[var(--bg-canvas)] rounded-[var(--radius-sm)]"></div>
            ))}
          </div>
        </div>

        {/* Filters Panel Skeleton */}
        <div className="rounded-[var(--radius-md)] border border-[var(--border-hairline)] bg-[var(--bg-card)] p-4 space-y-4">
          <div className="h-5 w-24 bg-[var(--bg-canvas)] rounded"></div>
          
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-2">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-16 bg-[var(--bg-canvas)] rounded mb-1"></div>
                <div className="h-[44px] w-full bg-[var(--bg-canvas)] rounded-[var(--radius-sm)]"></div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <div className="h-[40px] w-36 bg-[var(--bg-canvas)] rounded-[var(--radius-md)]"></div>
            <div className="h-[40px] w-32 bg-[var(--bg-canvas)] rounded-[var(--radius-md)]"></div>
          </div>
        </div>
      </div>

      {/* ── Empty Preview State Skeleton ── */}
      <div className="rounded-[var(--radius-md)] border border-[var(--border-hairline)] border-dashed bg-transparent p-12">
        <div className="h-4 w-96 bg-[var(--bg-card)] border border-[var(--border-hairline)] rounded mx-auto"></div>
      </div>
    </div>
  );
}
