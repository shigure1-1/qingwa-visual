import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const sourceMark = resolve("Y:/1.制作项目/2026.08.25公司网站制作/晴蛙视觉/4k-3.jpg");
const sourceLockup = resolve("Y:/1.制作项目/2026.08.25公司网站制作/晴蛙视觉/1-晴蛙视觉logo2024.0400.jpg");
const outputDir = resolve("public/brand");

await mkdir(outputDir, { recursive: true });

const { data, info } = await sharp(sourceMark)
  .resize(1600, 1600, { fit: "inside", kernel: sharp.kernel.lanczos3 })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const rgba = Buffer.alloc(info.width * info.height * 4);
const key = [82, 184, 188];

for (let pixel = 0; pixel < info.width * info.height; pixel += 1) {
  const sourceIndex = pixel * 3;
  const outputIndex = pixel * 4;
  const red = data[sourceIndex];
  const green = data[sourceIndex + 1];
  const blue = data[sourceIndex + 2];
  const distance = Math.hypot(red - key[0], green - key[1], blue - key[2]);
  const alpha = Math.max(0, Math.min(255, Math.round(((distance - 18) / 50) * 255)));

  rgba[outputIndex] = red;
  rgba[outputIndex + 1] = green;
  rgba[outputIndex + 2] = blue;
  rgba[outputIndex + 3] = alpha;
}

const transparentMark = sharp(rgba, {
  raw: { width: info.width, height: info.height, channels: 4 },
}).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } });

await transparentMark.clone().png({ compressionLevel: 9, palette: true }).toFile(resolve(outputDir, "qingwa-mark.png"));
await transparentMark.clone().webp({ quality: 92, alphaQuality: 100 }).toFile(resolve(outputDir, "qingwa-mark.webp"));
await sharp(sourceMark)
  .resize(1600, 1600, { fit: "inside", kernel: sharp.kernel.lanczos3 })
  .webp({ quality: 88 })
  .toFile(resolve(outputDir, "qingwa-mark-teal.webp"));
await sharp(sourceLockup)
  .resize({ width: 1800, withoutEnlargement: true, kernel: sharp.kernel.lanczos3 })
  .webp({ quality: 88 })
  .toFile(resolve(outputDir, "qingwa-lockup-dark.webp"));
await sharp(sourceLockup)
  .resize({ width: 1800, withoutEnlargement: true, kernel: sharp.kernel.lanczos3 })
  .avif({ quality: 62 })
  .toFile(resolve(outputDir, "qingwa-lockup-dark.avif"));

console.log(`Processed brand assets into ${outputDir}`);
console.log(`Sources:\n- ${sourceMark}\n- ${sourceLockup}`);
