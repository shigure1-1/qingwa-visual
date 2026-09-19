import {
  createDecipheriv,
  createHash,
  randomBytes,
  sign,
  verify,
} from "node:crypto";

import { CommerceError } from "@/lib/commerce/errors";

export function normalizePem(value: string): string {
  return value.replace(/\\n/g, "\n").trim();
}

export function randomNonce(length = 24): string {
  return randomBytes(length).toString("base64url").slice(0, length);
}

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function signRsaSha256(content: string, privateKey: string): string {
  try {
    return sign("RSA-SHA256", Buffer.from(content), normalizePem(privateKey)).toString("base64");
  } catch {
    throw new CommerceError(
      "COMMERCE_NOT_READY",
      "Payment private key is invalid",
      503,
    );
  }
}

export function verifyRsaSha256(
  content: string,
  signature: string,
  publicKey: string,
): boolean {
  try {
    return verify(
      "RSA-SHA256",
      Buffer.from(content),
      normalizePem(publicKey),
      Buffer.from(signature, "base64"),
    );
  } catch {
    return false;
  }
}

export function decryptAes256Gcm(input: {
  ciphertext: string;
  nonce: string;
  associatedData?: string;
  key: string;
}): string {
  const key = Buffer.from(input.key, "utf8");
  if (key.length !== 32) {
    throw new CommerceError(
      "COMMERCE_NOT_READY",
      "WeChat API v3 key must be exactly 32 bytes",
      503,
    );
  }

  try {
    const encrypted = Buffer.from(input.ciphertext, "base64");
    const tag = encrypted.subarray(encrypted.length - 16);
    const body = encrypted.subarray(0, encrypted.length - 16);
    const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(input.nonce));
    decipher.setAuthTag(tag);
    decipher.setAAD(Buffer.from(input.associatedData ?? ""));
    return Buffer.concat([decipher.update(body), decipher.final()]).toString("utf8");
  } catch {
    throw new CommerceError(
      "COMMERCE_PROVIDER_ERROR",
      "WeChat webhook decryption failed",
      400,
    );
  }
}
