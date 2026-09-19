import { z } from "zod";

const chinaMobileSchema = /^1[3-9]\d{9}$/;
const postalCodeSchema = /^\d{6}$/;

export const shippingAddressSchema = z
  .object({
    recipientName: z.string().trim().min(2).max(80),
    phone: z.string().trim().regex(chinaMobileSchema, "Invalid mainland China mobile number"),
    province: z.string().trim().min(2).max(40),
    city: z.string().trim().min(2).max(40),
    district: z.string().trim().min(1).max(40),
    addressLine1: z.string().trim().min(5).max(160),
    addressLine2: z.string().trim().max(160).optional(),
    postalCode: z.string().trim().regex(postalCodeSchema, "Invalid postal code").optional(),
  })
  .strict();

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
