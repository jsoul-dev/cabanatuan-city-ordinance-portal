import React from "react";
import { ReportTable } from "./report-table";

interface Column {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  width?: string;
}

interface ReportGroupProps {
  /** Group heading text (e.g., "JANUARY 2026", "Barangay Bitas") */
  heading: string;
  /** Optional sub-label (e.g., date range) */
  subLabel?: string;
  /** Table columns for this group's rows */
  columns: Column[];
  /** Data rows for this group */
  rows: Record<string, React.ReactNode>[];
  /** Color variant for the group heading */
  variant?: "green" | "blue" | "amber";
}

const variantStyles = {
  green: "bg-[#1a5632] text-white",
  blue: "bg-[#1a4a6b] text-white",
  amber: "bg-[#6b5a1a] text-white",
};

/**
 * A grouped section in a formal report with colored heading,
 * table of records, and subtotal.
 */
export function ReportGroup({
  heading,
  subLabel,
  columns,
  rows,
  variant = "green",
}: ReportGroupProps) {
  return (
    <div className="mb-5 report-group" style={{ breakInside: "avoid" }}>
      {/* Group Heading */}
      <div
        className={`${variantStyles[variant]} px-3 py-1.5 rounded-t-sm`}
      >
        <p className="text-xs font-bold uppercase tracking-wide">
          {heading}
        </p>
        {subLabel && (
          <p className="text-[10px] opacity-80">{subLabel}</p>
        )}
      </div>

      {/* Group Table */}
      <ReportTable columns={columns} rows={rows} />

      {/* Subtotal */}
      <div className="flex justify-end px-2 py-1.5 text-[10px] text-gray-600 italic">
        Subtotal ({heading}): {rows.length}
      </div>
    </div>
  );
}

/**
 * Grand total row shown at the bottom of grouped reports.
 */
export function ReportGrandTotal({
  items,
}: {
  items: { label: string; value: number }[];
}) {
  return (
    <div className="mt-4 border-t-2 border-gray-800 pt-3 text-center">
      <p className="text-sm font-bold text-gray-900">
        {items.map((item, i) => (
          <span key={item.label}>
            {i > 0 && (
              <span className="mx-2 text-gray-400">|</span>
            )}
            {item.label}: {item.value}
          </span>
        ))}
      </p>
    </div>
  );
}
