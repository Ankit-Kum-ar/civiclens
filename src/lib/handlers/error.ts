import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logger } from "@/lib/logger";
import { RequestError, ValidationError, formatZodErrors, FieldError } from "@/lib/http-errors";

export interface ErrorResponseBody {
  success: false;
  error: {
    message: string;
    statusCode: number;
    errors?: FieldError[] | Record<string, unknown>;
  };
}

export interface ErrorHandlerOptions {
  context?: string;
  logLevel?: "error" | "warn" | "info";
}

/**
 * Normalizes any error into a standardized error payload and status code.
 * Logs full details server-side while safeguarding client response payloads.
 */
export function formatErrorResponse(
  error: unknown,
  options?: ErrorHandlerOptions
): { statusCode: number; body: ErrorResponseBody } {
  const context = options?.context ? `[${options.context}] ` : "";

  if (error instanceof ValidationError) {
    logger.warn(
      { err: error, errors: error.errors },
      `${context}Validation error: ${error.message}`
    );
    return {
      statusCode: error.statusCode,
      body: {
        success: false,
        error: {
          message: error.message,
          statusCode: error.statusCode,
          errors: error.errors,
        },
      },
    };
  }

  if (error instanceof ZodError) {
    const formattedErrors = formatZodErrors(error);
    logger.warn(
      { err: error, errors: formattedErrors },
      `${context}Zod validation failure: ${error.message}`
    );
    return {
      statusCode: 400,
      body: {
        success: false,
        error: {
          message: "Validation failed",
          statusCode: 400,
          errors: formattedErrors,
        },
      },
    };
  }

  if (error instanceof RequestError) {
    if (error.statusCode >= 500) {
      logger.error({ err: error }, `${context}Request error: ${error.message}`);
    } else {
      logger.warn({ err: error }, `${context}Client error: ${error.message}`);
    }

    return {
      statusCode: error.statusCode,
      body: {
        success: false,
        error: {
          message: error.message,
          statusCode: error.statusCode,
          errors: error.errors,
        },
      },
    };
  }

  // Unhandled / generic server exception
  logger.error({ err: error }, `${context}Unhandled server exception`);

  return {
    statusCode: 500,
    body: {
      success: false,
      error: {
        message: "An internal server error occurred",
        statusCode: 500,
      },
    },
  };
}

/**
 * Global error handler for Next.js Route Handlers (returns NextResponse.json).
 */
export function handleApiError(
  error: unknown,
  options?: ErrorHandlerOptions
): NextResponse<ErrorResponseBody> {
  const { statusCode, body } = formatErrorResponse(error, options);
  return NextResponse.json(body, { status: statusCode });
}

/**
 * Global error handler for Server Actions (returns plain object).
 */
export function handleActionError(
  error: unknown,
  options?: ErrorHandlerOptions
): ErrorResponseBody {
  const { body } = formatErrorResponse(error, options);
  return body;
}
