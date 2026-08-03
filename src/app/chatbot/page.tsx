import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ChatbotClient } from "./chatbot-client";

export const metadata: Metadata = {
  title: "AI Citizen Assistant | Batas Cabanatuan AI",
  description:
    "Magtanong nang libre kay Batas Cabanatuan AI tungkol sa mga ordinansa, curfew, basura, at batas ng Cabanatuan.",
};

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 dark:bg-[#050807] dark:text-white selection:bg-emerald-500 selection:text-black transition-colors duration-200">
      <Navbar />

      <main
        id="main-content"
        className="relative flex-1 overflow-hidden py-12 min-h-[calc(100vh-140px)]"
      >
        {/* Aurora Glow & Scanlines */}
        <div
          className="pointer-events-none absolute right-1/4 top-10 h-[500px] w-[500px] rounded-full bg-emerald-500/10 dark:bg-emerald-600/15 blur-[140px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,#000_70%,transparent_100%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold tracking-widest text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-400 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span>AI LEGAL & CIVIC ASSISTANT • TAGALOG / ENGLISH</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl lg:text-5xl">
              Batas Cabanatuan AI
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base max-w-xl mx-auto">
              May katanungan tungkol sa ordinansa ng lungsod o inyong barangay?
              Magtanong kay Batas AI at makakuha ng sagot na may kasamang citation.
            </p>
          </div>

          <ChatbotClient />
        </div>
      </main>

      <Footer />
    </div>
  );
}
