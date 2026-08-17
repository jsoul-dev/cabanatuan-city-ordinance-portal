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
    </div>
  );
}

export function FilterBarSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 card-elevated p-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        <div className="relative flex-1 max-w-md">
          <Shimmer className="h-[42px] w-full rounded-[var(--radius-sm)]" />
        </div>
        <Shimmer className="h-[42px] w-[200px] rounded-[var(--radius-sm)]" />
      </div>
      <Shimmer className="h-[42px] w-[260px] rounded-[var(--radius-sm)]" />
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
          rows={3}
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
          rows={3}
          cols={5}
          colWidths={["w-44", "flex-1", "w-28", "w-24", "w-16"]}
        />
      </div>
    </div>
  );
}

export function BarangayManagerSkeleton() {
  return (
    <div className="space-y-6 w-full" role="status" aria-label="Naglo-load ang mga barangay...">
      <span className="sr-only">Naglo-load ang mga barangay...</span>
      <PageHeaderSkeleton />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <FilterBarSkeleton />
      <TableSkeleton
        rows={8}
        cols={5}
        colWidths={["flex-1", "w-64", "w-24", "w-24", "w-48"]}
      />
    </div>
  );
}

export function OrdinanceManagerSkeleton() {
  return (
    <div className="space-y-6 w-full" role="status" aria-label="Naglo-load ang mga ordinansa...">
      <span className="sr-only">Naglo-load ang mga ordinansa...</span>
      <PageHeaderSkeleton />
      <div className="flex items-center justify-between gap-3 bg-[var(--bg-card)] p-4 rounded-[var(--radius-md)] border border-[var(--border-hairline)]">
        <div className="space-y-2">
          <Shimmer className="h-4 w-48" />
          <Shimmer className="h-3 w-64" />
        </div>
        <Shimmer className="h-11 w-48 rounded-[var(--radius-sm)]" />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-wrap gap-1 p-1 rounded-[var(--radius-sm)] bg-[var(--bg-canvas)] border border-[var(--border-hairline)] w-fit">
          <Shimmer className="h-[36px] w-[88px] rounded-[var(--radius-sm)]" />
          <Shimmer className="h-[36px] w-[100px] rounded-[var(--radius-sm)]" />
          <Shimmer className="h-[36px] w-[112px] rounded-[var(--radius-sm)]" />
          <Shimmer className="h-[36px] w-[84px] rounded-[var(--radius-sm)]" />
          <Shimmer className="h-[36px] w-[104px] rounded-[var(--radius-sm)]" />
        </div>
        <div className="flex-1">
          <Shimmer className="h-[44px] w-full rounded-[var(--radius-sm)]" />
        </div>
      </div>
      <TableSkeleton
        rows={8}
        cols={8}
        colWidths={["w-24", "flex-1", "w-20", "w-24", "w-32", "w-32", "w-24", "w-40"]}
      />
    </div>
  );
}

export function UserManagerSkeleton() {
  return (
    <div className="space-y-6 w-full" role="status" aria-label="Naglo-load ang mga opisyal...">
      <span className="sr-only">Naglo-load ang mga opisyal...</span>
      <PageHeaderSkeleton />
      <div className="flex items-center justify-between">
        <Shimmer className="h-5 w-32" />
        <Shimmer className="h-11 w-44 rounded-[var(--radius-sm)]" />
      </div>
      <TableSkeleton
        rows={8}
        cols={6}
        colWidths={["flex-1", "w-48", "w-32", "w-48", "w-32", "w-24"]}
      />
    </div>
  );
}

export function NewsManagerSkeleton() {
  return (
    <div className="space-y-6 w-full" role="status" aria-label="Naglo-load ang mga anunsyo...">
      <span className="sr-only">Naglo-load ang mga anunsyo...</span>
      <PageHeaderSkeleton />
      <div className="flex items-center justify-between">
        <Shimmer className="h-5 w-32" />
        <Shimmer className="h-10 w-48 rounded-[var(--radius-sm)]" />
      </div>
      <TableSkeleton
        rows={8}
        cols={5}
        colWidths={["flex-1", "w-32", "w-24", "w-32", "w-24"]}
      />
    </div>
  );
}

export function ReportsManagerSkeleton() {
  return (
    <div className="space-y-6 w-full" role="status" aria-label="Naglo-load ang mga ulat...">
      <span className="sr-only">Naglo-load ang mga ulat...</span>
      <PageHeaderSkeleton />
      <div className="flex items-center gap-1 p-1 rounded-[var(--radius-sm)] bg-[var(--bg-canvas)] border border-[var(--border-hairline)] w-fit">
        {Array.from({ length: 5 }).map((_, i) => (
          <Shimmer key={i} className="h-9 w-24 rounded-[var(--radius-sm)]" />
        ))}
      </div>
      <TableSkeleton
        rows={8}
        cols={6}
        colWidths={["w-40", "w-40", "flex-1", "w-32", "w-32", "w-32"]}
      />
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-8 w-full" role="status" aria-label="Naglo-load ang analytics...">
      <span className="sr-only">Naglo-load ang analytics...</span>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card-elevated p-4">
        <div className="space-y-2">
          <Shimmer className="h-5 w-64" />
          <Shimmer className="h-3 w-96" />
        </div>
        <div className="flex items-center gap-2">
          <Shimmer className="h-4 w-10" />
          <Shimmer className="h-9 w-32 rounded-[var(--radius-sm)]" />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-elevated p-5 lg:col-span-2 space-y-4">
          <Shimmer className="h-5 w-48" />
          <Shimmer className="h-4 w-64" />
          <Shimmer className="h-[280px] w-full rounded-[var(--radius-md)]" />
        </div>
        <div className="card-elevated p-5 space-y-4">
          <Shimmer className="h-5 w-48" />
          <Shimmer className="h-4 w-64" />
          <Shimmer className="h-[240px] w-full rounded-[var(--radius-md)]" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-elevated p-5 lg:col-span-2 space-y-4">
          <Shimmer className="h-5 w-48" />
          <Shimmer className="h-4 w-64" />
          <Shimmer className="h-[300px] w-full rounded-[var(--radius-md)]" />
        </div>
        <div className="card-elevated p-5 space-y-4">
          <Shimmer className="h-5 w-48" />
          <Shimmer className="h-4 w-64" />
          <Shimmer className="h-[280px] w-full rounded-[var(--radius-md)]" />
        </div>
      </div>
      <div className="card-elevated p-5 space-y-4">
        <Shimmer className="h-5 w-48" />
        <Shimmer className="h-4 w-64" />
        <Shimmer className="h-[260px] w-full rounded-[var(--radius-md)]" />
      </div>
    </div>
  );
}

export function BarangayOrdinanceManagerSkeleton() {
  return (
    <div className="space-y-6 w-full" role="status" aria-label="Naglo-load ang mga ordinansa...">
      <span className="sr-only">Naglo-load ang mga ordinansa...</span>
      <PageHeaderSkeleton />
      <div className="flex items-center justify-end">
        <Shimmer className="h-11 w-56 rounded-[var(--radius-sm)]" />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-wrap gap-1 p-1 rounded-[var(--radius-sm)] bg-[var(--bg-canvas)] border border-[var(--border-hairline)] w-fit">
          <Shimmer className="h-[36px] w-[88px] rounded-[var(--radius-sm)]" />
          <Shimmer className="h-[36px] w-[100px] rounded-[var(--radius-sm)]" />
          <Shimmer className="h-[36px] w-[112px] rounded-[var(--radius-sm)]" />
          <Shimmer className="h-[36px] w-[84px] rounded-[var(--radius-sm)]" />
          <Shimmer className="h-[36px] w-[104px] rounded-[var(--radius-sm)]" />
        </div>
        <div className="flex-1">
          <Shimmer className="h-[44px] w-full rounded-[var(--radius-sm)]" />
        </div>
      </div>
      <TableSkeleton
        rows={8}
        cols={5}
        colWidths={["w-24", "flex-1", "w-32", "w-40", "w-32"]}
      />
    </div>
  );
}

export function BarangayReportsManagerSkeleton() {
  return (
    <div className="space-y-6 w-full" role="status" aria-label="Naglo-load ang mga ulat...">
      <span className="sr-only">Naglo-load ang mga ulat...</span>
      <PageHeaderSkeleton />
      <div className="flex items-center gap-1 p-1 rounded-[var(--radius-sm)] bg-[var(--bg-canvas)] border border-[var(--border-hairline)] w-fit">
        {Array.from({ length: 5 }).map((_, i) => (
          <Shimmer key={i} className="h-9 w-24 rounded-[var(--radius-sm)]" />
        ))}
      </div>
      <TableSkeleton
        rows={8}
        cols={6}
        colWidths={["w-32", "flex-1", "w-32", "w-32", "w-32", "w-32"]}
      />
    </div>
  );
}

