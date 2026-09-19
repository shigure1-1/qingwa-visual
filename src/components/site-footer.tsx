import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { creativeCategories } from "@/content/creative";
import { getInitiative, locations, services } from "@/content/site";
import { FooterBusinessNav, type FooterGroup } from "./footer-business-nav";
import { FooterQrGallery } from "./footer-qr-gallery";
import { LogoMark } from "./logo-mark";

const footerQrCodes = [
  { label: "晴蛙公众号", src: "/contact/qr/official-account.png" },
  { label: "晴蛙视频号", src: "/contact/qr/video-channel.png" },
  { label: "晴蛙抖音号", src: "/contact/qr/douyin.png" },
  { label: "青蛙新片场", src: "/contact/qr/xinpianchang.png" },
  { label: "晴蛙导演微信", src: "/contact/qr/director-wechat.png" },
];

const footerBusinessGroups: FooterGroup[] = [
  ...services.map((service) => ({
    label: service.navLabel,
    englishLabel: service.englishTitle,
    href: `/services/${service.slug}`,
    children: service.items.map((item) => ({
      label: item.label,
      href: `/services/${service.slug}/${item.slug}`,
    })),
  })),
  {
    label: "AGI",
    englishLabel: "AGI / NEW CAPABILITIES",
    href: "/agi",
    children: (getInitiative("agi")?.items ?? []).map((item) => ({
      label: item.label,
      href: `/agi/${item.slug}`,
    })),
  },
  {
    label: "行业培训",
    englishLabel: "EDUCATION / TRAINING",
    href: "/education-training",
    children: [],
  },
  {
    label: "文创商城",
    englishLabel: "CREATIVE STORE",
    href: "/creative",
    children: creativeCategories.map((category) => ({
      label: category.title,
      href: `/creative/${category.slug}`,
    })),
  },
  {
    label: "合作伙伴",
    englishLabel: "PARTNERS / OPEN NETWORK",
    href: "/partners",
    children: [],
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-navigation">
        <div className="footer-identity">
          <LogoMark className="footer-mark" size={60} />
          <div>
            <strong>晴蛙视觉</strong>
            <span>一眼所见，从此不同</span>
          </div>
          <div className="footer-quick-links" aria-label="页脚快捷导航">
            <Link href="/work">作品<ArrowUpRight aria-hidden="true" /></Link>
            <Link href="/about">关于我们<ArrowUpRight aria-hidden="true" /></Link>
            <Link href="/contact">开始一个项目<ArrowUpRight aria-hidden="true" /></Link>
            <Link href="/contact">联系我们<ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </div>

        <FooterBusinessNav groups={footerBusinessGroups} />
      </div>

      <section className="footer-qr-section" aria-labelledby="footer-qr-heading">
        <div className="footer-qr-heading">
          <p id="footer-qr-heading">扫码了解更多</p>
          <span>FOLLOW / CONNECT</span>
        </div>
        <div className="footer-qr-content">
          <FooterQrGallery codes={footerQrCodes} />
          <div className="footer-proof-image">
            <Image src="/contact/qr/03.png" alt="晴蛙视觉项目案例与行业经验信息" fill sizes="(max-width: 1180px) 100vw, 42vw" />
          </div>
        </div>
      </section>

      <div className="footer-meta">
        <span>晴蛙视觉</span>
        <span>武汉 · 深圳 · 上海 · 北京 · 广州 · 昆明</span>
        <span>{locations.length} 个联系点</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
