import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ReportClientForm } from "./report-client";

export const metadata: Metadata = {
  title: "Mag-ulat sa Barangay - Community Report",
  description:
    "Mag-sumite ng ulat o reklamo tungkol sa kaayusan, basura, o paglabag sa ordinansa sa inyong barangay. May auto-save draft functionality.",
};

export default async function ReportPage() {
  const barangays = await prisma.barangay.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <>
      <Navbar />

      <main id="main-content" className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-mono-eyebrow text-[var(--accent-primary)] mb-2">
              Citizen Feedback & Reporting
            </p>
            <h1 className="text-heading-lg text-[var(--text-ink)]">
              Mag-ulat sa Barangay
            </h1>
            <p className="mt-2 text-base text-[var(--text-body)]">
              Ang inyong ulat ay direktang ipararating sa kinauukulang Barangay Hall ng Cabanatuan. Ang inyong draft ay awtomatikong nai-save sa inyong device.
            </p>
          </div>

          <ReportClientForm barangays={barangays} />
        </div>
      </main>

      <Footer />
    </>
  );
}
