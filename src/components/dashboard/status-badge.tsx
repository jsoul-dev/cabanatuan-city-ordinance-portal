/**
 * StatusBadge — always uses SVG Icon + Text + Color (never color alone).
 * A11Y: SC 1.4.1 — information not conveyed by color alone.
 */

import React from "react";
import {
  FileEditIcon,
  ClockIcon,
  CheckCircle2Icon,
  XCircleIcon,
  AlertTriangleIcon,
  ShieldCheckIcon,
  UsersIcon,
  Building2Icon,
  FileTextIcon,
} from "./icons";

type OrdinanceStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
type ReportStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "DISMISSED";
type UserRole = "LGU_ADMIN" | "CAPTAIN" | "SECRETARY" | "KAGAWAD" | "CITIZEN";

type StatusBadgeProps =
  | { type: "ordinance"; status: OrdinanceStatus }
  | { type: "report"; status: ReportStatus }
  | { type: "role"; status: UserRole }
  | { type: "ordinanceType"; status: "BARANGAY" | "CITY" };

const ordinanceConfig: Record<
  OrdinanceStatus,
  { icon: React.FC<{ size?: number; className?: string }>; label: string; className: string }
> = {
  DRAFT: {
    icon: FileEditIcon,
    label: "Draft",
    className: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700",
  },
  PENDING: {
    icon: ClockIcon,
    label: "Pending",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50",
  },
  APPROVED: {
    icon: CheckCircle2Icon,
    label: "Approved",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50",
  },
  REJECTED: {
    icon: XCircleIcon,
    label: "Rejected",
    className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-300 dark:border-red-700/50",
  },
};

const reportConfig: Record<
  ReportStatus,
  { icon: React.FC<{ size?: number; className?: string }>; label: string; className: string }
> = {
  NEW: {
    icon: AlertTriangleIcon,
    label: "New",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-300 dark:border-blue-700/50",
  },
  IN_PROGRESS: {
    icon: ClockIcon,
    label: "In Progress",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50",
  },
  RESOLVED: {
    icon: CheckCircle2Icon,
    label: "Resolved",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50",
  },
  DISMISSED: {
    icon: XCircleIcon,
    label: "Dismissed",
    className: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700",
  },
};

const roleConfig: Record<
  UserRole,
  { icon: React.FC<{ size?: number; className?: string }>; label: string; className: string }
> = {
  LGU_ADMIN: {
    icon: ShieldCheckIcon,
    label: "LGU Admin",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50",
  },
  CAPTAIN: {
    icon: ShieldCheckIcon,
    label: "Captain",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50",
  },
  SECRETARY: {
    icon: FileTextIcon,
    label: "Secretary",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-300 dark:border-blue-700/50",
  },
  KAGAWAD: {
    icon: UsersIcon,
    label: "Kagawad",
    className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700/50",
  },
  CITIZEN: {
    icon: UsersIcon,
    label: "Citizen",
    className: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700",
  },
};

const ordinanceTypeConfig: Record<
  "BARANGAY" | "CITY",
  { icon: React.FC<{ size?: number; className?: string }>; label: string; className: string }
> = {
  BARANGAY: {
    icon: Building2Icon,
    label: "Barangay",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50",
  },
  CITY: {
    icon: Building2Icon,
    label: "City",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-300 dark:border-blue-700/50",
  },
};

export function StatusBadge(props: StatusBadgeProps) {
  let config: {
    icon: React.FC<{ size?: number; className?: string }>;
    label: string;
    className: string;
  };

  if (props.type === "ordinance") config = ordinanceConfig[props.status];
  else if (props.type === "report") config = reportConfig[props.status];
  else if (props.type === "role") config = roleConfig[props.status];
  else config = ordinanceTypeConfig[props.status];

  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
      aria-label={config.label}
    >
      <span aria-hidden="true" className="flex-shrink-0">
        <IconComponent size={13} />
      </span>
      {config.label}
    </span>
  );
}
