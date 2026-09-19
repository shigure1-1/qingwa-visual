import { z } from "zod";

export const COMMERCE_NOT_READY = "COMMERCE_NOT_READY" as const;

export const commerceModeSchema = z.enum(["catalog", "sandbox", "live"]);
export const paymentProviderNameSchema = z.enum(["disabled", "wechat", "alipay"]);

export type CommerceMode = z.infer<typeof commerceModeSchema>;
export type PaymentProviderName = z.infer<typeof paymentProviderNameSchema>;

const optionalTrimmedString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().min(1).optional(),
);

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.url().optional(),
);

const optionalPositiveInteger = (fallback: number) =>
  z.preprocess(
    (value) => (value === undefined || value === "" ? fallback : value),
    z.coerce.number().int().positive(),
  );

export const commerceEnvSchema = z.object({
  COMMERCE_MODE: commerceModeSchema.default("catalog"),
  COMMERCE_CURRENCY: z.literal("CNY").default("CNY"),
  COMMERCE_RESERVATION_MINUTES: optionalPositiveInteger(15),
  SUPABASE_URL: optionalUrl,
  SUPABASE_SERVICE_ROLE_KEY: optionalTrimmedString,
  COMMERCE_SESSION_SECRET: optionalTrimmedString,
  COMMERCE_INTERNAL_SHARED_SECRET: optionalTrimmedString,
  COMMERCE_PUBLIC_BASE_URL: optionalUrl,
  COMMERCE_SHIPPING_RULE_VERSION: optionalTrimmedString,
  COMMERCE_TERMS_VERSION: optionalTrimmedString,
  COMMERCE_PRIVACY_VERSION: optionalTrimmedString,
  COMMERCE_REFUND_POLICY_VERSION: optionalTrimmedString,
  WECHAT_PAY_MCH_ID: optionalTrimmedString,
  WECHAT_PAY_APP_ID: optionalTrimmedString,
  WECHAT_PAY_MCH_SERIAL_NO: optionalTrimmedString,
  WECHAT_PAY_PRIVATE_KEY: optionalTrimmedString,
  WECHAT_PAY_PLATFORM_SERIAL_NO: optionalTrimmedString,
  WECHAT_PAY_PLATFORM_PUBLIC_KEY: optionalTrimmedString,
  WECHAT_PAY_API_V3_KEY: optionalTrimmedString,
  WECHAT_PAY_NOTIFY_URL: optionalUrl,
  ALIPAY_APP_ID: optionalTrimmedString,
  ALIPAY_SELLER_ID: optionalTrimmedString,
  ALIPAY_PRIVATE_KEY: optionalTrimmedString,
  ALIPAY_PUBLIC_KEY: optionalTrimmedString,
  ALIPAY_NOTIFY_URL: optionalUrl,
});

export type CommerceEnv = z.infer<typeof commerceEnvSchema>;

export function parseCommerceEnv(source: Record<string, string | undefined>) {
  return commerceEnvSchema.safeParse(source);
}
