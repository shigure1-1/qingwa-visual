"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type PaymentProvider = "wechat" | "alipay";

type CheckoutFormProps = {
  availableProviders: readonly PaymentProvider[];
};

type PaymentResult = {
  provider: PaymentProvider;
  status: "pending";
  codeUrl: string;
  qrDataUrl: string;
};

const initialFields = {
  email: "",
  customerNote: "",
  recipientName: "",
  phone: "",
  province: "",
  city: "",
  district: "",
  addressLine1: "",
  addressLine2: "",
  postalCode: "",
  shippingMethod: "standard",
  provider: "" as PaymentProvider | "",
};

export function CheckoutForm({ availableProviders }: CheckoutFormProps) {
  const [fields, setFields] = useState(initialFields);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [pending, setPending] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  function updateField(name: keyof typeof initialFields, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPayment(null);

    if (!fields.provider) {
      setError("请选择支付方式。");
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    if (!termsAccepted) {
      setError("请先确认商品、配送和支付信息。");
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    setPending(true);
    try {
      const checkoutResponse = await fetch("/api/commerce/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: {
            recipientName: fields.recipientName,
            phone: fields.phone,
            province: fields.province,
            city: fields.city,
            district: fields.district,
            addressLine1: fields.addressLine1,
            addressLine2: fields.addressLine2 || undefined,
            postalCode: fields.postalCode || undefined,
          },
          email: fields.email || undefined,
          customerNote: fields.customerNote || undefined,
          shippingMethod: fields.shippingMethod,
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      const checkout = (await checkoutResponse.json()) as {
        ok?: boolean;
        order?: { publicId?: string };
        message?: string;
      };
      if (!checkoutResponse.ok || !checkout.ok || !checkout.order?.publicId) {
        throw new Error(checkout.message ?? "订单创建失败，请检查购物车和收货信息。");
      }

      const number = checkout.order.publicId;
      setOrderNumber(number);
      const paymentResponse = await fetch("/api/commerce/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: number,
          provider: fields.provider,
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      const paymentPayload = (await paymentResponse.json()) as {
        ok?: boolean;
        payment?: PaymentResult;
        message?: string;
      };
      if (!paymentResponse.ok || !paymentPayload.ok || !paymentPayload.payment) {
        throw new Error(paymentPayload.message ?? "订单已创建，但支付二维码暂时无法生成。");
      }
      setPayment(paymentPayload.payment);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "结算暂时无法完成。";
      setError(message);
      requestAnimationFrame(() => errorRef.current?.focus());
    } finally {
      setPending(false);
    }
  }

  if (orderNumber && payment) {
    return (
      <section className="creative-payment-created" aria-labelledby="payment-created-heading">
        <p className="creative-status-label">PAYMENT / PENDING</p>
        <h2 id="payment-created-heading">订单已创建，等待付款</h2>
        <p>订单号：{orderNumber}。请使用{payment.provider === "wechat" ? "微信" : "支付宝"}完成付款，支付成功后由服务端确认订单状态。</p>
        <Image
          src={payment.qrDataUrl}
          alt={`${payment.provider === "wechat" ? "微信" : "支付宝"}支付二维码`}
          width={280}
          height={280}
          unoptimized
        />
        <a href={payment.codeUrl} target="_blank" rel="noreferrer">
          在支付应用中打开
        </a>
        <p className="creative-inline-status" role="status" aria-live="polite">支付回跳不会直接改变订单状态。</p>
      </section>
    );
  }

  return (
    <form className="creative-checkout-form" onSubmit={submit} aria-describedby="checkout-available-note">
      <p id="checkout-available-note" className="creative-form-note">订单金额、配送费用和库存将在服务端重新核对。</p>
      <fieldset disabled={pending}>
        <legend>联系信息</legend>
        <div className="creative-field-grid">
          <label htmlFor="checkout-email" className="creative-field-wide">
            <span>电子邮箱（可选）</span>
            <input id="checkout-email" name="email" type="email" autoComplete="email" value={fields.email} onChange={(event) => updateField("email", event.target.value)} />
          </label>
          <label htmlFor="checkout-note" className="creative-field-wide">
            <span>订单备注（可选）</span>
            <textarea id="checkout-note" name="customerNote" rows={3} value={fields.customerNote} onChange={(event) => updateField("customerNote", event.target.value)} />
          </label>
        </div>
      </fieldset>

      <fieldset disabled={pending}>
        <legend>收货地址</legend>
        <div className="creative-field-grid">
          <label htmlFor="checkout-recipient-name">
            <span>收货人姓名</span>
            <input id="checkout-recipient-name" name="recipientName" type="text" autoComplete="shipping name" required value={fields.recipientName} onChange={(event) => updateField("recipientName", event.target.value)} />
          </label>
          <label htmlFor="checkout-phone">
            <span>收货人手机</span>
            <input id="checkout-phone" name="phone" type="tel" inputMode="tel" autoComplete="shipping tel" required value={fields.phone} onChange={(event) => updateField("phone", event.target.value)} />
          </label>
          <label htmlFor="checkout-province">
            <span>省 / 自治区 / 直辖市</span>
            <input id="checkout-province" name="province" type="text" autoComplete="shipping address-level1" required value={fields.province} onChange={(event) => updateField("province", event.target.value)} />
          </label>
          <label htmlFor="checkout-city">
            <span>城市</span>
            <input id="checkout-city" name="city" type="text" autoComplete="shipping address-level2" required value={fields.city} onChange={(event) => updateField("city", event.target.value)} />
          </label>
          <label htmlFor="checkout-district">
            <span>区 / 县</span>
            <input id="checkout-district" name="district" type="text" autoComplete="shipping address-level3" required value={fields.district} onChange={(event) => updateField("district", event.target.value)} />
          </label>
          <label htmlFor="checkout-postal-code">
            <span>邮政编码（可选）</span>
            <input id="checkout-postal-code" name="postalCode" type="text" inputMode="numeric" autoComplete="shipping postal-code" value={fields.postalCode} onChange={(event) => updateField("postalCode", event.target.value)} />
          </label>
          <label htmlFor="checkout-address-line1" className="creative-field-wide">
            <span>详细地址</span>
            <textarea id="checkout-address-line1" name="addressLine1" autoComplete="shipping street-address" rows={3} required value={fields.addressLine1} onChange={(event) => updateField("addressLine1", event.target.value)} />
          </label>
          <label htmlFor="checkout-address-line2" className="creative-field-wide">
            <span>补充地址（可选）</span>
            <input id="checkout-address-line2" name="addressLine2" type="text" value={fields.addressLine2} onChange={(event) => updateField("addressLine2", event.target.value)} />
          </label>
        </div>
      </fieldset>

      <fieldset disabled={pending}>
        <legend>配送与支付</legend>
        <label htmlFor="checkout-shipping-method" className="creative-field-block">
          <span>配送服务</span>
          <select id="checkout-shipping-method" name="shippingMethod" value={fields.shippingMethod} onChange={(event) => updateField("shippingMethod", event.target.value)}>
            <option value="standard">标准实体物流</option>
          </select>
        </label>
        <div className="creative-choice-group" role="group" aria-label="支付方式">
          {availableProviders.map((provider) => (
            <label key={provider} htmlFor={`checkout-provider-${provider}`}>
              <input id={`checkout-provider-${provider}`} name="provider" type="radio" value={provider} checked={fields.provider === provider} onChange={(event) => updateField("provider", event.target.value)} />
              {provider === "wechat" ? "微信支付" : "支付宝"}
            </label>
          ))}
        </div>
        <label className="creative-terms-field" htmlFor="checkout-terms">
          <input id="checkout-terms" name="termsAccepted" type="checkbox" required checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} />
          <span>我已核对商品、配送与支付信息，并同意提交订单。</span>
        </label>
      </fieldset>

      {error && <p ref={errorRef} className="creative-form-error" role="alert" tabIndex={-1}>{error}</p>}
      <button className="creative-primary-button" type="submit" disabled={pending || availableProviders.length === 0}>
        {pending ? "正在创建订单…" : "创建订单并生成支付码"}
      </button>
    </form>
  );
}
