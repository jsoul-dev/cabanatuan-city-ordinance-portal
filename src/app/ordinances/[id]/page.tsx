import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface OrdinanceDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: OrdinanceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const ord = await prisma.ordinance.findUnique({
    where: { id },
  });

  if (!ord) {
    return {
      title: "Hindi Natagpuan ang Ordinansa - Cabanatuan City Law Portal",
    };
  }

  return {
    title: `${ord.title} - Res. No. ${ord.resolutionNumber} | Cabanatuan Law Portal`,
    description:
      ord.content?.slice(0, 160) ||
      "Opisyal na ordinansa at batas lokal ng Lungsod ng Kabanatuan.",
  };
}

export default async function OrdinanceDetailPage({
  params,
}: OrdinanceDetailPageProps) {
  const { id } = await params;

  const ord = await prisma.ordinance.findUnique({
    where: { id },
    include: {
      barangay: true,
      submittedBy: true,
    },
  });

  if (!ord) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main id="main-content" className="flex-1 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-xs text-[var(--text-mute)]">
              <li>
                <Link
                  href="/"
                  className="hover:text-[var(--accent-primary)] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/ordinances"
                  className="hover:text-[var(--accent-primary)] transition-colors"
                >
                  Mga Ordinansa
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[var(--text-body)] font-semibold truncate max-w-xs">
                Res. No. {ord.resolutionNumber}
              </li>
            </ol>
          </nav>

          {/* Header Card */}
          <div className="mb-8 rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Badge variant={ord.type === "CITY" ? "city" : "barangay"}>
                  {ord.type === "CITY"
                    ? "City Ordinance"
                    : `Brgy. ${ord.barangay?.name ?? "N/A"}`}
                </Badge>
                <Badge
                  variant={
                    ord.status === "APPROVED" ? "approved" : "draft"
                  }
                >
                  {ord.status === "APPROVED" ? "Inaprubahan" : ord.status}
                </Badge>
              </div>

              <span className="text-sm font-mono text-[var(--text-mute)]">
                Res. No. {ord.resolutionNumber}{" "}
                {ord.series ? `• Series of ${ord.series}` : ""}
              </span>
            </div>

            <h1 className="text-heading-lg text-[var(--text-ink)] mb-4">
              {ord.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--text-mute)] border-t border-[var(--border-hairline)] pt-4">
              <div>
                <span className="block text-xs font-semibold uppercase text-[var(--text-body)]">
                  Petsa ng Pag-apruba
                </span>
                <span>
                  {ord.approvedAt
                    ? new Date(ord.approvedAt).toLocaleDateString(
                        "tl-PH",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "Hindi Nakatala"}
                </span>
              </div>

              {ord.submittedBy?.name && (
                <div>
                  <span className="block text-xs font-semibold uppercase text-[var(--text-body)]">
                    Nagsabmit / Submitted By
                  </span>
                  <span>{ord.submittedBy.name}</span>
                </div>
              )}

              {ord.pdfUrl && (
                <div className="ml-auto">
                  <a
                    href={ord.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--accent-primary)] px-4 py-2 text-xs font-semibold text-[var(--accent-on-primary)] hover:bg-[var(--accent-primary-hover)] transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    I-download ang PDF Kopya
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Ordinance Text / Body (2 columns) */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Buong Nilalaman ng Ordinansa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none text-[var(--text-ink)] whitespace-pre-line leading-relaxed">
                    {ord.content || (
                      <p className="text-italic text-[var(--text-mute)]">
                        Ang buong teksto ay hindi pa na-upload sa system. Maaaring i-download ang opisyal na PDF kung magagamit.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar: Signatories & Metadata (1 column) */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mga Lumagda / Signatories</CardTitle>
                </CardHeader>
                <CardContent>
                  {!ord.signatories ? (
                    <p className="text-sm text-[var(--text-mute)]">
                      Walang nakatalang signatory.
                    </p>
                  ) : (
                    <div className="text-sm text-[var(--text-ink)] whitespace-pre-line leading-relaxed">
                      {ord.signatories}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kailangan ng Tulong?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-[var(--text-body)]">
                    May katanungan tungkol sa kung paano ipatupad o sundin ang ordinansang ito?
                  </p>
                  <Link href="/chatbot" className="block">
                    <Button variant="secondary" className="w-full">
                      Magtanong sa AI Citizen Assistant →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
