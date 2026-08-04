import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cleanOrdinanceTitle, formatOrdinanceYear } from "@/lib/ordinance-utils";
import { OrdinancePdfButton } from "./ordinance-pdf-button";

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

  const cleanTitle = cleanOrdinanceTitle(ord.title);

  return {
    title: `${cleanTitle} - Res. No. ${ord.resolutionNumber} | Cabanatuan Law Portal`,
    description:
      ord.description?.slice(0, 160) ||
      ord.content?.slice(0, 160) ||
      "Opisyal na ordinansa at batas lokal ng Lungsod ng Cabanatuan.",
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

  const cleanTitle = cleanOrdinanceTitle(ord.title);
  const ordYear = formatOrdinanceYear(ord.year, ord.dateEnacted, ord.createdAt);

  return (
    <>
      <Navbar />

      <main id="main-content" className="flex-1 py-10 bg-[var(--bg-canvas)] text-[var(--text-ink)] transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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

          {/* Hero Header Card */}
          <div className="mb-8 rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={ord.type === "CITY" ? "city" : "barangay"}>
                  {ord.type === "CITY"
                    ? "City Ordinance"
                    : `Brgy. ${ord.barangay?.name ?? "N/A"}`}
                </Badge>
                {ord.category && (
                  <span className="inline-flex items-center rounded-full bg-[var(--bg-canvas)] border border-[var(--border-hairline)] px-3 py-1 text-xs font-semibold text-[var(--text-ink)]">
                    🏷️ {ord.category}
                  </span>
                )}
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  📅 Taon: {ordYear}
                </span>
                <Badge variant={ord.status === "APPROVED" ? "approved" : "draft"}>
                  {ord.status === "APPROVED" ? "Inaprubahan / Official" : ord.status}
                </Badge>
              </div>

              <span className="text-sm font-mono font-bold text-[var(--text-ink)] bg-[var(--bg-canvas)] px-3 py-1 rounded-md border border-[var(--border-hairline)]">
                Res. No. {ord.resolutionNumber} {ord.series ? `• Series of ${ord.series}` : ""}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-ink)] mb-4 tracking-tight leading-snug">
              {cleanTitle}
            </h1>

            {/* Tags Pills */}
            {ord.tags && ord.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mb-6">
                <span className="text-xs font-semibold text-[var(--text-mute)] mr-1">Mga Tag:</span>
                {ord.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Metadata Bar & PDF Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-6 border-t border-[var(--border-hairline)] pt-5 text-sm text-[var(--text-mute)]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full sm:w-auto">
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-body)]">
                    Petsa ng Pagpapatupad
                  </span>
                  <span className="font-medium text-[var(--text-ink)]">
                    {ord.dateEnacted
                      ? new Date(ord.dateEnacted).toLocaleDateString("tl-PH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : ord.approvedAt
                        ? new Date(ord.approvedAt).toLocaleDateString("tl-PH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : `Taon ${ordYear}`}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-body)]">
                    Sakop / Coverage
                  </span>
                  <span className="font-medium text-[var(--text-ink)]">
                    {ord.coverage || (ord.type === "CITY" ? "Lungsod ng Cabanatuan (Citywide)" : `Barangay ${ord.barangay?.name || ""}`)}
                  </span>
                </div>

                {ord.submittedBy?.name && (
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-body)]">
                      Nagsabmit
                    </span>
                    <span className="font-medium text-[var(--text-ink)]">{ord.submittedBy.name}</span>
                  </div>
                )}

                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-body)]">
                    Jurisdiction
                  </span>
                  <span className="font-medium text-[var(--text-ink)]">
                    {ord.type === "CITY" ? "LGU Cabanatuan" : "Barangay Local Gov"}
                  </span>
                </div>
              </div>

              {/* PDF Preview / Download Modal Buttons */}
              <div className="ml-auto flex-shrink-0">
                <OrdinancePdfButton
                  pdfUrl={ord.pdfUrl}
                  title={cleanTitle}
                  resolutionNumber={ord.resolutionNumber}
                  series={ord.series}
                />
              </div>
            </div>
          </div>

          {/* Highlighted Executive Summary / Buod */}
          {ord.description && (
            <div className="mb-8 rounded-[var(--radius-lg)] border-l-4 border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/20 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm uppercase tracking-wider">
                <span>📌 Executive Summary / Buod ng Batas</span>
              </div>
              <p className="text-sm sm:text-base text-[var(--text-ink)] leading-relaxed whitespace-pre-line">
                {ord.description}
              </p>
            </div>
          )}

          {/* Comprehensive 2-Column Grid for Rich Sections */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Column (2 spans): General Provisions, Articles & Sections, Penalties */}
            <div className="lg:col-span-2 space-y-8">
              {/* Articles and Sections (If available) */}
              {ord.articles && (
                <Card className="border border-[var(--border-hairline)] shadow-sm overflow-hidden">
                  <CardHeader className="bg-[var(--bg-canvas)] border-b border-[var(--border-hairline)] py-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-[var(--text-ink)]">
                      <span>⚖️ Mga Artikulo at Seksyon / Articles & Sections</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="prose max-w-none text-sm sm:text-base text-[var(--text-ink)] whitespace-pre-line leading-relaxed">
                      {ord.articles}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Full Content / General Provisions */}
              <Card className="border border-[var(--border-hairline)] shadow-sm overflow-hidden">
                <CardHeader className="bg-[var(--bg-canvas)] border-b border-[var(--border-hairline)] py-4">
                  <CardTitle className="text-lg flex items-center gap-2 text-[var(--text-ink)]">
                    <span>📜 Pangkalahatang Nilalaman / General Provisions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="prose max-w-none text-sm sm:text-base text-[var(--text-ink)] whitespace-pre-line leading-relaxed">
                    {ord.content || (
                      <p className="italic text-[var(--text-mute)]">
                        Ang buong teksto ay hindi pa na-upload sa system. Maaaring i-download ang opisyal na PDF sa itaas kung magagamit.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Embedded Inline PDF Viewer (if available) */}
              {ord.pdfUrl && (
                <Card className="border border-[var(--border-hairline)] shadow-sm overflow-hidden">
                  <CardHeader className="bg-[var(--bg-canvas)] border-b border-[var(--border-hairline)] py-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2 text-[var(--text-ink)]">
                      <span>📑 Opisyal na PDF Document Viewer</span>
                    </CardTitle>
                    <a
                      href={ord.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Buksan sa Bagong Tab ↗
                    </a>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[750px] w-full bg-neutral-900 relative">
                      <iframe
                        src={`${ord.pdfUrl}#toolbar=1&view=FitH`}
                        className="h-full w-full border-0"
                        title={`PDF - ${cleanTitle}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar Column (1 span): Penalties, Enforcement, Signatories, AI Assistant */}
            <div className="space-y-6">
              {/* Penalties & Fines */}
              <Card className="border border-[var(--border-hairline)] shadow-sm overflow-hidden">
                <CardHeader className="bg-amber-500/10 dark:bg-amber-950/30 border-b border-[var(--border-hairline)] py-4">
                  <CardTitle className="text-base font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    <span>⚠️ Mga Parusa at Multa (Penalties & Fines)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  {!ord.penalties ? (
                    <p className="text-sm text-[var(--text-mute)] italic">
                      Walang tiyak na parusa o multa na nakatala sa buod.
                    </p>
                  ) : (
                    <div className="text-sm text-[var(--text-ink)] whitespace-pre-line leading-relaxed font-medium">
                      {ord.penalties}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enforcement & Actions */}
              <Card className="border border-[var(--border-hairline)] shadow-sm overflow-hidden">
                <CardHeader className="bg-blue-500/10 dark:bg-blue-950/30 border-b border-[var(--border-hairline)] py-4">
                  <CardTitle className="text-base font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                    <span>🛡️ Pagpapatupad at Aksyon (Enforcement)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  {!ord.enforcement ? (
                    <p className="text-sm text-[var(--text-mute)] italic">
                      Walang espesipikong ahensya o aksyong nakatala.
                    </p>
                  ) : (
                    <div className="text-sm text-[var(--text-ink)] whitespace-pre-line leading-relaxed font-medium">
                      {ord.enforcement}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Signatories */}
              <Card className="border border-[var(--border-hairline)] shadow-sm overflow-hidden">
                <CardHeader className="bg-[var(--bg-canvas)] border-b border-[var(--border-hairline)] py-4">
                  <CardTitle className="text-base font-bold text-[var(--text-ink)] flex items-center gap-2">
                    <span>✍️ Mga Lumagda / Signatories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  {!ord.signatories ? (
                    <p className="text-sm text-[var(--text-mute)] italic">
                      Walang nakatalang signatory.
                    </p>
                  ) : (
                    <div className="text-sm text-[var(--text-ink)] whitespace-pre-line leading-relaxed">
                      {ord.signatories}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Citizen Assistant Help Card */}
              <Card className="border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-[var(--text-ink)]">
                    💬 Kailangan ng Tulong o May Tanong?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-[var(--text-body)] leading-relaxed">
                    Maaari mong tanungin ang ating <strong>AI Citizen Assistant</strong> tungkol sa kung paano sumunod sa ordinansang ito, o kung paano magreport ng paglabag.
                  </p>
                  <Link href="/chatbot" className="block">
                    <Button variant="secondary" className="w-full text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500">
                      🤖 Magtanong sa AI Assistant →
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
