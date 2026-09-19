import type { Metadata } from "next";
import Image from "next/image";
import { ContactBrief } from "@/components/contact-brief";
import { locations, socialChannels } from "@/content/site";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "合作",
  description: "整理你的项目需求，生成一份可发送给晴蛙视觉的合作简报。",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic = "" } = await searchParams;

  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <SiteHeader />
      <main className="inner-main contact-main" id="main-content">
        <section className="page-intro contact-intro">
          <div>
            <span>START / A NEW VIEW</span>
            <h1>从一个问题开始，<br />建立新的看法。</h1>
          </div>
          <p>填写关键背景，页面会生成一份可复制的项目简报。晴蛙视觉在武汉、深圳、上海、北京、广州和云南设有联系点，正式发送前请核对具体对接渠道。</p>
        </section>
        <section className="brief-section page-second-band" data-page-section="second" aria-labelledby="brief-heading">
          <div className="brief-heading">
            <h2 id="brief-heading">合作简报</h2>
            <p>带 * 的字段为生成简报所必需。填写后可复制内容，再选择最合适的城市与渠道联系。</p>
          </div>
          <ContactBrief key={topic} initialTopic={topic} />
        </section>

        <section className="contact-directory" aria-labelledby="contact-directory-heading">
          <div className="contact-directory-heading">
            <span>CONTACT / DIRECTORY</span>
            <h2 id="contact-directory-heading">在离你最近的地方，开始一次合作。</h2>
            <p>以下地址、电话和邮箱整理自晴蛙视觉科技画册。</p>
          </div>
          <div className="contact-locations">
            {locations.map((location) => (
              <article key={`${location.city}-${location.phone}`}>
                <h3>{location.city}</h3>
                <p>{location.address}</p>
                <a href={`tel:${location.phone.replace(/[^\d+]/g, "")}`}>{location.phone}</a>
                {location.email && <a href={`mailto:${location.email}`}>{location.email}</a>}
              </article>
            ))}
          </div>
          <div className="contact-channels">
            <h3>官方内容渠道</h3>
            <div>{socialChannels.map((channel) => <span key={channel}>{channel}</span>)}</div>
          </div>
          <Image className="contact-board" src="/contact/contact-board.jpg" alt="晴蛙视觉画册中的联系与服务覆盖信息" width={1800} height={1264} sizes="100vw" />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
