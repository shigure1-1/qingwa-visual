import Image from "next/image";

type ProjectArtProps = {
  type: "aperture" | "signal" | "spectrum";
  accent: string;
  secondary: string;
  title?: string;
  image?: string;
};

export function ProjectArt({ type, accent, secondary, title, image }: ProjectArtProps) {
  return (
    <div
      className={`project-art project-art-${type}${image ? " project-art-image" : ""}`}
      style={{ "--art-accent": accent, "--art-secondary": secondary } as React.CSSProperties}
      aria-label={title ? `${title} 项目视觉` : undefined}
      role={title ? "img" : undefined}
    >
      {image && <Image src={image} alt="" fill sizes="(max-width: 900px) 100vw, 72vw" />}
      {image && <span className="project-art-wash" aria-hidden="true" />}
      {type === "aperture" && (
        <>
          <span className="aperture-plane plane-a" />
          <span className="aperture-plane plane-b" />
          <span className="aperture-plane plane-c" />
          <span className="aperture-core" />
          {!image && <span className="art-code">ANGLE / 47°</span>}
        </>
      )}
      {type === "signal" && (
        <>
          <span className="signal-line line-a" />
          <span className="signal-line line-b" />
          <span className="signal-line line-c" />
          <span className="signal-frame" />
          {!image && <span className="art-code">AFTER / IMAGE</span>}
        </>
      )}
      {type === "spectrum" && (
        <>
          <span className="spectrum-field field-a" />
          <span className="spectrum-field field-b" />
          <span className="spectrum-field field-c" />
          <span className="spectrum-horizon" />
          {!image && <span className="art-code">SYN / 03</span>}
        </>
      )}
    </div>
  );
}
