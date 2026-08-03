import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  FileTextIcon,
  ClockIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
} from "@/components/dashboard/icons";

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("fil-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BarangayOverviewPage() {
  const user = await getCurrentUser();
  if (!user || user.role === "LGU_ADMIN") {
    redirect("/login");
  }
  if (!user.barangay) {
    return (
      <div className="card-elevated p-8 text-center max-w-lg mx-auto my-12">
        <AlertTriangleIcon size={36} className="text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[var(--text-ink)]">
          Walang Nakatalagang Barangay
        </h2>
        <p className="text-sm text-[var(--text-body)] mt-2">
          Ang iyong account ay hindi pa nakatalaga sa isang barangay.
          Makipag-ugnayan sa LGU Admin.
        </p>
      </div>
    );
  }

  const barangayId = user.barangay.id;
  const canSubmit = user.role === "CAPTAIN" || user.role === "SECRETARY";

  const [
    totalOrdinances,
    pendingOrdinances,
    approvedOrdinances,
    rejectedOrdinances,
    draftOrdinances,
    totalReports,
    newReports,
    inProgressReports,
    resolvedReports,
    recentOrdinances,
    recentReports,
  ] = await Promise.all([
    prisma.ordinance.count({ where: { barangayId } }),
    prisma.ordinance.count({ where: { barangayId, status: "PENDING" } }),
    prisma.ordinance.count({ where: { barangayId, status: "APPROVED" } }),
    prisma.ordinance.count({ where: { barangayId, status: "REJECTED" } }),
    prisma.ordinance.count({ where: { barangayId, status: "DRAFT" } }),
    prisma.report.count({ where: { barangayId } }),
    prisma.report.count({ where: { barangayId, status: "NEW" } }),
    prisma.report.count({
      where: { barangayId, status: "IN_PROGRESS" },
    }),
    prisma.report.count({
      where: { barangayId, status: "RESOLVED" },
    }),
    prisma.ordinance.findMany({
      where: { barangayId },
      include: {
        submittedBy: { select: { name: true } },
        reviewedBy: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.report.findMany({
      where: { barangayId },
      orderBy: { submittedAt: "desc" },
      take: 6,
    }),
  ]);

  const stats = {
    ordinances: {
      total: totalOrdinances,
      pending: pendingOrdinances,
      approved: approvedOrdinances,
      rejected: rejectedOrdinances,
      draft: draftOrdinances,
    },
    reports: {
      total: totalReports,
      new: newReports,
      inProgress: inProgressReports,
      resolved: resolvedReports,
    },
  };

  return (
    <div className="space-y-8">
      {/* Barangay Banner */}
      <div className="rounded-[var(--radius-lg)] border border-emerald-500/20 bg-gradient-to-r from-emerald-900/30 via-[var(--bg-card)] to-[var(--bg-card)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Barangay Admin Portal
            </span>
            <h1 className="mt-2 text-2xl font-bold text-[var(--text-ink)]">
              Barangay {user.barangay.name}
            </h1>
            <p className="text-sm text-[var(--text-body)]">
              Cabanatuan City, Nueva Ecija · Pamahalaan ang mga ordinansa at
              ulat ng inyong komunidad.
            </p>
          </div>
          {canSubmit && (
            <Link
              href="/admin/barangay/ordinances"
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
            >
              + Magsumite ng Ordinansa
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <section aria-labelledby="brgy-stats-heading">
        <h2
          id="brgy-stats-heading"
          className="text-mono-eyebrow text-[var(--text-mute)] mb-4"
        >
          Buod ng Barangay
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={<FileTextIcon size={22} />}
            label="Kabuuang Ordinansa"
            value={stats.ordinances.total}
            subtitle={`${stats.ordinances.approved} naaprubahan`}
            accent="green"
          />
          <StatCard
            icon={<ClockIcon size={22} />}
            label="Nakabimbin (Pending)"
            value={stats.ordinances.pending}
            subtitle="Naghihintay sa LGU review"
            accent="amber"
          />
          <StatCard
            icon={<AlertTriangleIcon size={22} />}
            label="Mga Ulat ng Komunidad"
            value={stats.reports.total}
            subtitle={`${stats.reports.new} bagong ulat`}
            accent="blue"
          />
          <StatCard
            icon={<CheckCircle2Icon size={22} />}
            label="Nalutas na Ulat"
            value={stats.reports.resolved}
            subtitle={`${stats.reports.inProgress} isinasagawa`}
            accent="gold"
          />
        </div>
      </section>

      {/* Ordinance Status Breakdown */}
      <section aria-labelledby="ord-breakdown-heading">
        <h2
          id="ord-breakdown-heading"
          className="text-mono-eyebrow text-[var(--text-mute)] mb-4"
        >
          Status ng mga Ordinansa
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Draft",
              count: stats.ordinances.draft,
              color:
                "bg-neutral-100 dark:bg-neutral-800 text-[var(--text-ink)] border border-neutral-200 dark:border-neutral-700",
            },
            {
              label: "Pending",
              count: stats.ordinances.pending,
              color:
                "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
            },
            {
              label: "Approved",
              count: stats.ordinances.approved,
              color:
                "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
            },
            {
              label: "Rejected",
              count: stats.ordinances.rejected,
              color:
                "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-[var(--radius-md)] p-4 ${item.color}`}
            >
              <p className="text-2xl font-bold">{item.count}</p>
              <p className="text-xs font-semibold mt-1 opacity-80">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Ordinances */}
      <section aria-labelledby="recent-ord-heading">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="recent-ord-heading"
            className="text-mono-eyebrow text-[var(--text-mute)]"
          >
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
              <AlertTriangleIcon
                size={36}
                className="text-amber-500 mx-auto mb-3"
              />
              <p className="text-sm font-semibold text-[var(--text-ink)]">
                Wala pang ordinansa.
              </p>
              {canSubmit && (
                <Link
                  href="/admin/barangay/ordinances"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent-primary)] hover:underline"
                >
                  Magsumite ng unang ordinansa →
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm"
                aria-label="Pinakabagong mga ordinansa"
              >
                <caption className="sr-only">
                  Pinakabagong isinumiteng mga ordinansa ng inyong barangay
                </caption>
                <thead>
                  <tr className="border-b border-[var(--border-hairline)] text-[var(--text-mute)]">
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    >
                      Res. No.
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    >
                      Pamagat
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    >
                      Petsa
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide"
                    >
                      Aksyon
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-hairline)]">
                  {recentOrdinances.map((ord) => (
                    <tr
                      key={ord.id}
                      className="hover:bg-[var(--bg-canvas)] transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-[var(--text-mute)]">
                        {ord.resolutionNumber}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-medium text-[var(--text-ink)] line-clamp-2">
                          {ord.title}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge type="ordinance" status={ord.status} />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-mute)] whitespace-nowrap">
                        {formatDate(ord.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/barangay/ordinances`}
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

      {/* Recent Community Reports */}
      <section aria-labelledby="reports-heading">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="reports-heading"
            className="text-mono-eyebrow text-[var(--text-mute)]"
          >
            Pinakabagong Ulat ng Komunidad
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
              <AlertTriangleIcon
                size={36}
                className="text-amber-500 mx-auto mb-3"
              />
              <p className="text-sm font-semibold text-[var(--text-ink)]">
                Wala pang ulat ng komunidad.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm"
                aria-label="Mga ulat ng komunidad"
              >
                <caption className="sr-only">
                  Pinakabagong mga ulat ng inyong barangay
                </caption>
                <thead>
                  <tr className="border-b border-[var(--border-hairline)] text-[var(--text-mute)]">
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    >
                      Uri
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    >
                      Nagsusumite
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    >
                      Petsa
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide"
                    >
                      Aksyon
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-hairline)]">
                  {recentReports.slice(0, 8).map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-[var(--bg-canvas)] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-[var(--text-ink)]">
                          {report.type === "TRASH_BURNING"
                            ? "Pagsusunog ng Basura"
                            : report.type === "NOISE"
                            ? "Labis na Ingay"
                            : report.type === "ROAD_OBSTRUCTION"
                            ? "Harang sa Kalsada"
                            : "Ibang Paglabag"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text-body)]">
                        {report.isAnonymous || !report.contactName
                          ? "Anonymous"
                          : report.contactName}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge type="report" status={report.status} />
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--text-mute)] whitespace-nowrap">
                        {formatDate(report.submittedAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/barangay/reports`}
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
