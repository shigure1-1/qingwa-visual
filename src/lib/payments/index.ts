import "server-only";

import { AlipayPaymentAdapter } from "@/lib/payments/alipay";
import { DisabledPaymentAdapter } from "@/lib/payments/disabled";
import type { PaymentAdapter } from "@/lib/payments/types";
import { WechatPaymentAdapter } from "@/lib/payments/wechat";
import type { PaymentProviderName } from "@/lib/env/commerce";

export function getPaymentAdapter(provider: PaymentProviderName): PaymentAdapter {
  if (provider === "wechat") return new WechatPaymentAdapter();
  if (provider === "alipay") return new AlipayPaymentAdapter();
  return new DisabledPaymentAdapter();
}
