import "server-only";

import { parseCommerceEnv, type CommerceEnv } from "@/lib/env/commerce";

export type CommerceEnvResult =
  | { ok: true; env: CommerceEnv }
  | { ok: false; issues: string[] };

export function getCommerceEnv(): CommerceEnvResult {
  const parsed = parseCommerceEnv(process.env);

  if (!parsed.success) {
    return {
      ok: false,
      issues: parsed.error.issues.map((issue) =>
        issue.path.length > 0 ? issue.path.join(".") : "environment",
      ),
    };
  }

  return { ok: true, env: parsed.data };
}
