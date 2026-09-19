import type { MetadataRoute } from "next";
import { getAbsoluteSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/creative/cart",
        "/creative/checkout",
        "/creative/order/",
        "/creative/payment/",
        "/api/",
      ],
    },
    sitemap: getAbsoluteSiteUrl("/sitemap.xml"),
  };
}
