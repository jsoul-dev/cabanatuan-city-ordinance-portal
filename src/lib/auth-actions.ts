"use server";

import { compare } from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setSessionCookie, clearSessionCookie, getSession, type SessionPayload } from "@/lib/auth";

export interface LoginResult {
  error?: string;
}

/**
 * Server Action: Authenticate user with email and password.
 * Sets a session cookie on success.
 */
export async function login(
  _prevState: LoginResult | undefined,
  formData: FormData
): Promise<LoginResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email at password ay kinakailangan." };
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: { barangay: true },
  });

  if (!user) {
    return { error: "Hindi tamang email o password." };
  }

  const isValid = await compare(password, user.passwordHash);
  if (!isValid) {
    return { error: "Hindi tamang email o password." };
  }

  const session: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    barangayId: user.barangayId,
  };

  await setSessionCookie(session);

  if (user.role === "LGU_ADMIN") {
    redirect("/admin/lgu");
  } else if (user.role === "BARANGAY_ADMIN") {
    redirect("/admin/barangay");
  } else {
    redirect("/");
  }
}

/**
 * Server Action: Log out the current user.
 */
export async function logout() {
  await clearSessionCookie();
  redirect("/login");
}

/**
 * Server Action: Get the current session for client components.
 */
export async function checkSession() {
  return await getSession();
}
