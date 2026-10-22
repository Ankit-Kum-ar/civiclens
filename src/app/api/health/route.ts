import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Map Mongoose readyState numbers to human-readable status
const MONGO_STATES: Record<number, string> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

export async function GET() {
  const dbStateCode = mongoose.connection?.readyState ?? 0;
  const isDbConnected = dbStateCode === 1;

  // Environment sanity checks (true/false flags only, never exposing secret values)
  const envCheck = {
    mongodb: Boolean(process.env.MONGODB_URI),
    authSecret: Boolean(process.env.AUTH_SECRET),
    googleAuth: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
    cloudinary: Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ),
  };

  const isHealthy = envCheck.mongodb; // Healthy if base configs exist

  const payload = {
    status: isHealthy ? "healthy" : "degraded",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    services: {
      server: "running",
      database: {
        status: MONGO_STATES[dbStateCode] || "unknown",
        connected: isDbConnected,
      },
    },
    env: {
      configured: envCheck,
      missing: Object.entries(envCheck)
        .filter(([, isConfigured]) => !isConfigured)
        .map(([name]) => name),
    },
  };

  return NextResponse.json(payload, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
