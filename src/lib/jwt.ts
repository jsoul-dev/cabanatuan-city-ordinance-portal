import { SignJWT, jwtVerify } from "jose";
export type UserRole =
  | "CITIZEN"
  | "BARANGAY_ADMIN"
  | "LGU_ADMIN";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback-secret-change-me"
);

export const COOKIE_NAME = "ordinance-hub-session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  barangayId: string | null;
}

/**
 * Create a signed JWT from user session data.
 * 100% Edge-compatible via jose (no Node.js crypto or database dependency).
 */
export async function createToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT token.
 * 100% Edge-compatible via jose.
 */
export async function verifyToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
