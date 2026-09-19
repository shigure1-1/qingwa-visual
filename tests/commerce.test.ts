import { describe, expect, it } from "vitest";
import { parseCommerceEnv } from "@/lib/env/commerce";
import { evaluateCommerceReadiness, evaluatePaymentReadiness } from "@/lib/commerce/readiness";
import { addMinorAmounts, multiplyMinorAmount, parseMajorAmountToMinor } from "@/lib/commerce/money";
import { shippingAddressSchema } from "@/lib/commerce/address";
import { canTransitionOrder, canTransitionPayment } from "@/lib/commerce/status";
import { DisabledPaymentAdapter } from "@/lib/payments/disabled";

const base = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role",
  COMMERCE_SESSION_SECRET: "a-long-secret",
  COMMERCE_PUBLIC_BASE_URL: "https://shop.example.com",
  COMMERCE_SHIPPING_RULE_VERSION: "shipping-1",
  COMMERCE_TERMS_VERSION: "terms-1",
  COMMERCE_PRIVACY_VERSION: "privacy-1",
  COMMERCE_REFUND_POLICY_VERSION: "refund-1",
  WECHAT_PAY_MCH_ID: "mch",
  WECHAT_PAY_APP_ID: "wx-app",
  WECHAT_PAY_MCH_SERIAL_NO: "mch-serial",
  WECHAT_PAY_PRIVATE_KEY: "private",
  WECHAT_PAY_PLATFORM_SERIAL_NO: "platform-serial",
  WECHAT_PAY_PLATFORM_PUBLIC_KEY: "public",
  WECHAT_PAY_API_V3_KEY: "12345678901234567890123456789012",
  WECHAT_PAY_NOTIFY_URL: "https://shop.example.com/api/webhooks/wechat",
  ALIPAY_APP_ID: "ali-app",
  ALIPAY_SELLER_ID: "seller",
  ALIPAY_PRIVATE_KEY: "private",
  ALIPAY_PUBLIC_KEY: "public",
  ALIPAY_NOTIFY_URL: "https://shop.example.com/api/webhooks/alipay",
};

describe("commerce readiness", () => {
  it("defaults to a closed catalog", () => {
    const parsed = parseCommerceEnv({});
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const readiness = evaluateCommerceReadiness(parsed.data);
    expect(readiness.ready).toBe(false);
    expect(readiness.mode).toBe("catalog");
  });

  it("allows both providers to be independently ready", () => {
    const parsed = parseCommerceEnv({ ...base, COMMERCE_MODE: "sandbox" });
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const readiness = evaluateCommerceReadiness(parsed.data);
    expect(readiness.availableProviders).toEqual(["wechat", "alipay"]);
    expect(readiness.ready).toBe(true);
    expect(evaluatePaymentReadiness(parsed.data, "wechat").ready).toBe(true);
  });

  it("requires public HTTPS and policy versions in live mode", () => {
    const parsed = parseCommerceEnv({ ...base, COMMERCE_MODE: "live", COMMERCE_PUBLIC_BASE_URL: "http://localhost:3000" });
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const readiness = evaluateCommerceReadiness(parsed.data);
    expect(readiness.ready).toBe(false);
    expect(readiness.missing).toContain("COMMERCE_PUBLIC_BASE_URL_HTTPS");
  });
});

describe("money", () => {
  it("keeps amounts in integer minor units", () => {
    expect(parseMajorAmountToMinor("12.5")).toBe(1250);
    expect(multiplyMinorAmount(1250, 2)).toBe(2500);
    expect(addMinorAmounts([1250, 250])).toBe(1500);
    expect(() => parseMajorAmountToMinor("12.345")).toThrow();
  });
});

describe("shipping address", () => {
  it("accepts a mainland physical address", () => {
    expect(shippingAddressSchema.parse({
      recipientName: "晴蛙客户",
      phone: "13800138000",
      province: "湖北省",
      city: "武汉市",
      district: "汉阳区",
      addressLine1: "晴蛙路 1 号",
      postalCode: "430000",
    }).city).toBe("武汉市");
  });
});

describe("state transitions", () => {
  it("allows only forward order/payment transitions", () => {
    expect(canTransitionOrder("pending_payment", "paid")).toBe(true);
    expect(canTransitionOrder("paid", "pending_payment")).toBe(false);
    expect(canTransitionPayment("pending", "succeeded")).toBe(true);
    expect(canTransitionPayment("succeeded", "pending")).toBe(false);
  });
});

describe("disabled payments", () => {
  it("never returns a simulated result", async () => {
    const adapter = new DisabledPaymentAdapter();
    await expect(adapter.initiatePayment({
      paymentId: "payment",
      orderNumber: "QW20260826ABC1234567",
      amount: 100,
      currency: "CNY",
      description: "test",
    })).rejects.toMatchObject({ code: "COMMERCE_NOT_READY" });
  });
});
