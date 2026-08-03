import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Feature cards data
const features = [
  {
    icon: "📜",
    title: "Mga Ordinansa",
    description:
      "I-browse at i-search ang lahat ng barangay at city ordinances gamit ang ⌘K command palette.",
    href: "/ordinances",
    cta: "Mag-browse",
  },
  {
    icon: "🤖",
    title: "AI Citizen Assistant",
    description:
      "Magtanong sa aming AI assistant sa Tagalog o English tungkol sa mga local na batas.",
    href: "/chatbot",
    cta: "Magtanong",
  },
  {
    icon: "📋",
    title: "Community Report",
    description:
      "Mag-report ng mga non-urgent na isyu tulad ng pagsusunog ng basura, ingay, o sagabal sa daan.",
    href: "/report",
    cta: "Mag-report",
  },
];

/**
 * Landing Page — Cabanatuan City Ordinance Hub
 *
 * Layout: Hero with LGU mesh gradient → NumberFlow stats →
 * Hairline feature cards (3-up grid) → CTA band → Footer
 */
export default async function LandingPage() {
  // Fetch live stats from database (React Server Component)
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
    <>
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* ─── Hero Section ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Cabanatuan LGU Mesh Gradient Backdrop */}
          <div className="hero-mesh-cabanatuan absolute inset-0" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
            <div className="flex flex-col items-center text-center">
              {/* Geist Mono Technical Eyebrow */}
              <p className="text-mono-eyebrow text-[var(--accent-primary)] mb-4">
                Lungsod ng Cabanatuan • Nueva Ecija
              </p>

              {/* LGU Seal */}
              <Image
                src="/lgu-logo.png"
                alt="Sagisag ng Lungsod ng Cabanatuan 1950"
                width={96}
                height={96}
                className="mb-6 rounded-full shadow-lg"
                priority
              />

              {/* Display Headline — Geist display-xl, tight tracking */}
              <h1 className="text-display-xl text-[var(--text-ink)] mb-4 max-w-3xl">
                Cabanatuan City
                <br />
                <span className="text-[var(--accent-primary)]">
                  Ordinance Portal
                </span>
              </h1>

              {/* Subheading */}
              <p className="max-w-xl text-lg text-[var(--text-body)] mb-8">
                Gawing accessible at transparent ang mga local na batas para sa
                bawat mamamayan ng Cabanatuan.
              </p>

              {/* CTA Buttons — Geist pill buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/ordinances">
                  <Button variant="primary" size="lg">
                    Mag-explore ng Ordinansa
                  </Button>
                </Link>
                <Link href="/chatbot">
                  <Button variant="secondary" size="lg">
                    Kausapin ang AI Assistant
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Stats Section ────────────────────────────────────────────── */}
        <section className="border-y border-[var(--border-hairline)] bg-[var(--bg-card)]">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-[var(--accent-primary)] tabular-nums">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-[var(--text-mute)] mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Feature Cards (3-up grid) ────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-mono-eyebrow text-[var(--accent-gold)] mb-2">
              Mga Serbisyo
            </p>
            <h2 className="text-heading-lg text-[var(--text-ink)]">
              Paano ka namin matutulungan
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Link key={feature.href} href={feature.href} className="group">
                <Card className="h-full transition-shadow duration-200 hover:shadow-[var(--shadow-floating)] p-6">
                  <CardContent className="flex flex-col items-start gap-4 p-0">
                    <span
                      className="text-3xl"
                      role="img"
                      aria-label={feature.title}
                    >
                      {feature.icon}
                    </span>
                    <h3 className="text-lg font-semibold text-[var(--text-ink)] tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[var(--text-body)] flex-1">
                      {feature.description}
                    </p>
                    <span className="text-sm font-medium text-[var(--accent-primary)] group-hover:underline">
                      {feature.cta} →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── CTA Band ─────────────────────────────────────────────────── */}
        <section className="border-t border-[var(--border-hairline)] bg-[var(--bg-card)]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 text-center">
            <h2 className="text-heading-lg text-[var(--text-ink)] mb-4">
              Simulan na
            </h2>
            <p className="text-[var(--text-body)] mb-8 max-w-lg mx-auto">
              Alamin ang iyong mga karapatan at tungkulin bilang mamamayan ng
              Cabanatuan.
            </p>
            <Link href="/ordinances">
              <Button variant="primary" size="lg">
                I-explore ang mga Ordinansa
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
