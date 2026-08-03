"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { OrdinanceType, OrdinanceStatus } from "@prisma/client";

export interface CreateOrdinanceInput {
  title: string;
  type: OrdinanceType;
  resolutionNumber: string;
  series?: string;
  content: string;
  pdfUrl?: string;
  barangayId?: string;
  status?: OrdinanceStatus;
  submittedById?: string;
}

/**
 * Create a new ordinance in the database.
 */
export async function createOrdinanceAction(input: CreateOrdinanceInput) {
  try {
    let submitterId = input.submittedById;
    if (!submitterId) {
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) {
        throw new Error("Walang user sa database para maging submitter.");
      }
      submitterId = firstUser.id;
    }

    const created = await prisma.ordinance.create({
      data: {
        title: input.title,
        type: input.type,
        resolutionNumber: input.resolutionNumber,
        series: input.series || "2026",
        content: input.content,
        pdfUrl: input.pdfUrl || null,
        barangayId: input.type === "BARANGAY" ? input.barangayId : null,
        status: input.status || "DRAFT",
        submittedById: submitterId,
        approvedAt:
          input.status === "APPROVED" ? new Date() : null,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/ordinances");
    revalidatePath("/ordinances");

    return { success: true, ordinance: created };
  } catch (error: unknown) {
    console.error("createOrdinanceAction error:", error);
    const msg =
      error instanceof Error ? error.message : "Hindi nai-save ang ordinansa.";
    return { success: false, error: msg };
  }
}

/**
 * Toggle the status of an ordinance (DRAFT <-> APPROVED).
 */
export async function toggleOrdinanceStatusAction(id: string, currentStatus: OrdinanceStatus) {
  try {
    const nextStatus: OrdinanceStatus =
      currentStatus === "APPROVED" ? "DRAFT" : "APPROVED";

    const updated = await prisma.ordinance.update({
      where: { id },
      data: {
        status: nextStatus,
        approvedAt: nextStatus === "APPROVED" ? new Date() : null,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/ordinances");
    revalidatePath("/ordinances");
    revalidatePath(`/ordinances/${id}`);

    return { success: true, ordinance: updated };
  } catch (error: unknown) {
    console.error("toggleOrdinanceStatusAction error:", error);
    return { success: false, error: "Hindi nabago ang status." };
  }
}

/**
 * Delete an ordinance by ID.
 */
export async function deleteOrdinanceAction(id: string) {
  try {
    await prisma.ordinance.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/ordinances");
    revalidatePath("/ordinances");

    return { success: true };
  } catch (error: unknown) {
    console.error("deleteOrdinanceAction error:", error);
    return { success: false, error: "Hindi nabura ang ordinansa." };
  }
}
