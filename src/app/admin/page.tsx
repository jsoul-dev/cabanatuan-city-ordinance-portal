import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

/**
 * /admin root — redirect to the correct portal based on role.
 * - LGU_ADMIN → /admin/lgu
 * - BARANGAY_ADMIN → /admin/barangay
 */
export default async function AdminIndexRoute() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role === "LGU_ADMIN") {
    redirect("/admin/lgu");
  }

  if (["BARANGAY_ADMIN"].includes(session.role)) {
    redirect("/admin/barangay");
  }

  redirect("/login");
}
