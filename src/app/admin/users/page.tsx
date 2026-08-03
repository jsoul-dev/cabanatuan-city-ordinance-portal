import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pamahalaan ang mga Gumagamit - LGU Admin",
  description: "View and manage LGU officials, barangay captains, and secretaries.",
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      barangay: true,
    },
    orderBy: {
      role: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-ink)]">
          Rehistradong LGU Officials & Officers
        </h2>
        <p className="text-sm text-[var(--text-body)]">
          Talaan ng mga awtorisadong gumagamit na maaaring mag-upload ng ordinansa o maglathala ng balita.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mga Opisyal ng Lungsod at Barangay</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-xs uppercase text-[var(--text-mute)]">
                  <th className="p-4 font-semibold">Pangalan</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Posisyon / Role</th>
                  <th className="p-4 font-semibold">Barangay</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--bg-canvas)]">
                    <td className="p-4 font-medium text-[var(--text-ink)]">
                      {u.name}
                    </td>
                    <td className="p-4 text-xs font-mono text-[var(--text-body)]">
                      {u.email}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          u.role === "LGU_ADMIN"
                            ? "city"
                            : u.role === "CAPTAIN"
                              ? "approved"
                              : "draft"
                        }
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {u.barangay ? (
                        <Badge variant="barangay">
                          Brgy. {u.barangay.name}
                        </Badge>
                      ) : (
                        <span className="text-xs text-[var(--text-mute)]">
                          City Hall / LGU Wide
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
