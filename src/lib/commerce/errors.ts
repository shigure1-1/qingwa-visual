import { COMMERCE_NOT_READY } from "@/lib/env/commerce";

export type CommerceErrorCode =
  | typeof COMMERCE_NOT_READY
  | "COMMERCE_INVALID_REQUEST"
  | "COMMERCE_UNAUTHORIZED"
  | "COMMERCE_NOT_FOUND"
  | "COMMERCE_CONFLICT"
  | "COMMERCE_PROVIDER_ERROR"
  | "COMMERCE_INTERNAL_ERROR";

export class CommerceError extends Error {
  readonly code: CommerceErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(code: CommerceErrorCode, message: string, status: number, details?: unknown) {
    super(message);
    this.name = "CommerceError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function notReady(message = "Commerce is not ready"): CommerceError {
  return new CommerceError(COMMERCE_NOT_READY, message, 503);
}

export function asCommerceError(error: unknown): CommerceError {
  if (error instanceof CommerceError) {
    return error;
  }

  return new CommerceError(
    "COMMERCE_INTERNAL_ERROR",
    "Commerce request failed",
    500,
  );
}
