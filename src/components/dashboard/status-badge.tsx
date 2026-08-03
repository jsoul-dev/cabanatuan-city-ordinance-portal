/**
 * StatusBadge — always uses Icon + Text + Color (never color alone).
 * A11Y: SC 1.4.1 — information not conveyed by color alone.
 */

type OrdinanceStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
type ReportStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "DISMISSED";
type UserRole = "LGU_ADMIN" | "CAPTAIN" | "SECRETARY" | "KAGAWAD" | "CITIZEN";

type StatusBadgeProps =
  | { type: "ordinance"; status: OrdinanceStatus }
  | { type: "report"; status: ReportStatus }
  | { type: "role"; status: UserRole }
  | { type: "ordinanceType"; status: "BARANGAY" | "CITY" };

const ordinanceConfig: Record<OrdinanceStatus, { icon: string; label: string; className: string }> = {
  DRAFT:    { icon: "✏️", label: "Draft",    className: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300" },
  PENDING:  { icon: "⏳", label: "Pending",  className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" },
  APPROVED: { icon: "✅", label: "Approved", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" },
  REJECTED: { icon: "❌", label: "Rejected", className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" },
};

const reportConfig: Record<ReportStatus, { icon: string; label: string; className: string }> = {
  NEW:         { icon: "🆕", label: "New",         className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" },
  IN_PROGRESS: { icon: "🔄", label: "In Progress", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" },
  RESOLVED:    { icon: "✅", label: "Resolved",    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" },
  DISMISSED:   { icon: "🚫", label: "Dismissed",   className: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300" },
};

const roleConfig: Record<UserRole, { icon: string; label: string; className: string }> = {
  LGU_ADMIN: { icon: "🏛️", label: "LGU Admin",   className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" },
  CAPTAIN:   { icon: "🛡️", label: "Captain",     className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" },
  SECRETARY: { icon: "📋", label: "Secretary",   className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" },
  KAGAWAD:   { icon: "⚖️", label: "Kagawad",     className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300" },
  CITIZEN:   { icon: "👤", label: "Citizen",     className: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300" },
};

const ordinanceTypeConfig: Record<"BARANGAY" | "CITY", { icon: string; label: string; className: string }> = {
  BARANGAY: { icon: "🏘️", label: "Barangay",  className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" },
  CITY:     { icon: "🏙️", label: "City",      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" },
};

export function StatusBadge(props: StatusBadgeProps) {
  let config: { icon: string; label: string; className: string };

  if (props.type === "ordinance") config = ordinanceConfig[props.status];
  else if (props.type === "report") config = reportConfig[props.status];
  else if (props.type === "role") config = roleConfig[props.status];
  else config = ordinanceTypeConfig[props.status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
      aria-label={config.label}
    >
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  );
}
