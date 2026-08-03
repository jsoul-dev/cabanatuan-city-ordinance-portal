import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Routes that require authentication and their allowed roles
const PROTECTED_ROUTES: Record<string, string[]> = {
  "/admin/barangay": ["CAPTAIN", "SECRETARY", "KAGAWAD"],
  "/admin/lgu": ["LGU_ADMIN"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const matchedRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
    pathname.startsWith(route)
  );

  if (!matchedRoute) {
    return NextResponse.next();
  }

  // Get session token from cookie
  const token = request.cookies.get("ordinance-hub-session")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const session = await verifyToken(token);

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role authorization
  const allowedRoles = PROTECTED_ROUTES[matchedRoute];
  if (!allowedRoles.includes(session.role)) {
    // Redirect unauthorized users to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
