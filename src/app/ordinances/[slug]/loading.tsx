import { Navbar } from "@/components/layout/navbar";
import { ScrollToTop } from "@/components/scroll-to-top";

export default function LoadingOrdinance() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 py-8 bg-[var(--bg-canvas)] text-[var(--text-ink)] transition-colors duration-300 min-h-screen">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Skeleton */}
          <div className="mb-5 flex items-center space-x-2">
            <div className="h-4 w-12 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded"></div>
            <span className="text-neutral-400 dark:text-neutral-500">/</span>
            <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded"></div>
            <span className="text-neutral-400 dark:text-neutral-500">/</span>
            <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded"></div>
          </div>

          {/* Hero Header Card Skeleton */}
          <div className="mb-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0d1310] p-5 sm:p-7 shadow-xl">
            {/* Top Status & Badge Row Skeleton */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-24 bg-emerald-100 dark:bg-emerald-500/20 animate-pulse rounded-full"></div>
                <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-full"></div>
              </div>
              <div className="h-6 w-28 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-md"></div>
            </div>

            {/* Title Skeleton */}
            <div className="space-y-3 mb-6">
              <div className="h-8 w-3/4 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-md"></div>
              <div className="h-8 w-1/2 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-md"></div>
            </div>

            {/* Executive Summary Box Skeleton */}
            <div className="mb-6 rounded-r-xl border-l-4 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/5 p-4 h-24 animate-pulse">
            </div>

            {/* Ordinance Label Skeleton */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 px-3 py-1.5">
              <div className="h-3 w-4 bg-neutral-300 dark:bg-neutral-700 animate-pulse rounded-sm"></div>
              <div className="h-3 w-48 bg-neutral-300 dark:bg-neutral-700 animate-pulse rounded-sm"></div>
            </div>

            {/* Metadata Bar Skeleton */}
            <div className="flex flex-wrap items-center gap-5 mb-6 mt-1">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-neutral-300 dark:bg-neutral-700 animate-pulse rounded-sm"></div>
                <div className="h-4 w-40 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-md"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-neutral-300 dark:bg-neutral-700 animate-pulse rounded-sm"></div>
                <div className="h-4 w-48 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-md"></div>
              </div>
            </div>

            {/* Tags Skeleton */}
            <div className="flex gap-2">
              <div className="h-7 w-24 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-md"></div>
              <div className="h-7 w-32 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-md"></div>
              <div className="h-7 w-28 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-md"></div>
              <div className="h-7 w-20 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-md"></div>
              <div className="h-7 w-24 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-md"></div>
            </div>

            {/* Separator Skeleton */}
            <div className="border-t border-neutral-200 dark:border-white/10 my-5" />

            {/* Prominent Action Buttons Skeleton */}
            <div className="flex flex-wrap gap-3">
              <div className="h-11 w-[260px] bg-emerald-100 dark:bg-emerald-500/20 animate-pulse rounded-md"></div>
              <div className="h-11 w-[220px] bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-md"></div>
            </div>
          </div>

          {/* Loading Spinner */}
          <div className="flex flex-col items-center justify-center py-20 opacity-60">
            <svg
              className="w-12 h-12 text-emerald-500 animate-spin mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase animate-pulse">
              Kinukuha ang detalye...
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
