import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getLguOverviewStats, getLguPendingOrdinances, getLguAllReports } from "@/lib/dashboard-queries";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";

export const metadata: Metadata = {
  title: "LGU Admin Overview — Cabanatuan City Ordinance Portal",
  description: "City-wide dashboard for the LGU Super Admin.",
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("fil-PH", { month: "short", day: "numeric", year: "numeric" });
}

export default async function LguOverviewPage() {
  const [user, stats, pending, recentReports] = await Promise.all([
    getCurrentUser(),
    getLguOverviewStats(),
    getLguPendingOrdinances(),
    getLguAllReports(),
  ]);

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Magandang umaga" :
    now.getHours() < 17 ? "Magandang hapon" : "Magandang gabi";

  return (
    <div className="space-y-8 max-w-[1400px]">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--text-mute)]">{greeting},</p>
          <h1 className="text-3xl font-bold text-[var(--text-ink)] tracking-tight">
            {user?.name ?? "Administrator"}
          </h1>
          <p className="text-sm text-[var(--text-body)] mt-1">
            🏛️ LGU Super Admin · Lungsod ng Cabanatuan
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/lgu/ordinances"
            className="inline-flex items-center gap-2 min-h-[44px] rounded-[var(--radius-sm)] bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-primary)]/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
          >
            📜 Pamahalaan ang Ordinansa
          </Link>
          <Link
            href="/admin/lgu/news"
            className="inline-flex items-center gap-2 min-h-[44px] rounded-[var(--radius-sm)] border border-[var(--border-hairline)] bg-[var(--bg-card)] px-4 py-2 text-sm font-semibold text-[var(--text-ink)] hover:border-[var(--accent-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
          >
            📰 Mag-post ng Balita
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="text-mono-eyebrow text-[var(--text-mute)] mb-4">
          Buod ng Lungsod
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon="📜"
            label="Kabuuang Ordinansa"
            value={stats.ordinances.total}
            subtitle={`${stats.ordinances.approved} naaprubahan · ${stats.ordinances.pending} nakabimbin`}
            accent="green"
          />
          <StatCard
            icon="⏳"
            label="Nakabimbin (Pending)"
            value={stats.ordinances.pending}
            subtitle="Nangangailangan ng pagsusuri"
            accent="amber"
          />
          <StatCard
            icon="🏘️"
            label="Mga Barangay"
            value={stats.barangays}
            subtitle="Mga rehistradong barangay"
            accent="blue"
          />
          <StatCard
            icon="👥"
            label="Mga Opisyal"
            value={stats.officials}
            subtitle={`${stats.reports.new} bagong ulat ng komunidad`}
            accent="gold"
          />
        </div>
      </section>

      {/* Ordinance Status Summary */}
      <section aria-labelledby="ord-summary-heading">
        <h2 id="ord-summary-heading" className="text-mono-eyebrow text-[var(--text-mute)] mb-4">
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

      {/* Pending Ordinances Table */}
      <section aria-labelledby="pending-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="pending-heading" className="text-mono-eyebrow text-[var(--text-mute)]">
            Nakabimbing Ordinansa para sa Pagsusuri
          </h2>
          <Link
            href="/admin/lgu/ordinances?status=PENDING"
            className="text-xs font-semibold text-[var(--accent-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded"
          >
            Tingnan lahat →
          </Link>
        </div>
        <div className="card-elevated overflow-hidden">
          {pending.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-4xl mb-3" aria-hidden="true">✅</p>
              <p className="text-sm font-semibold text-[var(--text-ink)]">Wala pang nakabimbing ordinansa.</p>
              <p className="text-xs text-[var(--text-mute)] mt-1">Lahat ng ordinansa ay nasuri na.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Nakabimbing mga ordinansa">
                <caption className="sr-only">Listahan ng mga ordinansang naghihintay ng pagsusuri ng LGU</caption>
                <thead>
                  <tr className="border-b border-[var(--border-hairline)] text-[var(--text-mute)]">
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Res. No.</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Pamagat</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Barangay</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Isinumite ni</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Petsa</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">Aksyon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-hairline)]">
                  {pending.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[var(--bg-canvas)] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-mute)]">{ord.resolutionNumber}</td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-medium text-[var(--text-ink)] line-clamp-2">{ord.title}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text-body)]">
                        {ord.barangay?.name ?? <span className="text-[var(--text-mute)]">City-wide</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text-body)]">{ord.submittedBy.name}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-mute)] whitespace-nowrap">{formatDate(ord.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/lgu/ordinances?review=${ord.id}`}
                          className="inline-flex items-center gap-1 min-h-[36px] rounded-[var(--radius-sm)] bg-[var(--accent-primary)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                        >
                          Suriin →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Recent Community Reports */}
      <section aria-labelledby="reports-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="reports-heading" className="text-mono-eyebrow text-[var(--text-mute)]">
            Pinakabagong Ulat ng Komunidad
          </h2>
          <Link
            href="/admin/lgu/reports"
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
                <caption className="sr-only">Pinakabagong mga ulat mula sa komunidad</caption>
                <thead>
                  <tr className="border-b border-[var(--border-hairline)] text-[var(--text-mute)]">
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Uri</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Barangay</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Status</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">Petsa</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">Aksyon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-hairline)]">
                  {recentReports.slice(0, 8).map((report) => (
                    <tr key={report.id} className="hover:bg-[var(--bg-canvas)] transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium text-[var(--text-ink)]">
                          {report.type === "TRASH_BURNING" ? "🔥 Pagsusunog" :
                           report.type === "NOISE" ? "🔊 Ingay" :
                           report.type === "ROAD_OBSTRUCTION" ? "🚧 Harang" : "📋 Iba pa"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text-body)]">{report.barangay.name}</td>
                      <td className="px-4 py-3">
                        <StatusBadge type="report" status={report.status} />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-mute)] whitespace-nowrap">{formatDate(report.submittedAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/lgu/reports`}
                          className="text-xs font-semibold text-[var(--accent-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded min-h-[44px] inline-flex items-center"
                        >
                          Tingnan →
                        </Link>
                      </td>
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
