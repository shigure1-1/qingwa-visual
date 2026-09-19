import Image from "next/image";
import Link from "next/link";
import type { PublishedProduct } from "@/lib/commerce/catalog";
import { PurchaseAction } from "@/components/creative/purchase-action";

const currencyFormatter = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
});

type ProductDetailProps = {
  product: PublishedProduct;
  commerceReady: boolean;
};

export function ProductDetail({ product, commerceReady }: ProductDetailProps) {
  const price = product.priceMinor === null
    ? "价格待确认"
    : currencyFormatter.format(product.priceMinor / 100);
  const quoteOnly = product.salesMode === "custom_quote" || product.priceMinor === null;

  return (
    <article className="creative-product-detail">
      <div className="creative-product-media" aria-label={`${product.title}商品图片`}>
        {product.media.map((media) => (
          <Image
            alt={media.alt}
            height={media.height}
            key={media.src}
            sizes="(max-width: 900px) 100vw, 55vw"
            src={media.src}
            width={media.width}
          />
        ))}
        {product.media.length === 0 && <p>商品图片准备中</p>}
      </div>
      <div className="creative-product-info">
        <p className="creative-status-label">PUBLISHED / {product.fulfillmentType.toUpperCase()}</p>
        <h1>{product.title}</h1>
        <p className="creative-product-english">SKU / {product.variants[0]?.id ?? product.id}</p>
        <p className="creative-product-price">{price}</p>
        <p className="creative-product-summary">{product.summary}</p>
        {quoteOnly ? (
          <Link className="creative-primary-button" href="/contact">
            联系定制
          </Link>
        ) : (
          <PurchaseAction
            commerceReady={commerceReady}
            quoteOnly={quoteOnly}
            variants={product.variants}
          />
        )}
        <div className="creative-product-description">
          <h2>商品说明</h2>
          <p>{product.description}</p>
        </div>
        <dl className="creative-product-specifications">
          <div>
            <dt>销售方式</dt>
            <dd>{product.salesMode === "custom_quote" ? "定制询价" : "直接购买"}</dd>
          </div>
          <div>
            <dt>履约方式</dt>
            <dd>{product.fulfillmentType}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
