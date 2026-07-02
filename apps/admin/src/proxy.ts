import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory rate limit for the credentials login endpoint.
// Edge runtime shares memory within a single worker instance — good enough
// for an admin panel with one user. For multi-instance deployments, replace
// with Redis via @upstash/ratelimit.
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

function getIp(req: NextRequest): string {
  // Use the rightmost XFF entry (appended by our reverse proxy, not client-supplied)
  // so clients can't spoof a fresh IP by setting X-Forwarded-For themselves.
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",");
    return parts[parts.length - 1].trim();
  }
  return "unknown";
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Rate-limit the credentials callback before NextAuth processes it.
  // This runs on the outer request before NextAuth's own handler fires.
  if (pathname === "/api/auth/callback/credentials") {
    if (isRateLimited(getIp(req))) {
      return new NextResponse("Too many login attempts. Try again later.", {
        status: 429,
      });
    }
    return NextResponse.next();
  }

  const isAdmin = req.auth?.user?.role === "admin";

  if (pathname === "/login") {
    if (isAdmin) return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.next();
  }

  if (!isAdmin) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Rate-limit the credentials callback
    "/api/auth/callback/credentials",
    // Protect all pages except static assets — but NOT other /api/auth/* routes
    // so NextAuth can handle signin/signout/session without proxy interference.
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
