import "server-only";

import { notReady } from "@/lib/commerce/errors";
import {
  evaluateCommerceReadiness,
  evaluatePaymentReadiness,
  evaluateReconcileReadiness,
  type CommerceReadiness,
} from "@/lib/commerce/readiness";
import type { PaymentProviderName } from "@/lib/env/commerce";
import { getCommerceEnv } from "@/lib/env/server";

export function getCommerceContext() {
  const result = getCommerceEnv();
  if (!result.ok) throw notReady();

  const readiness = evaluateCommerceReadiness(result.env);
  if (!readiness.ready) throw notReady();

  return { env: result.env, readiness };
}

export function getPaymentContext(provider: PaymentProviderName) {
  const result = getCommerceEnv();
  if (!result.ok) throw notReady();

  const readiness = evaluatePaymentReadiness(result.env, provider);
  if (!readiness.ready) throw notReady();

  return { env: result.env, readiness };
}

export function getReconcileContext() {
  const result = getCommerceEnv();
  if (!result.ok) throw notReady();

  const readiness = evaluateReconcileReadiness(result.env);
  if (!readiness.ready) throw notReady();

  return { env: result.env, readiness };
}

export function getCommerceReadiness(): CommerceReadiness | { ready: false; missing: string[] } {
  const result = getCommerceEnv();
  return result.ok
    ? evaluateCommerceReadiness(result.env)
    : { ready: false, missing: result.issues };
}
