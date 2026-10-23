import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";
import type { UserRole } from "@/types/next-auth";

const { auth } = NextAuth(authConfig);

const adminRoles = new Set<UserRole>(["ADMIN"]);
const officerRoles = new Set<UserRole>(["MUNICIPAL_OFFICER", "ADMIN"]);
const authenticatedRoles = new Set<UserRole>(["CITIZEN", "MUNICIPAL_OFFICER", "ADMIN"]);

function withCallbackUrl(url: URL) {
  return `${url.pathname}${url.search}`;
}

export default auth((request) => {
  const { nextUrl } = request;
  const role = request.auth?.user?.role;
  const isAuthenticated = Boolean(request.auth?.user) && Boolean(role);
  const pathname = nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", withCallbackUrl(nextUrl));
      return NextResponse.redirect(loginUrl);
    }

    if (!adminRoles.has(role as UserRole)) {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  if (pathname.startsWith("/officer") || pathname.startsWith("/triage")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", withCallbackUrl(nextUrl));
      return NextResponse.redirect(loginUrl);
    }

    if (!officerRoles.has(role as UserRole)) {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  if (pathname.startsWith("/report") || pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", withCallbackUrl(nextUrl));
      return NextResponse.redirect(loginUrl);
    }

    if (!authenticatedRoles.has(role as UserRole)) {
      return NextResponse.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/officer/:path*", "/triage/:path*", "/report/:path*", "/dashboard/:path*"],
};
