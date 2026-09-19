import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HonorTrack } from "@/components/about-honors-gallery";
import { HomePartnerWall } from "@/components/partners/partner-wall";
import { honorGroups } from "@/content/about-honors";

const enterpriseHonors = honorGroups.find((group) => group.slug === "enterprise");
const visualHonors = honorGroups.find((group) => group.slug === "visual");
const designHonors = honorGroups.find((group) => group.slug === "design");

export function HomeRecognition() {
  if (!enterpriseHonors || !visualHonors || !designHonors) return null;

  const archiveHonors = [...visualHonors.images, ...designHonors.images];

  return (
    <>
      <section className="home-honors-wall" id="home-recognition" aria-labelledby="home-recognition-heading">
        <div className="home-honors-wall-heading">
          <div>
            <span>RECOGNITION / ARCHIVE</span>
            <h2 id="home-recognition-heading">企业荣誉</h2>
          </div>
          <div className="home-honors-wall-action">
            <Link className="text-link text-link-light" href="/about#about-honors">
              查看荣誉档案
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="home-honor-rows">
          <div className="home-honor-row">
            <div className="home-honor-row-heading">
              <h3>PLAQUES &amp; TROPHIES</h3>
              <strong>{String(enterpriseHonors.images.length).padStart(2, "0")} / IMAGES</strong>
            </div>
            <HonorTrack
              images={enterpriseHonors.images}
              ariaLabel="企业挂牌与奖杯横向图片列表，自动滚动"
            />
          </div>
          <div className="home-honor-row">
            <div className="home-honor-row-heading">
              <h3>VISUAL HONORS / DESIGN HONORS</h3>
              <strong>{String(archiveHonors.length).padStart(2, "0")} / IMAGES</strong>
            </div>
            <HonorTrack
              images={archiveHonors}
              ariaLabel="视觉荣誉与设计荣誉横向图片列表，自动滚动"
              variant="archive"
            />
          </div>
        </div>
      </section>

      <HomePartnerWall />
    </>
  );
}
