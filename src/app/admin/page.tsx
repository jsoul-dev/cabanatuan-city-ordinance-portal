import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Admin Dashboard - Cabanatuan City Law Portal",
  description: "LGU Official Dashboard overview and statistics.",
};

export default async function AdminDashboardPage() {
  const [
    totalOrdinances,
    approvedOrdinances,
    draftOrdinances,
    totalBarangays,
    totalNews,
    recentOrdinances,
  ] = await Promise.all([
    prisma.ordinance.count(),
    prisma.ordinance.count({ where: { status: "APPROVED" } }),
    prisma.ordinance.count({ where: { status: "DRAFT" } }),
    prisma.barangay.count(),
    prisma.newsItem.count(),
    prisma.ordinance.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        barangay: true,
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-[var(--accent-primary)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-[var(--text-mute)]">
              Kabuuang Ordinansa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[var(--text-ink)]">
              {totalOrdinances}
            </div>
            <p className="text-xs text-[var(--text-mute)] mt-1">
              {approvedOrdinances} Approved • {draftOrdinances} Draft
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-[var(--text-mute)]">
              Approved Ordinances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {approvedOrdinances}
            </div>
            <p className="text-xs text-[var(--text-mute)] mt-1">
              Nakapublish sa public portal
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-[var(--text-mute)]">
              Rehistradong Barangay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[var(--text-ink)]">
              {totalBarangays}
            </div>
            <p className="text-xs text-[var(--text-mute)] mt-1">
              Sa Lungsod ng Kabanatuan
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-[var(--text-mute)]">
              Mga Balita & Anunsyo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[var(--text-ink)]">
              {totalNews}
            </div>
            <p className="text-xs text-[var(--text-mute)] mt-1">
              Nakapaskil sa news feed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap items-center gap-4 rounded-[var(--radius-md)] bg-[var(--bg-card)] p-6 border border-[var(--border-hairline)]">
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-base font-semibold text-[var(--text-ink)]">
            Mabilisang Aksyon (Quick Actions)
          </h3>
          <p className="text-xs text-[var(--text-mute)]">
            Magdagdag ng bagong batas o anunsyo sa system
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/ordinances">
            <Button variant="primary" size="sm">
              + Magdagdag ng Ordinansa
            </Button>
          </Link>
          <Link href="/admin/news">
            <Button variant="secondary" size="sm">
              + Magdagdag ng Anunsyo
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Ordinances Table / List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pinakabagong Mga Ordinansa</CardTitle>
          <Link href="/admin/ordinances">
            <Button variant="ghost" size="sm">
              Tingnan Lahat →
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrdinances.length === 0 ? (
            <p className="text-sm text-[var(--text-mute)] py-4">
              Walang nakatalang ordinansa.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-hairline)] text-xs uppercase text-[var(--text-mute)]">
                    <th className="pb-3 font-semibold">Res. No.</th>
                    <th className="pb-3 font-semibold">Pamagat</th>
                    <th className="pb-3 font-semibold">Uri</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Aksyon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-hairline)]">
                  {recentOrdinances.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[var(--bg-canvas)]">
                      <td className="py-3 font-mono text-xs">
                        {ord.resolutionNumber}
                      </td>
                      <td className="py-3 font-medium text-[var(--text-ink)] max-w-sm truncate">
                        {ord.title}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={ord.type === "CITY" ? "city" : "barangay"}
                        >
                          {ord.type === "CITY"
                            ? "City"
                            : `Brgy. ${ord.barangay?.name || ""}`}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            ord.status === "APPROVED" ? "approved" : "draft"
                          }
                        >
                          {ord.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <Link href={`/ordinances/${ord.id}`}>
                          <Button variant="ghost" size="sm">
                            Tingnan
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
