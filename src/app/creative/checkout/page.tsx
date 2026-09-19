import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { CheckoutForm } from "@/components/creative/checkout-form";
import { CommerceSummary } from "@/components/creative/commerce-summary";
import { CreativeShell } from "@/components/creative/creative-shell";
import { getCommerceReadiness } from "@/lib/commerce/runtime";

export const metadata: Metadata = {
  title: "结算",
  description: "晴蛙文创结算页。当前商品目录与结算服务尚未开放。",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function CreativeCheckoutPage() {
  const readiness = getCommerceReadiness();
  const availableProviders = "availableProviders" in readiness ? readiness.availableProviders : [];
  const commerceReady = readiness.ready && availableProviders.length > 0;

  return (
    <CreativeShell className="creative-commerce-page creative-checkout-page">
      <header className="creative-commerce-header">
        <Link className="creative-back-link" href="/creative/cart">
          <ArrowLeft aria-hidden="true" />
          返回购物车
        </Link>
        <p className="creative-status-label">CHECKOUT / {commerceReady ? "READY" : "UNAVAILABLE"}</p>
        <h1>结算</h1>
        <p id="checkout-unavailable-note">
          {commerceReady
            ? "填写收货信息并选择支付方式。订单金额、配送规则与库存由服务端重新核对。"
            : "商品目录与结算服务尚未开放。以下字段仅保留交易结构，当前不可填写，也不会生成订单。"}
        </p>
      </header>

      <div className="creative-commerce-layout page-second-band" data-page-section="second">
        {commerceReady ? (
          <CheckoutForm availableProviders={availableProviders} />
        ) : (
          <form className="creative-checkout-form" aria-describedby="checkout-unavailable-note">
            <fieldset disabled>
              <legend>联系信息</legend>
              <div className="creative-field-grid">
                <label htmlFor="checkout-contact-name">
                  <span>联系人姓名</span>
                  <input id="checkout-contact-name" name="contactName" type="text" autoComplete="name" required />
                </label>
                <label htmlFor="checkout-contact-phone">
                  <span>手机号码</span>
                  <input id="checkout-contact-phone" name="contactPhone" type="tel" inputMode="tel" autoComplete="tel" required />
                </label>
                <label className="creative-field-wide" htmlFor="checkout-contact-email">
                  <span>电子邮箱</span>
                  <input id="checkout-contact-email" name="contactEmail" type="email" inputMode="email" autoComplete="email" required />
                </label>
              </div>
            </fieldset>

            <fieldset disabled>
              <legend>收货地址</legend>
              <div className="creative-field-grid">
                <label htmlFor="checkout-recipient-name">
                  <span>收货人姓名</span>
                  <input id="checkout-recipient-name" name="recipientName" type="text" autoComplete="shipping name" required />
                </label>
                <label htmlFor="checkout-recipient-phone">
                  <span>收货人手机</span>
                  <input id="checkout-recipient-phone" name="recipientPhone" type="tel" inputMode="tel" autoComplete="shipping tel" required />
                </label>
                <label htmlFor="checkout-country">
                  <span>国家或地区</span>
                  <input id="checkout-country" name="country" type="text" autoComplete="shipping country-name" required />
                </label>
                <label htmlFor="checkout-province">
                  <span>省 / 自治区 / 直辖市</span>
                  <input id="checkout-province" name="province" type="text" autoComplete="shipping address-level1" required />
                </label>
                <label htmlFor="checkout-city">
                  <span>城市</span>
                  <input id="checkout-city" name="city" type="text" autoComplete="shipping address-level2" required />
                </label>
                <label htmlFor="checkout-district">
                  <span>区 / 县</span>
                  <input id="checkout-district" name="district" type="text" autoComplete="shipping address-level3" required />
                </label>
                <label className="creative-field-wide" htmlFor="checkout-street-address">
                  <span>详细地址</span>
                  <textarea id="checkout-street-address" name="streetAddress" autoComplete="shipping street-address" rows={3} required />
                </label>
                <label htmlFor="checkout-postal-code">
                  <span>邮政编码</span>
                  <input id="checkout-postal-code" name="postalCode" type="text" inputMode="numeric" autoComplete="shipping postal-code" />
                </label>
              </div>
            </fieldset>

            <fieldset disabled>
              <legend>配送方式</legend>
              <label className="creative-field-block" htmlFor="checkout-delivery-method">
                <span>配送服务</span>
                <select id="checkout-delivery-method" name="deliveryMethod" required defaultValue="">
                  <option value="">待配送服务开放后选择</option>
                </select>
              </label>
            </fieldset>

            <fieldset disabled>
              <legend>发票信息</legend>
              <div className="creative-choice-group" role="group" aria-label="是否需要发票">
                <label htmlFor="invoice-no"><input id="invoice-no" name="invoiceRequired" type="radio" value="no" /> 不需要发票</label>
                <label htmlFor="invoice-yes"><input id="invoice-yes" name="invoiceRequired" type="radio" value="yes" /> 需要发票</label>
              </div>
              <div className="creative-field-grid">
                <label htmlFor="invoice-type">
                  <span>发票类型</span>
                  <select id="invoice-type" name="invoiceType" defaultValue="">
                    <option value="">请选择</option>
                    <option value="individual">个人</option>
                    <option value="company">单位</option>
                  </select>
                </label>
                <label htmlFor="invoice-title"><span>发票抬头</span><input id="invoice-title" name="invoiceTitle" type="text" /></label>
                <label htmlFor="taxpayer-id"><span>纳税人识别号</span><input id="taxpayer-id" name="taxpayerId" type="text" /></label>
                <label htmlFor="invoice-email"><span>发票接收邮箱</span><input id="invoice-email" name="invoiceEmail" type="email" inputMode="email" autoComplete="email" /></label>
              </div>
            </fieldset>

            <fieldset disabled>
              <legend>支付与确认</legend>
              <label className="creative-field-block" htmlFor="checkout-payment-method">
                <span>支付方式</span>
                <select id="checkout-payment-method" name="paymentMethod" required defaultValue="">
                  <option value="">待支付服务开放后选择</option>
                </select>
              </label>
              <label className="creative-field-block" htmlFor="checkout-order-note">
                <span>订单备注</span>
                <textarea id="checkout-order-note" name="orderNote" rows={3} />
              </label>
              <label className="creative-terms-field" htmlFor="checkout-terms-disabled">
                <input id="checkout-terms-disabled" name="termsAccepted" type="checkbox" required />
                <span>我已核对商品、配送、发票与支付信息，并同意提交订单。</span>
              </label>
            </fieldset>

            <button className="creative-primary-button" type="submit" disabled>
              <LockKeyhole aria-hidden="true" />
              尚未开放结算
            </button>
          </form>
        )}
        <CommerceSummary headingId="checkout-summary-heading" />
      </div>
    </CreativeShell>
  );
}
