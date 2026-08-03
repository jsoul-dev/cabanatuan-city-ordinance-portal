import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const features = [
  {
    icon: "📜",
    title: "Mga Ordinansa",
    description:
      "I-browse at i-search ang lahat ng barangay at city ordinances gamit ang mabilis na keyword at tag filtering.",
    href: "/ordinances",
    cta: "Mag-browse",
  },
  {
    icon: "🤖",
    title: "AI Citizen Assistant",
    description:
      "Magtanong sa aming AI assistant sa Tagalog o English tungkol sa mga local na batas, parusa, at proseso.",
    href: "/chatbot",
    cta: "Magtanong",
  },
  {
    icon: "📋",
    title: "Community Report",
    description:
      "Mag-report ng mga non-urgent na isyu sa barangay tulad ng pagsusunog ng basura, ingay, o sagabal sa daan.",
    href: "/report",
    cta: "Mag-report",
  },
];

/**
 * Landing Page — Cabanatuan City Ordinance Hub
 * Completely redesigned to match winauth.net dark aurora aesthetic:
 * 2-column aurora hero, floating glassmorphic feature/testimonial cards,
 * high-contrast white CTAs, and horizontal feature ticker bar.
 */
export default async function LandingPage() {
  const [ordinanceCount, barangayCount, reportCount] = await Promise.all([
    prisma.ordinance.count({ where: { status: "APPROVED" } }),
    prisma.barangay.count(),
    prisma.report.count({ where: { status: "RESOLVED" } }),
  ]);

  const stats = [
    { label: "Mga Ordinansa", value: ordinanceCount },
    { label: "Mga Barangay", value: barangayCount },
    { label: "Resolved Reports", value: reportCount },
  ];

  return (
    <div className="min-h-screen bg-[#050807] text-white selection:bg-emerald-500 selection:text-black">
      <Navbar />

      <main id="main-content" className="relative overflow-hidden">
        {/* ─── Hero Aurora Gradients & Scanlines (winauth.net style) ─── */}
        <div
          className="pointer-events-none absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-emerald-600/15 blur-[140px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-10 top-20 h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-[130px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_70%,transparent_100%)]"
          aria-hidden="true"
        />

        {/* ─── Hero Split Section ───────────────────────────────────────── */}
        <section className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-32">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Hero Title & CTAs */}
            <div className="lg:col-span-7">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold tracking-widest text-emerald-400 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>OFFICIAL DIGITAL ORDINANCE PORTAL & LGU SYSTEM</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                Cabanatuan City <br />
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-200 to-white bg-clip-text text-transparent">
                  Batas na malinaw at bukas.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
                Issue transparency, search barangay ordinances, file
                AI-assisted citizen reports, and route legal inquiries with
                complete trust across 75 barangays.
              </p>

              {/* Action Buttons (winauth.net style: White Primary + Dark Glass Secondary) */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link href="/ordinances">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-black shadow-lg shadow-white/5 transition-all hover:bg-neutral-200 active:scale-[0.98]"
                  >
                    <span>Maghanap ng Ordinansa →</span>
                  </button>
                </Link>

                <Link href="/login">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-5 py-3.5 text-sm font-semibold text-emerald-300 transition-all hover:border-emerald-500/60 hover:bg-emerald-900/40"
                  >
                    <span>Mag-login sa Portal</span>
                  </button>
                </Link>
              </div>

              {/* Pill Demo / Overview helper */}
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-neutral-300 transition-all hover:border-white/20 hover:text-white">
                <span className="text-emerald-400 font-bold">▶</span>
                <span>Alamin kung paano gamitin ang Portal (3-min overview)</span>
              </div>
            </div>

            {/* Right Column: 2 Floating Glassmorphic Cards (winauth.net style) */}
            <div className="flex flex-col gap-6 lg:col-span-5">
              {/* Card 1: Testimonial / Civic Trust Card */}
              <div className="rounded-2xl border border-white/10 bg-[#0a0f0d]/90 p-6 shadow-2xl shadow-emerald-950/50 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 font-mono text-xs font-bold text-emerald-400">
                      VE
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Verified LGU Portal
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        MAY 2026 • OFFICIAL RELEASE
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                    RLS SECURED
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-neutral-300">
                  An official digital civic portal for Cabanatuan City across
                  all 75 barangays. Overall an amazing public resource for
                  citizens and LGU officials:
                </p>

                <ul className="mt-3 space-y-2 text-xs text-emerald-400 font-medium">
                  <li className="flex items-center gap-2">
                    <span>•</span>
                    <span className="text-neutral-200">
                      Instant full-text search across city & barangay laws
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>•</span>
                    <span className="text-neutral-200">
                      Tagalog & English AI legal assistant with citation references
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>•</span>
                    <span className="text-neutral-200">
                      Public transparency & verified RLS database security
                    </span>
                  </li>
                </ul>
              </div>

              {/* Card 2: Challenge / Portal Access Card */}
              <div className="rounded-2xl border border-white/10 bg-[#0a0f0d]/90 p-6 shadow-2xl shadow-emerald-950/50 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <span>🏆</span>
                      <span>Cabanatuan City Transparency Portal</span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-400">
                      Explore the complete municipal code and barangay resolutions.
                    </p>
                  </div>
                  <Link href="/ordinances">
                    <button
                      type="button"
                      className="shrink-0 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-black transition-all hover:bg-emerald-400 active:scale-95"
                    >
                      Browse Code
                    </button>
                  </Link>
                </div>
                <div className="mt-4 border-t border-white/10 pt-3 font-mono text-[10px] text-neutral-500">
                  public access / 75 barangays / verified RLS
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Bottom Horizontal FEATURES Ticker Strip (winauth.net style) ─── */}
        <section className="relative z-10 border-y border-white/10 bg-black/40 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 text-xs font-mono text-neutral-400 sm:px-6 lg:px-8">
            <div className="font-bold tracking-widest text-emerald-400 uppercase">
              FEATURES
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>75 Barangays</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>City Ordinances</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>AI Legal Advisor</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Citizen Reporting</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>News & Updates</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>RLS Security</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>WCAG 2.2 Accessible</span>
              </span>
            </div>
          </div>
        </section>

        {/* ─── Live Stats Section ───────────────────────────────────────── */}
        <section className="border-b border-white/10 bg-[#080d0a]/60 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
                >
                  <p className="text-4xl font-extrabold text-emerald-400 tabular-nums">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Feature Cards Grid (3-up) ────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="font-mono text-xs font-bold tracking-widest text-emerald-400 uppercase">
              MGA SERBISYO NG PORTAL
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Paano ka namin matutulungan
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Link key={feature.href} href={feature.href} className="group">
                <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[#0a0f0d]/90 p-8 shadow-xl transition-all duration-300 hover:border-emerald-500/50 hover:bg-[#0f1713]">
                  <div>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-2xl">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                      {feature.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span>{feature.cta}</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── CTA Band ─────────────────────────────────────────────────── */}
        <section className="border-t border-white/10 bg-[#080d0a] py-20 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Simulan ang pag-explore ng mga Batas
            </h2>
            <p className="mt-4 text-sm text-neutral-400 sm:text-base">
              Alamin ang iyong mga karapatan at tungkulin bilang mamamayan ng
              Lungsod ng Cabanatuan.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/ordinances">
                <button
                  type="button"
                  className="rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black shadow-lg shadow-white/5 transition-all hover:bg-neutral-200 active:scale-95"
                >
                  I-explore ang mga Ordinansa →
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
