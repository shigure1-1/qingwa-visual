import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import { CommerceError, notReady } from "@/lib/commerce/errors";
import { getCommerceEnv } from "@/lib/env/server";

export const COMMERCE_SESSION_COOKIE = "qingwa_commerce_session";
const tokenPattern = /^[A-Za-z0-9_-]{43}$/;

function getSessionSecret(): string {
  const result = getCommerceEnv();
  if (!result.ok || !result.env.COMMERCE_SESSION_SECRET) {
    throw notReady();
  }
  return result.env.COMMERCE_SESSION_SECRET;
}

export function createGuestSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function isGuestSessionToken(value: string | undefined): value is string {
  return typeof value === "string" && tokenPattern.test(value);
}

export function hashGuestSessionToken(token: string): string {
  if (!isGuestSessionToken(token)) {
    throw new CommerceError(
      "COMMERCE_UNAUTHORIZED",
      "Invalid commerce session",
      401,
    );
  }

  return createHmac("sha256", getSessionSecret()).update(token).digest("hex");
}

export function verifySharedSecret(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function readCookieValue(request: Request, name: string): string | undefined {
  const cookie = request.headers.get("cookie");
  if (!cookie) return undefined;

  for (const part of cookie.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (rawName === name) {
      return decodeURIComponent(rawValue.join("="));
    }
  }

  return undefined;
}

export function sessionCookie(token: string): string {
  return `${COMMERCE_SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=2592000`;
}
