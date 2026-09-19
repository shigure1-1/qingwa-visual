import Image from "next/image";

type LogoMarkProps = {
  className?: string;
  size?: number;
  priority?: boolean;
};

type BrandLockupProps = {
  className?: string;
  priority?: boolean;
};

export function LogoMark({ className, size = 64, priority = false }: LogoMarkProps) {
  return (
    <Image
      className={className}
      src="/brand/qingwa-mark.webp"
      alt="晴蛙视觉折面青蛙标志"
      width={size}
      height={size}
      priority={priority}
    />
  );
}

export function BrandLockup({ className, priority = false }: BrandLockupProps) {
  return (
    <Image
      className={className}
      src="/brand/qingwa-lockup-2026-cropped.webp"
      alt="晴蛙视觉，一眼所见，从此不同"
      width={1304}
      height={292}
      priority={priority}
    />
  );
}
