import type { Currency } from "@/lib/commerce/money";
import type { PaymentProviderName } from "@/lib/env/commerce";

export type PaymentInitiationInput = {
  paymentId: string;
  orderNumber: string;
  amount: number;
  currency: Currency;
  description: string;
  clientIp?: string;
};

export type PaymentInitiationResult = {
  provider: Exclude<PaymentProviderName, "disabled">;
  providerPaymentId?: string;
  status: "pending";
  codeUrl: string;
  qrDataUrl: string;
  providerPayload: Record<string, unknown>;
};

export type VerifiedPaymentEvent = {
  provider: Exclude<PaymentProviderName, "disabled">;
  eventId: string;
  eventType: string;
  orderNumber: string;
  providerTransactionId?: string;
  amount: number;
  currency: Currency;
  status: "succeeded" | "failed" | "closed" | "refunded";
  occurredAt: string;
  providerPayload: Record<string, unknown>;
};

export interface PaymentAdapter {
  readonly name: PaymentProviderName;
  initiatePayment(input: PaymentInitiationInput): Promise<PaymentInitiationResult>;
  parseWebhook(rawBody: string, headers: Headers): Promise<VerifiedPaymentEvent>;
}
