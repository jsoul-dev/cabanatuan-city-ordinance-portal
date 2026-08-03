import { clsx } from "clsx";

/**
 * Skeleton loader — pulse animation placeholder.
 *
 * A11Y: Uses aria-busy="true" on the container and aria-label
 * to announce loading state to screen readers.
 */

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-[var(--radius-sm)]",
        "bg-[var(--border-hairline)]",
        className
      )}
      aria-busy="true"
      aria-label="Naglo-load..."
    />
  );
}

export { Skeleton };
