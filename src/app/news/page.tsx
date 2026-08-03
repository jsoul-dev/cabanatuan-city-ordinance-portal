import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Mga Balita at Anunsyo - Cabanatuan City Law Portal",
  description:
    "Mga pinakabagong balita, public hearings, at pamahalaang lokal na anunsyo mula sa Lungsod ng Cabanatuan at mga barangay.",
};

export default async function NewsPage() {
  const newsList = await prisma.newsItem.findMany({
    orderBy: {
      publishedAt: "desc",
    },
  });

  return (
    <>
      <Navbar />

      <main id="main-content" className="flex-1 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <p className="text-mono-eyebrow text-[var(--accent-primary)] mb-2">
              Opisyal na Anunsyo
            </p>
            <h1 className="text-heading-lg text-[var(--text-ink)]">
              Mga Balita at Anunsyo
            </h1>
            <p className="mt-2 text-base text-[var(--text-body)]">
              Subaybayan ang mga bagong ordinansa, public consultation, at mahahalagang pahayag mula sa LGU ng Cabanatuan at barangay.
            </p>
          </div>

          {/* News Feed */}
          {newsList.length === 0 ? (
            <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-hairline)] bg-[var(--bg-card)] p-12 text-center">
              <p className="text-3xl mb-2" aria-hidden="true">
                📰
              </p>
              <h3 className="text-base font-semibold text-[var(--text-ink)]">
                Walang nakatalang anunsyo
              </h3>
              <p className="mt-1 text-sm text-[var(--text-body)]">
                Balikan mamaya para sa mga panibagong balita ng lungsod.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {newsList.map((item) => (
                <Card
                  key={item.id}
                  className="transition-shadow duration-200 hover:shadow-[var(--shadow-floating)]"
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            item.category === "CITY" ? "city" : "barangay"
                          }
                        >
                          {item.category === "CITY"
                            ? "City Announcement"
                            : "Barangay Notice"}
                        </Badge>
                        {item.isPinned && (
                          <Badge variant="approved">Pinned</Badge>
                        )}
                      </div>

                      <span className="text-xs text-[var(--text-mute)]">
                        {new Date(item.publishedAt).toLocaleDateString(
                          "tl-PH",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="prose max-w-none text-sm text-[var(--text-ink)] whitespace-pre-line leading-relaxed">
                      {item.content}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
