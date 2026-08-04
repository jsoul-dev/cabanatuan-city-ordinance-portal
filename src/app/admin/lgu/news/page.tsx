import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { NewsManagerClient } from "../../news/news-manager-client";

export const metadata: Metadata = {
  title: "Balita at Anunsyo — LGU Admin",
  description: "Magpaskil ng opisyal na anunsyo para sa Lungsod ng Cabanatuan.",
};

export default async function LguNewsPage() {
  const newsItems = await prisma.newsItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-ink)] tracking-tight">Balita at Anunsyo</h1>
        <p className="text-sm text-[var(--text-body)] mt-1">
          Magpaskil ng opisyal na anunsyo, public hearing, o aktibidad para sa lungsod o barangay.
        </p>
      </div>
      <NewsManagerClient initialNews={newsItems} />
    </div>
  );
}
