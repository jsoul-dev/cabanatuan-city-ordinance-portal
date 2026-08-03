import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

/**
 * /admin root — redirect to the correct portal based on role.
 * - LGU_ADMIN → /admin/lgu
 * - CAPTAIN | SECRETARY | KAGAWAD → /admin/barangay
 * - unauthenticated → /login
 */
export default async function AdminRootPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  if (session.role === "LGU_ADMIN") redirect("/admin/lgu");

  if (["CAPTAIN", "SECRETARY", "KAGAWAD"].includes(session.role)) {
    redirect("/admin/barangay");
  }

  redirect("/login");
}
