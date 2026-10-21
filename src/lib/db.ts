import mongoose from "mongoose";

/**
 * Interface representing the cached Mongoose connection structure.
 */
export interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * MongoDB connection states matching Mongoose readyState values.
 */
export enum ConnectionReadyState {
  DISCONNECTED = 0,
  CONNECTED = 1,
  CONNECTING = 2,
  DISCONNECTING = 3,
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global cache object across Next.js hot reloads in development.
 */
const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connects to MongoDB using Mongoose and caches the connection singleton.
 * Suitable for Next.js Server Actions, Route Handlers, and SSR.
 *
 * @returns {Promise<typeof mongoose>} The connected Mongoose instance.
 */
export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI || MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Invalid/Missing environment variable: 'MONGODB_URI'. Please define it in your .env.local file."
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

/**
 * Helper to retrieve the current connection status.
 */
export function getConnectionState(): ConnectionReadyState {
  return mongoose.connection.readyState as unknown as ConnectionReadyState;
}

export default connectDB;
