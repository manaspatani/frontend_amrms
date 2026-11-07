import { ApiError } from "./types";

export { ApiError };

/**
 * Simulates network latency with a delay between minMs and maxMs (defaults to 300-800ms).
 */
export async function delay(minMs = 300, maxMs = 800): Promise<void> {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Checks whether an unknown error is an instance of ApiError.
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Creates a generic ApiError instance.
 */
export function createApiError(
  status: number,
  code: string,
  message: string,
  details?: unknown
): ApiError {
  return new ApiError(status, code, message, details);
}

/**
 * Error helper for 404 Not Found.
 */
export function notFoundError(entity: string, id: string): ApiError {
  return new ApiError(404, "not_found", `${entity} '${id}' not found`);
}

/**
 * Error helper for 409 Conflict.
 */
export function conflictError(message = "Operation conflict", code = "conflict"): ApiError {
  return new ApiError(409, code, message);
}

/**
 * Error helper for 400 Bad Request.
 */
export function badRequestError(message: string, details?: unknown): ApiError {
  return new ApiError(400, "bad_request", message, details);
}
