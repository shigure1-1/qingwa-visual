import { z } from "zod";

export const orderStatusSchema = z.enum([
  "pending_payment",
  "paid",
  "fulfilling",
  "shipped",
  "completed",
  "cancelled",
  "refunded",
]);
export const paymentStatusSchema = z.enum([
  "created",
  "pending",
  "succeeded",
  "failed",
  "closed",
  "refunded",
  "partially_refunded",
]);
export const refundStatusSchema = z.enum(["pending", "succeeded", "failed"]);
export const fulfillmentStatusSchema = z.enum([
  "pending",
  "processing",
  "fulfilled",
  "cancelled",
]);

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type RefundStatus = z.infer<typeof refundStatusSchema>;
export type FulfillmentStatus = z.infer<typeof fulfillmentStatusSchema>;

const transitions = {
  order: {
    pending_payment: ["paid", "cancelled"],
    paid: ["fulfilling", "refunded"],
    fulfilling: ["shipped", "refunded"],
    shipped: ["completed", "refunded"],
    completed: ["refunded"],
    cancelled: [],
    refunded: [],
  } satisfies Record<OrderStatus, readonly OrderStatus[]>,
  payment: {
    created: ["pending", "succeeded", "failed", "closed"],
    pending: ["succeeded", "failed", "closed"],
    succeeded: ["partially_refunded", "refunded"],
    failed: [],
    closed: [],
    refunded: [],
    partially_refunded: ["refunded"],
  } satisfies Record<PaymentStatus, readonly PaymentStatus[]>,
  refund: {
    pending: ["succeeded", "failed"],
    succeeded: [],
    failed: [],
  } satisfies Record<RefundStatus, readonly RefundStatus[]>,
  fulfillment: {
    pending: ["processing", "cancelled"],
    processing: ["fulfilled", "cancelled"],
    fulfilled: [],
    cancelled: [],
  } satisfies Record<FulfillmentStatus, readonly FulfillmentStatus[]>,
};

function canTransition<T extends string>(
  graph: Record<T, readonly T[]>,
  from: T,
  to: T,
): boolean {
  return from === to || graph[from].includes(to);
}

export function canTransitionOrder(from: OrderStatus, to: OrderStatus): boolean {
  return canTransition(transitions.order, from, to);
}

export function canTransitionPayment(from: PaymentStatus, to: PaymentStatus): boolean {
  return canTransition(transitions.payment, from, to);
}

export function canTransitionRefund(from: RefundStatus, to: RefundStatus): boolean {
  return canTransition(transitions.refund, from, to);
}

export function canTransitionFulfillment(
  from: FulfillmentStatus,
  to: FulfillmentStatus,
): boolean {
  return canTransition(transitions.fulfillment, from, to);
}
