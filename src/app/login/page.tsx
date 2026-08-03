import type { Metadata } from "next";
import { LoginClient } from "./login-client";

export const metadata: Metadata = {
  title: "Mag-login | Cabanatuan City Ordinance Hub",
  description: "Mag-login sa Cabanatuan City Ordinance Hub at LGU Portal",
};

/**
 * Login Page — Server Component wrapper around the interactive LoginClient.
 * Features winauth.net-inspired split aurora layout and light/dark theme toggling.
 */
export default function LoginPage() {
  return <LoginClient />;
}
