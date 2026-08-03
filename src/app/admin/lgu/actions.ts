"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { hash } from "bcryptjs";

// ─── Ordinance Actions ───────────────────────────────────────────────────────

export async function approveOrdinance(ordinanceId: string): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session || session.role !== "LGU_ADMIN") return { error: "Hindi awtorisado." };

  await prisma.ordinance.update({
    where: { id: ordinanceId },
    data: { status: "APPROVED", reviewedById: session.userId, approvedAt: new Date() },
  });

  revalidatePath("/admin/lgu");
  revalidatePath("/admin/lgu/ordinances");
  revalidatePath("/ordinances");
  return {};
}

export async function rejectOrdinance(ordinanceId: string, reason: string): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session || session.role !== "LGU_ADMIN") return { error: "Hindi awtorisado." };
  if (!reason.trim()) return { error: "Kailangan ng dahilan ng pagtanggi." };

  await prisma.ordinance.update({
    where: { id: ordinanceId },
    data: { status: "REJECTED", reviewedById: session.userId, rejectedReason: reason.trim() },
  });

  revalidatePath("/admin/lgu");
  revalidatePath("/admin/lgu/ordinances");
  return {};
}

export async function deleteOrdinance(ordinanceId: string): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session || session.role !== "LGU_ADMIN") return { error: "Hindi awtorisado." };

  await prisma.ordinance.delete({ where: { id: ordinanceId } });

  revalidatePath("/admin/lgu");
  revalidatePath("/admin/lgu/ordinances");
  revalidatePath("/ordinances");
  return {};
}

// ─── User Actions ────────────────────────────────────────────────────────────

export async function createUser(formData: FormData): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session || session.role !== "LGU_ADMIN") return { error: "Hindi awtorisado." };

  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const name = (formData.get("name") as string)?.trim();
  const role = formData.get("role") as string;
  const barangayId = (formData.get("barangayId") as string) || null;
  const password = (formData.get("password") as string) || "password123";

  if (!email || !name || !role) return { error: "Lahat ng field ay kinakailangan." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "May umiiral na account sa email na ito." };

  const passwordHash = await hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      name,
      role: role as never,
      passwordHash,
      barangayId: barangayId || null,
    },
  });

  revalidatePath("/admin/lgu/users");
  return {};
}

export async function deleteUser(userId: string): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session || session.role !== "LGU_ADMIN") return { error: "Hindi awtorisado." };
  if (session.userId === userId) return { error: "Hindi mo matatanggal ang sarili mong account." };

  await prisma.user.delete({ where: { id: userId } });

  revalidatePath("/admin/lgu/users");
  return {};
}

// ─── Report Actions ───────────────────────────────────────────────────────────

export async function updateReportStatus(reportId: string, status: string): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session || session.role !== "LGU_ADMIN") return { error: "Hindi awtorisado." };

  await prisma.report.update({
    where: { id: reportId },
    data: {
      status: status as never,
      ...(status === "RESOLVED" ? { resolvedAt: new Date() } : {}),
    },
  });

  revalidatePath("/admin/lgu/reports");
  revalidatePath("/admin/lgu");
  return {};
}
