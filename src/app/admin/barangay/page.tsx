import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getBarangayOverviewStats, getBarangayRecentOrdinances, getBarangayReports } from "@/lib/dashboard-queries";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";

export const metadata: Metadata = {
  title: "Barangay Dashboard — Cabanatuan City Ordinance Portal",
  description: "Barangay official dashboard for ordinance and report management.",
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("fil-PH", { month: "short", day: "numeric", year: "numeric" });
}

const ROLE_LABELS: Record<string, { title: string; icon: string }> = {
  CAPTAIN:   { title: "Punong Barangay",    icon: "🛡️" },
  SECRETARY: { title: "Kalihim ng Barangay", icon: "📋" },
  KAGAWAD:   { title: "Kagawad",             icon: "⚖️" },
};

export default async function BarangayOverviewPage() {
  const user = await getCurrentUser();

  if (!user?.barangayId) {
    redirect("/login");
  }

  const [stats, recentOrdinances, recentReports] = await Promise.all([
    getBarangayOverviewStats(user.barangayId),
    getBarangayRecentOrdinances(user.barangayId),
    getBarangayReports(user.barangayId),
  ]);

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Magandang umaga" :
    now.getHours() < 17 ? "Magandang hapon" : "Magandang gabi";

  const roleInfo = ROLE_LABELS[user.role] ?? { title: user.role, icon: "👤" };
  const canSubmit = user.role === "CAPTAIN" || user.role === "SECRETARY";

  return (
    <div className="space-y-8 max-w-[1400px]">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--text-mute)]">{greeting},</p>
          <h1 className="text-3xl font-bold text-[var(--text-ink)] tracking-tight">
            {user.name}
          </h1>
          <p className="text-sm text-[var(--text-body)] mt-1">
            {roleInfo.icon} {roleInfo.title} · {user.barangay?.name ?? "Barangay"}
          </p>
        </div>
        {canSubmit && (
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/barangay/ordinances"
              className="inline-flex items-center gap-2 min-h-[44px] rounded-[var(--radius-sm)] bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-primary)]/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
            >
              📜 Magsumite ng Ordinansa
            </Link>
            <Link
              href="/report"
              className="inline-flex items-center gap-2 min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-card)] px-4 py-2 text-sm font-semibold text-[var(--text-ink)] hover:border-[var(--accent-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
            >
              📣 Mag-ulat sa Komunidad
            </Link>
          </div>
        )}
      </div>

      {/* Stats */}
      <section aria-labelledby="brgy-stats-heading">
        <h2 id="brgy-stats-heading" className="text-mono-eyebrow text-[var(--text-mute)] mb-4">
          Buod ng Barangay
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon="📜"
            label="Kabuuang Ordinansa"
            value={stats.ordinances.total}
            subtitle={`${stats.ordinances.approved} naaprubahan`}
            accent="green"
          />
          <StatCard
            icon="⏳"
            label="Nakabimbin (Pending)"
            value={stats.ordinances.pending}
            subtitle="Naghihintay sa LGU review"
            accent="amber"
          />
          <StatCard
            icon="📣"
            label="Mga Ulat ng Komunidad"
            value={stats.reports.total}
            subtitle={`${stats.reports.new} bagong ulat`}
            accent="blue"
          />
          <StatCard
            icon="✅"
            label="Nalutas na Ulat"
            value={stats.reports.resolved}
            subtitle={`${stats.reports.inProgress} isinasagawa`}
            accent="gold"
          />
        </div>
      </section>

      {/* Ordinance Status Breakdown */}
      <section aria-labelledby="ord-breakdown-heading">
        <h2 id="ord-breakdown-heading" className="text-mono-eyebrow text-[var(--text-mute)] mb-4">
          Status ng mga Ordinansa
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Draft", count: stats.ordinances.draft, color: "bg-neutral-100 dark:bg-neutral-800 text-[var(--text-ink)]" },
            { label: "Pending", count: stats.ordinances.pending, color: "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300" },
            { label: "Approved", count: stats.ordinances.approved, color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300" },
            { label: "Rejected", count: stats.ordinances.rejected, color: "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300" },
          ].map((item) => (
            <div key={item.label} className={`rounded-[var(--radius-md)] p-4 ${item.color}`}>
              <p className="text-2xl font-bold">{item.count}</p>
              <p className="text-xs font-semibold mt-1 opacity-80">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Ordinances */}
      <section aria-labelledby="recent-ord-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="recent-ord-heading" className="text-mono-eyebrow text-[var(--text-mute)]">
            Pinakabagong Mga Ordinansa
          </h2>
          <Link
            href="/admin/barangay/ordinances"
            className="text-xs font-semibold text-[var(--accent-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded"
          >
            Tingnan lahat →
          </Link>
        </div>
        <div className="card-elevated overflow-hidden">
          {recentOrdinances.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-4xl mb-3" aria-hidden="true">📭</p>
              <p className="text-sm font-semibold text-[var(--text-ink)]">Wala pang ordinansa.</p>
              {canSubmit && (
                <Link href="/admin/barangay/ordinances" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent-primary)] hover:underline">
                  Magsumite ng unang ordinansa →
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Pinakabagong mga ordinansa">
                <caption className="sr-only">Listahan ng mga pinakabagong ordinansa ng barangay</caption>
                <thead>
                  <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)]">
                    {["Res. No.", "Pamagat", "Status", "Isinumite ni", "Petsa"].map((h) => (
                      <th key={h} scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-mute)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-hairline)]">
                  {recentOrdinances.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[var(--bg-canvas)] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-mute)]">{ord.resolutionNumber}</td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-medium text-[var(--text-ink)] line-clamp-2">{ord.title}</p>
                        {ord.rejectedReason && (
                          <p className="text-[10px] text-red-500 mt-0.5 italic">Dahilan: {ord.rejectedReason}</p>
                        )}
                      </td>
                      <td className="px-4 py-3"><StatusBadge type="ordinance" status={ord.status} /></td>
                      <td className="px-4 py-3 text-sm text-[var(--text-body)]">{ord.submittedBy.name}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-mute)]">{formatDate(ord.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Recent Reports */}
      <section aria-labelledby="recent-reports-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="recent-reports-heading" className="text-mono-eyebrow text-[var(--text-mute)]">
            Pinakabagong Mga Ulat
          </h2>
          <Link
            href="/admin/barangay/reports"
            className="text-xs font-semibold text-[var(--accent-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded"
          >
            Tingnan lahat →
          </Link>
        </div>
        <div className="card-elevated overflow-hidden">
          {recentReports.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-4xl mb-3" aria-hidden="true">📭</p>
              <p className="text-sm font-semibold text-[var(--text-ink)]">Wala pang ulat ng komunidad.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Mga ulat ng komunidad">
                <caption className="sr-only">Pinakabagong mga ulat mula sa komunidad ng barangay</caption>
                <thead>
                  <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)]">
                    {["Uri", "Paglalarawan", "Status", "Nagsampa", "Petsa"].map((h) => (
                      <th key={h} scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-mute)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-hairline)]">
                  {recentReports.slice(0, 8).map((report) => (
                    <tr key={report.id} className="hover:bg-[var(--bg-canvas)] transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-[var(--text-ink)]">
                        {report.type === "TRASH_BURNING" ? "🔥 Pagsusunog" :
                         report.type === "NOISE" ? "🔊 Ingay" :
                         report.type === "ROAD_OBSTRUCTION" ? "🚧 Harang" : "📋 Iba pa"}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-sm text-[var(--text-body)] line-clamp-2">{report.description}</p>
                      </td>
                      <td className="px-4 py-3"><StatusBadge type="report" status={report.status} /></td>
                      <td className="px-4 py-3 text-xs text-[var(--text-mute)]">
                        {report.isAnonymous ? <span className="italic">Anonymous</span> : report.contactName ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-mute)] whitespace-nowrap">{formatDate(report.submittedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
