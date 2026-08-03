"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function submitOrdinance(formData: FormData): Promise<{ error?: string }> {
  const session = await getSession();

  if (!session || !["CAPTAIN", "SECRETARY"].includes(session.role)) {
    return { error: "Hindi awtorisado. Tanging Kapitan o Kalihim lamang ang makakapag-sumite." };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { barangay: true },
  });

  if (!user?.barangayId) {
    return { error: "Walang naitalang barangay para sa iyong account." };
  }

  const title = (formData.get("title") as string)?.trim();
  const resolutionNumber = (formData.get("resolutionNumber") as string)?.trim();
  const series = (formData.get("series") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const content = (formData.get("content") as string)?.trim() || "";
  const category = (formData.get("category") as string)?.trim() || "General";

  if (!title || !resolutionNumber) {
    return { error: "Pamagat at Resolution Number ay kinakailangan." };
  }

  await prisma.ordinance.create({
    data: {
      title,
      resolutionNumber,
      series,
      description,
      content,
      category,
      type: "BARANGAY",
      status: "PENDING",
      barangayId: user.barangayId,
      submittedById: session.userId,
    },
  });

  revalidatePath("/admin/barangay");
  revalidatePath("/admin/barangay/ordinances");
  revalidatePath("/admin/lgu");
  revalidatePath("/admin/lgu/ordinances");
  return {};
}

export async function updateBarangayReportStatus(reportId: string, status: string): Promise<{ error?: string }> {
  const session = await getSession();

  if (!session || !["CAPTAIN", "SECRETARY", "KAGAWAD"].includes(session.role)) {
    return { error: "Hindi awtorisado." };
  }

  await prisma.report.update({
    where: { id: reportId },
    data: {
      status: status as never,
      ...(status === "RESOLVED" ? { resolvedAt: new Date() } : {}),
    },
  });

  revalidatePath("/admin/barangay");
  revalidatePath("/admin/barangay/reports");
  return {};
}
