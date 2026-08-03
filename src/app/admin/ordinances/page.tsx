import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { OrdinanceManagerClient } from "./ordinance-manager-client";

export const metadata: Metadata = {
  title: "Pamahalaan ang mga Ordinansa - LGU Admin",
  description: "Create, edit, approve, and delete Cabanatuan ordinances.",
};

export default async function AdminOrdinancesPage() {
  const [ordinances, barangays] = await Promise.all([
    prisma.ordinance.findMany({
      include: {
        barangay: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.barangay.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-ink)]">
          Pamahalaan ang mga Ordinansa
        </h2>
        <p className="text-sm text-[var(--text-body)]">
          Dito maaaring mag-upload o mag-apruba ng City at Barangay Ordinances.
        </p>
      </div>

      <OrdinanceManagerClient
        initialOrdinances={ordinances}
        barangays={barangays}
      />
    </div>
  );
}
