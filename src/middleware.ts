import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("pacul_token")?.value;
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isGov = pathname.startsWith("/gov");
  const isLogin = pathname === "/login";
  const isRegister = pathname === "/register";
  const isGovLogin = pathname === "/gov/login";

  // Protected routes require token
  if ((isDashboard || (isGov && !isGovLogin)) && !token) {
    const loginUrl = isGov ? "/gov/login" : "/login";
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  // Redirect authenticated users away from login/register
  if ((isLogin || isRegister) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/gov/:path*", "/login", "/register"],
};
