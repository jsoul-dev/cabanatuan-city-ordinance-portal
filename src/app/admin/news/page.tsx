import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { NewsManagerClient } from "./news-manager-client";

export const metadata: Metadata = {
  title: "Pamahalaan ang Balita at Anunsyo - LGU Admin",
  description: "Create and publish city and barangay news announcements.",
};

export default async function AdminNewsPage() {
  const newsItems = await prisma.newsItem.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-ink)]">
          Pamahalaan ang Balita & Anunsyo
        </h2>
        <p className="text-sm text-[var(--text-body)]">
          Magpaskil ng opisyal na anunsyo, public hearing, o aktibidad para sa lungsod o barangay.
        </p>
      </div>

      <NewsManagerClient initialNews={newsItems} />
    </div>
  );
}
