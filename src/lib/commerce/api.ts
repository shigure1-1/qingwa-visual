import "server-only";

import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { asCommerceError, CommerceError } from "@/lib/commerce/errors";
import { evaluateCommerceReadiness } from "@/lib/commerce/readiness";
import { getCommerceEnv } from "@/lib/env/server";

export const noStoreHeaders = {
  "Cache-Control": "no-store",
};

export function jsonOk<T>(data: T, init: ResponseInit = {}) {
  return NextResponse.json(data, {
    ...init,
    headers: { ...noStoreHeaders, ...init.headers },
  });
}

export function jsonError(error: unknown) {
  const normalized = error instanceof ZodError
    ? new CommerceError("COMMERCE_INVALID_REQUEST", "请求参数无效", 400)
    : asCommerceError(error);

  return NextResponse.json(
    { ok: false, code: normalized.code, message: normalized.message },
    { status: normalized.status, headers: noStoreHeaders },
  );
}

export function requireWritableCommerce() {
  const result = getCommerceEnv();
  if (!result.ok) {
    throw new CommerceError("COMMERCE_NOT_READY", "商城服务尚未配置完成", 503);
  }

  const readiness = evaluateCommerceReadiness(result.env);
  if (!readiness.ready) {
    throw new CommerceError("COMMERCE_NOT_READY", "商城交易尚未开放", 503);
  }

  return { env: result.env, readiness };
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new CommerceError("COMMERCE_INVALID_REQUEST", "请求体必须是有效 JSON", 400);
  }
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return;

  const requestOrigin = new URL(request.url).origin;
  if (origin !== requestOrigin) {
    throw new CommerceError("COMMERCE_UNAUTHORIZED", "请求来源无效", 403);
  }
}
