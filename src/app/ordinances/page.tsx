import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { OrdinanceExplorerClient } from "./ordinance-explorer-client";

export const metadata: Metadata = {
  title: "Mga Ordinansa",
  description:
    "I-browse at i-search ang mga opisyal na ordinansa ng Lungsod ng Kabanatuan at mga barangay nito.",
};

/**
 * Ordinance Explorer Page (Server Component).
 * Fetches all approved ordinances and barangays from the database
 * and passes them to the client interactive explorer.
 */
export default async function OrdinancesPage() {
  const [ordinances, barangays] = await Promise.all([
    prisma.ordinance.findMany({
      where: {
        status: "APPROVED",
      },
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
    <>
      <Navbar />

      <main id="main-content" className="flex-1 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <p className="text-mono-eyebrow text-[var(--accent-primary)] mb-2">
              Kabanatuan City Law Portal
            </p>
            <h1 className="text-heading-lg text-[var(--text-ink)]">
              Mga Ordinansa
            </h1>
            <p className="mt-2 max-w-2xl text-base text-[var(--text-body)]">
              Hanapin ang mga batas at patakarang nagpapairal sa kaayusan at
              kaunlaran ng ating lungsod at barangay.
            </p>
          </div>

          {/* Interactive Search & Filter Client Component */}
          <OrdinanceExplorerClient
            initialOrdinances={ordinances}
            barangays={barangays}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
