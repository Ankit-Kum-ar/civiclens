import pino from "pino";

const isServer = typeof window === "undefined";
const isDev = process.env.NODE_ENV !== "production";
const logLevel = process.env.LOG_LEVEL || "info";

export const logger =
  isServer && isDev
    ? pino({
        level: logLevel,
        browser: { asObject: true },
        // Use basic formatting without node-only transport worker threads in Next.js SSR/client
      })
    : pino({
        level: logLevel,
        browser: { asObject: true },
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
          level(label: string) {
            return { level: label };
          },
        },
      });

export default logger;
