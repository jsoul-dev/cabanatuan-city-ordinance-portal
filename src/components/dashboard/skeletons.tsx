/**
 * Reusable shimmer skeleton primitives for dashboard loading states.
 * These provide instant visual feedback while server components fetch data.
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

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="card-elevated overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 px-4 py-3 border-b border-[var(--border-hairline)]">
        {Array.from({ length: cols }).map((_, i) => (
          <Shimmer key={i} className="h-3 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex gap-4 px-4 py-4 border-b border-[var(--border-hairline)] last:border-b-0"
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Shimmer
              key={colIdx}
              className={`h-4 flex-1 ${colIdx === 0 ? "max-w-[80px]" : ""}`}
            />
          ))}
        </div>
      ))}
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

export function PageHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <Shimmer className="h-7 w-64" />
      <Shimmer className="h-4 w-96" />
    </div>
  );
}

export function OverviewLoadingSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-label="Naglo-load ang dashboard...">
      <span className="sr-only">Naglo-load ang dashboard...</span>
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      {/* Status breakdown */}
      <div className="space-y-4">
        <Shimmer className="h-3 w-40" />
        <StatusBreakdownSkeleton />
      </div>
      {/* Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Shimmer className="h-3 w-56" />
          <Shimmer className="h-3 w-24" />
        </div>
        <TableSkeleton rows={5} cols={5} />
      </div>
    </div>
  );
}

export function SubPageLoadingSkeleton() {
  return (
    <div className="space-y-6 max-w-[1400px]" role="status" aria-label="Naglo-load...">
      <span className="sr-only">Naglo-load...</span>
      <PageHeaderSkeleton />
      <TableSkeleton rows={8} cols={5} />
    </div>
  );
}
