import { NextRequest, NextResponse } from "next/server";

// App routes that should NOT be treated as short codes
const APP_ROUTES = [
  "/dashboard",
  "/admin",
  "/login",
  "/register",
  "/api",
  "/go",
  "/_next",
  "/favicon.ico",
  "/privacy",
  "/terms",
  "/support",
];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Skip app routes
  if (APP_ROUTES.some((route) => path.startsWith(route)) || path === "/") {
    return NextResponse.next();
  }

  // Check if this looks like a short code (alphanumeric, 4-10 chars)
  const shortCode = path.slice(1); // Remove leading slash
  if (/^[a-zA-Z0-9]{4,10}$/.test(shortCode)) {
    // Rewrite to the interstitial page handler
    return NextResponse.rewrite(new URL(`/go/${shortCode}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.png$|.*\\.svg$|.*\\.ico$).*)"],
};
