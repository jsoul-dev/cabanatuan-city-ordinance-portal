import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  subtitle?: string;
  accent?: "green" | "gold" | "blue" | "red" | "amber";
}

const accentMap: Record<string, { border: string; iconBg: string; valueColor: string }> = {
  green: {
    border: "border-l-[var(--accent-primary)]",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    valueColor: "text-[var(--text-ink)]",
  },
  gold: {
    border: "border-l-[var(--accent-gold)]",
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    valueColor: "text-[var(--text-ink)]",
  },
  blue: {
    border: "border-l-blue-500",
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    valueColor: "text-[var(--text-ink)]",
  },
  red: {
    border: "border-l-red-500",
    iconBg: "bg-red-500/10 text-red-600 dark:text-red-400",
    valueColor: "text-[var(--text-ink)]",
  },
  amber: {
    border: "border-l-amber-400",
    iconBg: "bg-amber-400/10 text-amber-500 dark:text-amber-300",
    valueColor: "text-[var(--text-ink)]",
  },
};

export function StatCard({ icon, label, value, subtitle, accent = "green" }: StatCardProps) {
  const style = accentMap[accent] ?? accentMap.green;

  return (
    <div
      className={`card-elevated border-l-4 ${style.border} p-5 flex items-start gap-4 min-h-[100px]`}
      aria-label={`${label}: ${value}`}
    >
      <div
        className={`flex-shrink-0 w-11 h-11 rounded-[var(--radius-sm)] flex items-center justify-center text-xl ${style.iconBg}`}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-mono-eyebrow text-[var(--text-mute)] mb-1 truncate">{label}</p>
        <p className={`text-3xl font-bold leading-none tracking-tight ${style.valueColor}`}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-[var(--text-mute)] mt-1.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
