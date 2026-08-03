import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ReportClientForm } from "./report-client";

export const metadata: Metadata = {
  title: "Mag-ulat sa Barangay | Community Report",
  description:
    "Mag-sumite ng ulat o reklamo tungkol sa kaayusan, basura, o paglabag sa ordinansa sa inyong barangay. May auto-save draft functionality.",
};

export default async function ReportPage() {
  const barangays = await prisma.barangay.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#050807] text-white selection:bg-emerald-500 selection:text-black">
      <Navbar />

      <main id="main-content" className="relative flex-1 overflow-hidden py-12">
        {/* Aurora Glow & Scanlines */}
        <div
          className="pointer-events-none absolute left-1/4 top-10 h-[500px] w-[500px] rounded-full bg-emerald-600/15 blur-[140px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,#000_70%,transparent_100%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:text-left">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold tracking-widest text-emerald-400 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>CITIZEN FEEDBACK & REPORTING • RLS PROTECTED</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Mag-ulat sa Barangay
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400 sm:text-base">
              Ang inyong ulat ay direktang ipararating sa kinauukulang Barangay
              Hall ng Cabanatuan. Ang inyong draft ay awtomatikong nai-save sa
              inyong browser.
            </p>
          </div>

          <ReportClientForm barangays={barangays} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
