import { ZodError } from "zod";

export interface FieldError {
  field: string;
  message: string;
}

/**
 * Base HTTP request error class.
 */
export class RequestError extends Error {
  public readonly statusCode: number;
  public readonly errors?: FieldError[] | Record<string, unknown>;

  constructor(
    message: string,
    statusCode = 500,
    errors?: FieldError[] | Record<string, unknown>
  ) {
    super(message);
    this.name = "RequestError";
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Helper to flatten Zod issues into field-level error details.
 */
export function formatZodErrors(error: ZodError): FieldError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "root",
    message: issue.message,
  }));
}

/**
 * Validation error (HTTP 400).
 */
export class ValidationError extends RequestError {
  constructor(
    message = "Validation failed",
    errors?: FieldError[] | ZodError | Record<string, unknown>
  ) {
    let formattedErrors: FieldError[] | Record<string, unknown> | undefined;

    if (errors instanceof ZodError) {
      formattedErrors = formatZodErrors(errors);
    } else {
      formattedErrors = errors;
    }

    super(message, 400, formattedErrors);
    this.name = "ValidationError";
  }
}

/**
 * Unauthorized error (HTTP 401).
 */
export class UnauthorizedError extends RequestError {
  constructor(message = "Unauthorized access") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

/**
 * Forbidden error (HTTP 403).
 */
export class ForbiddenError extends RequestError {
  constructor(message = "Forbidden resource") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

/**
 * Not found error (HTTP 404).
 */
export class NotFoundError extends RequestError {
  constructor(message = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}
