import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  OrdinancesScrollIcon,
  AiBotSparkleIcon,
  CommunityReportIcon,
} from "@/components/dashboard/icons";

const features = [
  {
    icon: OrdinancesScrollIcon,
    title: "Mga Ordinansa",
    description:
      "I-browse at i-search ang lahat ng barangay at city ordinances gamit ang mabilis na keyword at tag filtering.",
    href: "/ordinances",
    cta: "Mag-browse",
  },
  {
    icon: AiBotSparkleIcon,
    title: "AI Citizen Assistant",
    description:
      "Magtanong sa aming AI assistant sa Tagalog o English tungkol sa mga local na ordinansa, parusa, at proseso.",
    href: "/chatbot",
    cta: "Magtanong",
  },
  {
    icon: CommunityReportIcon,
    title: "Community Report",
    description:
      "Mag-report ng mga non-urgent na isyu sa barangay tulad ng pagsusunog ng basura, ingay, o sagabal sa daan.",
    href: "/report",
    cta: "Mag-report",
  },
];

/**
 * Landing Page — Cabanatuan City Ordinance Hub
 * Responsive across BOTH crisp Light Mode and winauth.net Dark Mode.
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
    <div className="min-h-screen bg-stone-50 text-neutral-900 dark:bg-[#050807] dark:text-white selection:bg-emerald-500 selection:text-black transition-colors duration-200">
      <Navbar />

      <main id="main-content" className="relative overflow-hidden">
        {/* ─── Hero Aurora Gradients & Scanlines (Dark Mode only / Subtle in light) ─── */}
        <div
          className="pointer-events-none absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-emerald-500/10 dark:bg-emerald-600/15 blur-[140px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-10 top-20 h-[450px] w-[450px] rounded-full bg-emerald-400/5 dark:bg-emerald-500/10 blur-[130px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_70%,transparent_100%)]"
          aria-hidden="true"
        />

        {/* ─── Hero Split Section ───────────────────────────────────────── */}
        <section className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-32">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Hero Title & CTAs */}
            <div className="lg:col-span-7">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold tracking-widest text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-400 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                <span>OFFICIAL DIGITAL ORDINANCE PORTAL</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                Cabanatuan City <br />
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-800 to-neutral-900 dark:from-emerald-400 dark:via-emerald-200 dark:to-white bg-clip-text text-transparent">
                  Ordinansang malinaw at bukas para sa lahat.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
                Issue transparency, search barangay ordinances, file
                AI-assisted citizen reports, and route ordinance inquiries with
                complete trust across 75 barangays.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link href="/ordinances">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-black dark:shadow-lg dark:shadow-white/5 dark:hover:bg-neutral-200"
                  >
                    <span>Maghanap ng Ordinansa →</span>
                  </button>
                </Link>

                <Link href="/login">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl border border-emerald-600/30 bg-emerald-50/80 px-5 py-3.5 text-sm font-semibold text-emerald-800 transition-all hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:border-emerald-500/60 dark:hover:bg-emerald-900/40"
                  >
                    <span>Mag-login sa Portal</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Column: Redesigned LGU Portal Cards */}
            <div className="flex flex-col gap-5 lg:col-span-5">
              {/* Card 1: Official Digital Portal Showcase */}
              <div className="rounded-2xl border border-neutral-200 bg-white/90 p-6 shadow-xl shadow-neutral-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0f0d]/90 dark:shadow-2xl dark:shadow-emerald-950/50">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-1 shadow-sm">
                      <Image
                        src="/lgu-logo.png"
                        alt="Cabanatuan City LGU Seal"
                        width={28}
                        height={28}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">
                        Ordinance Portal
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>CABANATUAN CITY</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                  Ang opisyal na pampublikong digital portal ng Lungsod ng Cabanatuan para sa mabilis na pag-access sa mga ordinansa at serbisyong pambarangay:
                </p>

                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5 rounded-xl border border-neutral-200/60 bg-neutral-50/60 p-2.5 dark:border-white/5 dark:bg-white/5">
                    <span className="text-emerald-600 font-bold dark:text-emerald-400">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-200 font-medium">
                      Mabilis na paghahanap sa mga ordinansa ng lungsod at barangay
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-xl border border-neutral-200/60 bg-neutral-50/60 p-2.5 dark:border-white/5 dark:bg-white/5">
                    <span className="text-emerald-600 font-bold dark:text-emerald-400">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-200 font-medium">
                      AI Ordinance Assistant sa Tagalog at English para sa mga ordinansa
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-xl border border-neutral-200/60 bg-neutral-50/60 p-2.5 dark:border-white/5 dark:bg-white/5">
                    <span className="text-emerald-600 font-bold dark:text-emerald-400">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-200 font-medium">
                      Opisyal at transparent na impormasyon para sa mamamayan
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: AI Ordinance Assistant Quick Action Card */}
              <div className="rounded-2xl border border-neutral-200 bg-white/90 p-6 shadow-xl shadow-neutral-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0f0d]/90 dark:shadow-2xl dark:shadow-emerald-950/50">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
                      <AiBotSparkleIcon size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>AI Ordinance Assistant</span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                      Magtanong sa aming AI assistant tungkol sa mga opisyal na ordinansa at proseso.
                    </p>
                  </div>
                  <Link href="/chatbot">
                    <button
                      type="button"
                      className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-700 active:scale-95 dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400"
                    >
                      Magtanong sa AI →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Bottom Horizontal FEATURES Ticker Strip ─── */}
        <section className="relative z-10 border-y border-neutral-200 bg-white/70 dark:border-white/10 dark:bg-black/40 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 text-xs font-mono text-neutral-600 dark:text-neutral-400 sm:px-6 lg:px-8">
            <div className="font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase">
              FEATURES
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>City Ordinances</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>AI Ordinance Advisor</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>Citizen Reporting</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>News & Updates</span>
              </span>
            </div>
          </div>
        </section>

        {/* ─── Live Stats Section ───────────────────────────────────────── */}
        <section className="border-b border-neutral-200 bg-neutral-100/60 dark:border-white/10 dark:bg-[#080d0a]/60 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none backdrop-blur-sm"
                >
                  <p className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Feature Cards Grid ───────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="font-mono text-xs font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase">
              MGA SERBISYO NG PORTAL
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Paano ka namin matutulungan
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Link key={feature.href} href={feature.href} className="group">
                <div className="flex h-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-emerald-500/50 hover:bg-emerald-50/40 dark:border-white/10 dark:bg-[#0a0f0d]/90 dark:shadow-xl dark:hover:border-emerald-500/50 dark:hover:bg-[#0f1713]">
                  <div>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-sm dark:text-emerald-400">
                      <feature.icon size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {feature.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span>{feature.cta}</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── AI Chatbot Showcase Section ───────────────────────────────────── */}
        <section className="border-t border-neutral-200 bg-emerald-50/30 py-20 dark:border-white/10 dark:bg-[#070d0a]/80 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              {/* Left Column: Interactive Chat UI Preview Card */}
              <div className="lg:col-span-6">
                <div className="rounded-3xl border border-neutral-200/80 bg-white/90 p-6 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-[#0d1410]/95 dark:shadow-2xl dark:shadow-emerald-950/60">
                  {/* Chat Header */}
                  <div className="mb-6 flex items-center justify-between border-b border-neutral-200/70 pb-4 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        <AiBotSparkleIcon size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-900 dark:text-white">
                          AI Citizen Ordinance Assistant
                        </div>
                        <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>ACTIVE • TAGALOG & ENGLISH</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages Preview */}
                  <div className="space-y-4 text-xs">
                    {/* Message 1 - User */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-neutral-100 p-3.5 text-neutral-800 dark:bg-white/10 dark:text-neutral-200">
                        Ano ang sinasabi ng ordinansa tungkol sa curfew sa mga kabataan sa Cabanatuan?
                      </div>
                    </div>

                    {/* Message 1 - AI */}
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        <AiBotSparkleIcon size={14} />
                      </div>
                      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-emerald-500/30 bg-emerald-50/80 p-3.5 text-emerald-950 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-200">
                        Ayon sa City Ordinance No. 2018-42, ipinagbabawal ang paggala ng mga menor de edad mula 10:00 PM hanggang 4:00 AM sa buong Lungsod ng Cabanatuan.
                      </div>
                    </div>

                    {/* Message 2 - User */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-neutral-100 p-3.5 text-neutral-800 dark:bg-white/10 dark:text-neutral-200">
                        Ano po ang parusa sa illegal dumping o pagtatapon ng basura sa kalsada?
                      </div>
                    </div>

                    {/* Message 2 - AI */}
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        <AiBotSparkleIcon size={14} />
                      </div>
                      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-emerald-500/30 bg-emerald-50/80 p-3.5 text-emerald-950 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-200">
                        Ayon sa City Ecological Solid Waste Ordinance, may parusang ₱1,000 hanggang ₱5,000 multa o kaukulang community service sa bawat paglabag sa kalinisan.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Section Text & Value Points */}
              <div className="lg:col-span-6">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold tracking-widest text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-400 uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  <span>AI CITIZEN ASSISTANT</span>
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl lg:text-5xl lg:leading-[1.1]">
                  AI Ordinance Assistant <br />
                  <span className="bg-gradient-to-r from-emerald-600 via-emerald-800 to-neutral-900 dark:from-emerald-400 dark:via-emerald-200 dark:to-white bg-clip-text text-transparent">
                    sa Tagalog at English.
                  </span>
                </h2>

                <p className="mt-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg">
                  Madaling maunawaan ang bawat city at barangay ordinance sa Cabanatuan City. Ang ating AI assistant ay nakabatay lamang sa nakaimbak na opisyal na database ng LGU upang magbigay ng malinaw at direktang kasagutan.
                </p>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 font-semibold text-neutral-800 dark:text-neutral-200 text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>
                    <span>Nakabatay lamang sa opisyal na ordinance database ng LGU</span>
                  </div>
                  <div className="flex items-center gap-3 font-semibold text-neutral-800 dark:text-neutral-200 text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>
                    <span>Mabilis na pagsusuri ng mga ordinansa at kaukulang parusa</span>
                  </div>
                  <div className="flex items-center gap-3 font-semibold text-neutral-800 dark:text-neutral-200 text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>
                    <span>Malinaw at direktang kasagutan sa Tagalog o English</span>
                  </div>
                </div>

                <div className="mt-8">
                  <Link href="/chatbot">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                    >
                      <span>Subukan ang AI Assistant →</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA Band ─────────────────────────────────────────────────── */}
        <section className="border-t border-neutral-200 bg-neutral-100 dark:border-white/10 dark:bg-[#080d0a] py-20 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-white sm:text-4xl">
              Simulan ang pag-explore ng mga Ordinansa
            </h2>
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 sm:text-base">
              Alamin ang iyong mga karapatan at tungkulin bilang mamamayan ng
              Lungsod ng Cabanatuan.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/ordinances">
                <button
                  type="button"
                  className="rounded-xl bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-neutral-800 active:scale-95 dark:bg-white dark:text-black dark:shadow-lg dark:shadow-white/5 dark:hover:bg-neutral-200"
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
