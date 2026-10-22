import { NextResponse } from "next/server";
import { connectDB, getConnectionState, ConnectionReadyState } from "@/lib/db";
import { logger } from "@/lib/logger";

// Map Mongoose readyState numbers to human-readable status
const MONGO_STATES: Record<number, string> = {
  [ConnectionReadyState.DISCONNECTED]: "disconnected",
  [ConnectionReadyState.CONNECTED]: "connected",
  [ConnectionReadyState.CONNECTING]: "connecting",
  [ConnectionReadyState.DISCONNECTING]: "disconnecting",
};

export async function GET() {
  // Proactively attempt connection to accurately verify database status
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
    }
  } catch (error) {
    logger.warn({ err: error }, "Database connection failed during health check");
  }

  const dbStateCode = getConnectionState();
  const isDbConnected = dbStateCode === ConnectionReadyState.CONNECTED;

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

  const isHealthy = isDbConnected && envCheck.mongodb;

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

  logger.info(
    {
      status: payload.status,
      database: payload.services.database.status,
      uptime: payload.uptime,
    },
    "Health check performed"
  );

  return NextResponse.json(payload, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
