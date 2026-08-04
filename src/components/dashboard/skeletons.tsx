/**
 * Reusable shimmer skeleton primitives for dashboard loading states.
 * These provide instant visual feedback while server components fetch data
 * and accurately mirror the real dashboard layouts (Overview, SubPages, Analytics).
 */

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[var(--radius-md)] bg-[var(--border-hairline)] ${className}`}
      aria-hidden="true"
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card-elevated p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Shimmer className="h-10 w-10 rounded-[var(--radius-sm)]" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-3 w-24" />
          <Shimmer className="h-6 w-16" />
        </div>
      </div>
      <Shimmer className="h-3 w-32" />
    </div>
  );
}

export function StatusBreakdownSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-[var(--radius-md)] p-4 border border-[var(--border-hairline)]">
          <Shimmer className="h-7 w-12 mb-2" />
          <Shimmer className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({
  rows = 5,
  cols = 5,
  colWidths = [],
}: {
  rows?: number;
  cols?: number;
  colWidths?: string[];
}) {
  return (
    <div className="card-elevated overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)]">
        {Array.from({ length: cols }).map((_, i) => (
          <Shimmer
            key={i}
            className={`h-3 ${colWidths[i] || "flex-1"}`}
          />
        ))}
      </div>
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex items-center gap-4 px-4 py-4 border-b border-[var(--border-hairline)] last:border-b-0"
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Shimmer
              key={colIdx}
              className={`h-4 ${colWidths[colIdx] || "flex-1"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-2">
        <Shimmer className="h-7 w-64" />
        <Shimmer className="h-4 w-80" />
      </div>
      <Shimmer className="h-10 w-44 rounded-[var(--radius-sm)]" />
    </div>
  );
}

export function FilterBarSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <Shimmer className="h-10 w-full sm:w-72 rounded-[var(--radius-sm)]" />
      <div className="flex items-center gap-2">
        <Shimmer className="h-9 w-20 rounded-[var(--radius-sm)]" />
        <Shimmer className="h-9 w-24 rounded-[var(--radius-sm)]" />
        <Shimmer className="h-9 w-24 rounded-[var(--radius-sm)]" />
      </div>
    </div>
  );
}

export function OverviewLoadingSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-label="Naglo-load ang dashboard...">
      <span className="sr-only">Naglo-load ang dashboard...</span>

      {/* 1. Stat cards (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* 2. Status Breakdown (Status ng mga Ordinansa) */}
      <div className="space-y-4">
        <Shimmer className="h-4 w-48" />
        <StatusBreakdownSkeleton />
      </div>

      {/* 3. Table 1: Nakabimbing Ordinansa / Pinakabagong Ordinansa (6 columns) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Shimmer className="h-4 w-64" />
          <Shimmer className="h-3 w-28" />
        </div>
        <TableSkeleton
          rows={5}
          cols={6}
          colWidths={["w-20", "flex-1", "w-36", "w-32", "w-24", "w-16"]}
        />
      </div>

      {/* 4. Table 2: Mga Bagong Ulat ng Komunidad / Recent Reports (5 columns) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Shimmer className="h-4 w-60" />
          <Shimmer className="h-3 w-28" />
        </div>
        <TableSkeleton
          rows={5}
          cols={5}
          colWidths={["w-44", "flex-1", "w-28", "w-24", "w-16"]}
        />
      </div>
    </div>
  );
}

export function SubPageLoadingSkeleton() {
  return (
    <div className="space-y-6 max-w-[1400px]" role="status" aria-label="Naglo-load ang pahina...">
      <span className="sr-only">Naglo-load ang pahina...</span>
      <PageHeaderSkeleton />
      <FilterBarSkeleton />
      <TableSkeleton
        rows={8}
        cols={6}
        colWidths={["w-24", "flex-1", "w-36", "w-28", "w-24", "w-20"]}
      />
    </div>
  );
}

export function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-label="Naglo-load ang analytics...">
      <span className="sr-only">Naglo-load ang analytics...</span>
      <PageHeaderSkeleton />
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-elevated p-6 space-y-4">
          <div className="flex justify-between items-center">
            <Shimmer className="h-5 w-48" />
            <Shimmer className="h-4 w-20" />
          </div>
          <Shimmer className="h-[280px] w-full rounded-[var(--radius-md)]" />
        </div>
        <div className="card-elevated p-6 space-y-4">
          <div className="flex justify-between items-center">
            <Shimmer className="h-5 w-48" />
            <Shimmer className="h-4 w-20" />
          </div>
          <Shimmer className="h-[280px] w-full rounded-[var(--radius-md)]" />
        </div>
      </div>
    </div>
  );
}

