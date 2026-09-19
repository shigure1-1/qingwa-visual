import { notReady } from "@/lib/commerce/errors";
import type {
  PaymentAdapter,
  PaymentInitiationInput,
  PaymentInitiationResult,
  VerifiedPaymentEvent,
} from "@/lib/payments/types";

export class DisabledPaymentAdapter implements PaymentAdapter {
  readonly name = "disabled" as const;

  async initiatePayment(input: PaymentInitiationInput): Promise<PaymentInitiationResult> {
    void input;
    throw notReady();
  }

  async parseWebhook(rawBody: string, headers: Headers): Promise<VerifiedPaymentEvent> {
    void rawBody;
    void headers;
    throw notReady();
  }
}
