import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ChatbotClient } from "./chatbot-client";

export const metadata: Metadata = {
  title: "AI Citizen Assistant - Batas Kabanatuan AI",
  description:
    "Magtanong nang libre kay Batas Kabanatuan AI tungkol sa mga ordinansa, curfew, basura, at batas ng Kabanatuan.",
};

export default function ChatbotPage() {
  return (
    <>
      <Navbar />

      <main
        id="main-content"
        className="flex-1 py-8 bg-[var(--bg-canvas)] min-h-[calc(100vh-140px)]"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-center">
            <p className="text-mono-eyebrow text-[var(--accent-primary)] mb-1">
              Batas Kabanatuan AI
            </p>
            <h1 className="text-heading-lg text-[var(--text-ink)]">
              AI Legal & Civic Assistant
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[var(--text-body)] max-w-xl mx-auto">
              May katanungan tungkol sa ordinansa ng lungsod o inyong barangay? Magtanong gamit ang wikang Tagalog o English.
            </p>
          </div>

          <ChatbotClient />
        </div>
      </main>

      <Footer />
    </>
  );
}
