import { z } from "zod";

import { shippingAddressSchema } from "@/lib/commerce/address";
import { currencySchema, minorAmountSchema } from "@/lib/commerce/money";
import { paymentProviderNameSchema } from "@/lib/env/commerce";

export const idSchema = z.uuid();
export const cartQuantitySchema = z.number().int().min(1).max(99);

export const addCartItemSchema = z
  .object({
    variantId: idSchema,
    quantity: cartQuantitySchema,
  })
  .strict();

export const updateCartItemSchema = z
  .object({
    quantity: cartQuantitySchema,
  })
  .strict();

export const shippingQuoteRequestSchema = z
  .object({
    address: shippingAddressSchema,
  })
  .strict();

export const checkoutRequestSchema = z
  .object({
    address: shippingAddressSchema,
    email: z.email().max(254).optional(),
    customerNote: z.string().trim().max(500).optional(),
    shippingMethod: z.string().trim().min(1).max(80).default("standard"),
    idempotencyKey: z.string().trim().min(16).max(128),
  })
  .strict();

export const createPaymentRequestSchema = z
  .object({
    orderNumber: z.string().trim().regex(/^QW\d{8}[A-Z0-9]{10}$/),
    provider: paymentProviderNameSchema.exclude(["disabled"]),
    idempotencyKey: z.string().trim().min(16).max(128),
    clientIp: z.ipv4().optional(),
  })
  .strict();

export const shippingQuoteSchema = z
  .object({
    amount: minorAmountSchema,
    currency: currencySchema,
    method: z.string().min(1),
    expiresAt: z.iso.datetime(),
  })
  .strict();

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
export type CreatePaymentRequest = z.infer<typeof createPaymentRequestSchema>;
export type ShippingQuote = z.infer<typeof shippingQuoteSchema>;
