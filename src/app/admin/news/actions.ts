"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { NewsCategory } from "@prisma/client";

export interface CreateNewsInput {
  title: string;
  content: string;
  category: NewsCategory;
  isPinned?: boolean;
}

/**
 * Create a new news/announcement item in news_items table.
 */
export async function createNewsAction(input: CreateNewsInput) {
  try {
    const created = await prisma.newsItem.create({
      data: {
        title: input.title,
        content: input.content,
        category: input.category,
        isPinned: input.isPinned ?? false,
        publishedAt: new Date(),
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/news");
    revalidatePath("/news");

    return { success: true, news: created };
  } catch (error: unknown) {
    console.error("createNewsAction error:", error);
    return { success: false, error: "Hindi na-save ang anunsyo." };
  }
}

/**
 * Delete a news item by ID.
 */
export async function deleteNewsAction(id: string) {
  try {
    await prisma.newsItem.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/news");
    revalidatePath("/news");

    return { success: true };
  } catch (error: unknown) {
    console.error("deleteNewsAction error:", error);
    return { success: false, error: "Hindi nabura ang balita." };
  }
}
