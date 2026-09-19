import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getCommerceContext } from "@/lib/commerce/runtime";
import { notReady } from "@/lib/commerce/errors";
import { getCommerceEnv } from "@/lib/env/server";
import type { Database } from "@/lib/supabase/database.types";

function createAdminClient(url: string, serviceRoleKey: string): SupabaseClient<Database> {
  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
    global: {
      headers: { "X-Client-Info": "qingwa-commerce-server" },
    },
  });
}

export function createSupabaseAdmin(): SupabaseClient<Database> {
  const { env } = getCommerceContext();
  return createAdminClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);
}

export function createSupabaseCatalogAdmin(): SupabaseClient<Database> {
  const result = getCommerceEnv();
  if (!result.ok || !result.env.SUPABASE_URL || !result.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw notReady("商品目录尚未配置");
  }

  return createAdminClient(result.env.SUPABASE_URL, result.env.SUPABASE_SERVICE_ROLE_KEY);
}
