import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginClient } from "./login-client";

export const metadata: Metadata = {
  title: "Mag-login | Cabanatuan City Ordinance Hub",
  description: "Mag-login sa Cabanatuan City Ordinance Hub at LGU Portal",
};

/**
 * Login Page — Server Component wrapper around the interactive LoginClient.
 * Features winauth.net-inspired split aurora layout and light/dark theme toggling.
 */
export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    if (session.role === "LGU_ADMIN") redirect("/admin/lgu");
    else redirect("/admin/barangay");
  }

  return <LoginClient />;
}
