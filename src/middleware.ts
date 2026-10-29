import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * CORS for Expo / mobile clients calling /api/* from another origin
 * (e.g. Expo web at http://localhost:8081 → Vercel API).
 */
const STATIC_ALLOWED = [
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://civiclens-seven-taupe.vercel.app",
  "https://civiclens.vercel.app",
];

function allowedOrigins(): string[] {
  const fromEnv = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  return [...STATIC_ALLOWED, ...fromEnv];
}

function isAllowedOrigin(origin: string | null): origin is string {
  if (!origin) return false;
  if (allowedOrigins().includes(origin)) return true;
  // Expo / LAN device testing: http://192.168.x.x:8081
  try {
    const url = new URL(origin);
    if (
      (url.hostname === "localhost" ||
        url.hostname === "127.0.0.1" ||
        /^192\.168\.\d{1,3}\.\d{1,3}$/.test(url.hostname) ||
        /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(url.hostname)) &&
      (url.port === "8081" || url.port === "19006" || url.port === "3000" || url.port === "")
    ) {
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
