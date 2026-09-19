import { z } from "zod";

export const currencySchema = z.literal("CNY");
export const minorAmountSchema = z.number().int().safe().nonnegative();
export const positiveMinorAmountSchema = minorAmountSchema.refine((value) => value > 0, {
  message: "Amount must be greater than zero",
});

export const moneySchema = z
  .object({
    amount: minorAmountSchema,
    currency: currencySchema,
  })
  .strict();

export type Currency = z.infer<typeof currencySchema>;
export type Money = z.infer<typeof moneySchema>;

export function addMinorAmounts(amounts: readonly number[]): number {
  const total = amounts.reduce((sum, amount) => {
    const parsed = minorAmountSchema.parse(amount);
    const next = sum + parsed;

    if (!Number.isSafeInteger(next)) {
      throw new RangeError("Amount exceeds the safe integer range");
    }

    return next;
  }, 0);

  return total;
}

export function multiplyMinorAmount(amount: number, quantity: number): number {
  const parsedAmount = minorAmountSchema.parse(amount);
  const parsedQuantity = z.number().int().positive().safe().parse(quantity);
  const total = parsedAmount * parsedQuantity;

  if (!Number.isSafeInteger(total)) {
    throw new RangeError("Amount exceeds the safe integer range");
  }

  return total;
}

export function parseMajorAmountToMinor(value: string): number {
  if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value)) {
    throw new RangeError("Amount must have at most two decimal places");
  }

  const [major, decimals = ""] = value.split(".");
  const amount = Number(major) * 100 + Number(decimals.padEnd(2, "0"));

  if (!Number.isSafeInteger(amount)) {
    throw new RangeError("Amount exceeds the safe integer range");
  }

  return amount;
}
