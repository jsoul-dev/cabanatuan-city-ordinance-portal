import { cookies } from "next/headers";
import { prisma } from "./prisma";
import {
  createToken,
  verifyToken,
  COOKIE_NAME,
  type SessionPayload,
} from "./jwt";

export * from "./jwt";

/**
 * Set the session cookie after login.
 */
export async function setSessionCookie(session: SessionPayload) {
  const token = await createToken(session);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Clear the session cookie (logout).
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Get the current user's session from the cookie.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Get the full current user from the database (not just JWT claims).
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    include: { barangay: true },
  });
}
