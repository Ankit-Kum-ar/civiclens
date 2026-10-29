import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Zero-env CORS for Expo → /api/* (no CORS_ORIGINS to configure).
 * Allowlist only: known app hosts + localhost/LAN Expo ports.
 */
const STATIC_ALLOWED = new Set([
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "http://localhost:19006",
  "http://127.0.0.1:19006",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://civiclens-seven-taupe.vercel.app",
  "https://civiclens.vercel.app",
]);

const EXPO_PORTS = new Set(["8081", "19006", "3000", ""]);

function isPrivateLanHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)
  );
}

function isAllowedOrigin(origin: string | null): origin is string {
  if (!origin) return false;
  if (STATIC_ALLOWED.has(origin)) return true;
  try {
    const url = new URL(origin);
    // Expo / device testing only over private LAN + known ports (not open internet)
    if (url.protocol === "http:" && isPrivateLanHost(url.hostname) && EXPO_PORTS.has(url.port)) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

function withCors(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get("origin");
  if (isAllowedOrigin(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Vary", "Origin");
  }
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    [
      "Accept",
      "Authorization",
      "Content-Type",
      "X-Auth-Return-Redirect",
      "X-Requested-With",
      "Cookie",
    ].join(", ")
  );
  res.headers.set("Access-Control-Max-Age", "86400");
  return res;
}

export function middleware(req: NextRequest) {
  // Preflight
  if (req.method === "OPTIONS") {
    return withCors(req, new NextResponse(null, { status: 204 }));
  }

  return withCors(req, NextResponse.next());
}

export const config = {
  matcher: ["/api/:path*"],
};
