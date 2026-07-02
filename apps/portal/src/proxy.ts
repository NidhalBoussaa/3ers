import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory rate limit — works correctly in a single long-running Node process
// (Docker standalone). If ever deployed to a serverless/edge runtime, replace
// with a distributed store (e.g. Upstash Redis) so state survives cold starts.
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
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

  if (pathname === "/api/auth/callback/credentials") {
    if (isRateLimited(getIp(req))) {
      return new NextResponse("Too many login attempts. Try again later.", {
        status: 429,
      });
    }
    return NextResponse.next();
  }

  const isClient = req.auth?.user?.role === "client";

  if (pathname === "/login") {
    if (isClient) return NextResponse.redirect(new URL("/order", req.url));
    return NextResponse.next();
  }

  if (!isClient) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/api/auth/callback/credentials",
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
