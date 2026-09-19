import "server-only";

import { createHash } from "node:crypto";
import { cookies } from "next/headers";

import {
  COMMERCE_SESSION_COOKIE,
  createGuestSessionToken,
  hashGuestSessionToken,
  isGuestSessionToken,
} from "@/lib/commerce/session";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { getCommerceEnv } from "@/lib/env/server";
import { notReady } from "@/lib/commerce/errors";

export async function getOrCreateGuestSession() {
  const cookieStore = await cookies();
  const current = cookieStore.get(COMMERCE_SESSION_COOKIE)?.value;
  const token = isGuestSessionToken(current) ? current : createGuestSessionToken();
  const env = getCommerceEnv();

  if (!env.ok || env.env.COMMERCE_MODE === "catalog") {
    throw notReady("商城交易尚未开放");
  }

  const tokenHash = hashGuestSessionToken(token);
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("guest_sessions")
    .upsert({ token_hash: tokenHash, last_seen_at: new Date().toISOString() }, { onConflict: "token_hash" })
    .select("id")
    .single();

  if (error || !data) throw notReady("游客会话无法建立");

  if (!current) {
    cookieStore.set(COMMERCE_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 2_592_000,
    });
  }

  return { id: data.id as string, tokenHash };
}

export async function requireGuestSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COMMERCE_SESSION_COOKIE)?.value;
  if (!isGuestSessionToken(token)) throw notReady("游客会话尚未建立");

  const tokenHash = hashGuestSessionToken(token);
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("guest_sessions")
    .select("id")
    .eq("token_hash", tokenHash)
    .single();

  if (error || !data) throw notReady("游客会话尚未建立");
  return { id: data.id as string, tokenHash };
}

export function hashIdempotencyKey(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
