import type { CommerceEnv, PaymentProviderName } from "@/lib/env/commerce";

export type CommerceReadiness = {
  ready: boolean;
  mode: CommerceEnv["COMMERCE_MODE"];
  provider: PaymentProviderName;
  availableProviders: Array<Exclude<PaymentProviderName, "disabled">>;
  missing: string[];
};

const commerceKeys = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "COMMERCE_SESSION_SECRET",
] as const satisfies readonly (keyof CommerceEnv)[];

const liveKeys = [
  "COMMERCE_PUBLIC_BASE_URL",
  "COMMERCE_SHIPPING_RULE_VERSION",
  "COMMERCE_TERMS_VERSION",
  "COMMERCE_PRIVACY_VERSION",
  "COMMERCE_REFUND_POLICY_VERSION",
] as const satisfies readonly (keyof CommerceEnv)[];

const paymentKeys = {
  disabled: [] as const,
  wechat: [
    "WECHAT_PAY_MCH_ID",
    "WECHAT_PAY_APP_ID",
    "WECHAT_PAY_MCH_SERIAL_NO",
    "WECHAT_PAY_PRIVATE_KEY",
    "WECHAT_PAY_PLATFORM_SERIAL_NO",
    "WECHAT_PAY_PLATFORM_PUBLIC_KEY",
    "WECHAT_PAY_API_V3_KEY",
    "WECHAT_PAY_NOTIFY_URL",
  ] as const,
  alipay: [
    "ALIPAY_APP_ID",
    "ALIPAY_SELLER_ID",
    "ALIPAY_PRIVATE_KEY",
    "ALIPAY_PUBLIC_KEY",
    "ALIPAY_NOTIFY_URL",
  ] as const,
} satisfies Record<PaymentProviderName, readonly (keyof CommerceEnv)[]>;

function missingKeys(env: CommerceEnv, keys: readonly (keyof CommerceEnv)[]): string[] {
  return keys.filter((key) => !env[key]).map(String);
}

function hasPublicHttpsUrl(value: string | undefined): boolean {
  if (!value) return false;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    return !["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return false;
  }
}

function providerMissing(env: CommerceEnv, provider: Exclude<PaymentProviderName, "disabled">) {
  return missingKeys(env, paymentKeys[provider]);
}

function getAvailableProviders(env: CommerceEnv) {
  return (["wechat", "alipay"] as const).filter(
    (provider) => providerMissing(env, provider).length === 0,
  );
}

export function evaluateCommerceReadiness(env: CommerceEnv): CommerceReadiness {
  const missing = env.COMMERCE_MODE === "catalog" ? ["COMMERCE_MODE"] : missingKeys(env, commerceKeys);

  if (env.COMMERCE_MODE === "live") {
    missing.push(...missingKeys(env, liveKeys));
    if (!hasPublicHttpsUrl(env.COMMERCE_PUBLIC_BASE_URL)) {
      missing.push("COMMERCE_PUBLIC_BASE_URL_HTTPS");
    }
  }

  const availableProviders = getAvailableProviders(env);
  if (env.COMMERCE_MODE !== "catalog" && availableProviders.length === 0) {
    missing.push("PAYMENT_PROVIDER");
  }

  return {
    ready: missing.length === 0,
    mode: env.COMMERCE_MODE,
    provider: "disabled",
    availableProviders,
    missing: [...new Set(missing)],
  };
}

export function evaluatePaymentReadiness(
  env: CommerceEnv,
  provider: PaymentProviderName,
): CommerceReadiness {
  const commerce = evaluateCommerceReadiness(env);
  const missing = [...commerce.missing];

  if (provider === "disabled") {
    missing.push("PAYMENT_PROVIDER");
  } else {
    missing.push(...providerMissing(env, provider));
  }

  return {
    ...commerce,
    provider,
    ready: missing.length === 0,
    missing: [...new Set(missing)],
  };
}

export function evaluateReconcileReadiness(env: CommerceEnv): CommerceReadiness {
  const commerce = evaluateCommerceReadiness(env);
  const missing = [...commerce.missing];

  if (!env.COMMERCE_INTERNAL_SHARED_SECRET) {
    missing.push("COMMERCE_INTERNAL_SHARED_SECRET");
  }

  return { ...commerce, ready: missing.length === 0, missing };
}
