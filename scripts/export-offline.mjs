import { mkdir, rm, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";

const sourceOrigin = new URL(process.env.OFFLINE_SOURCE_URL ?? "http://127.0.0.1:3030").origin;
const exportRoot = resolve(process.env.OFFLINE_EXPORT_DIR ?? join(process.cwd(), "..", "offline-exports", "qingwa-visual-offline"));
const pageQueue = ["/", "/about", "/contact", "/work", "/creative", "/creative/cart", "/creative/checkout"];
const seenPages = new Set();
const seenAssets = new Set();

const assetExtensions = new Set([
  ".avif", ".css", ".gif", ".ico", ".jpeg", ".jpg", ".js", ".json", ".map", ".mjs", ".mp4", ".png", ".svg", ".webp", ".woff", ".woff2",
]);

function normalizePathname(pathname) {
  const decoded = decodeURIComponent(pathname);
  return decoded.startsWith("/") ? decoded : `/${decoded}`;
}

function outputPathForPage(pathname) {
  const directory = pathname === "/" ? "" : pathname.replace(/^\/+|\/+$/g, "");
  return join(exportRoot, directory, "index.html");
}

function outputPathForAsset(pathname) {
  return join(exportRoot, pathname.replace(/^\/+/, ""));
}

function isAssetPath(pathname) {
  return pathname.startsWith("/_next/") || assetExtensions.has(extname(pathname).toLowerCase());
}

function isSafeOutputPath(outputPath) {
  const relativePath = relative(exportRoot, outputPath);
  return Boolean(relativePath) && !relativePath.startsWith("..");
}

function sourceUrl(pathname) {
  return new URL(pathname, sourceOrigin).toString();
}

function extractImageSource(value) {
  try {
    const imageUrl = new URL(value, sourceOrigin);
    if (imageUrl.pathname !== "/_next/image") return value;
    const source = imageUrl.searchParams.get("url");
    return source && source.startsWith("/") ? source : value;
  } catch {
    return value;
  }
}

function collectUrl(value, kind, basePath = "/") {
  const resolvedValue = extractImageSource(value);
  if (!resolvedValue || resolvedValue.startsWith("#") || /^(?:data:|javascript:|mailto:|tel:)/i.test(resolvedValue)) return;

  let url;
  try {
    url = new URL(resolvedValue, sourceUrl(basePath));
  } catch {
    return;
  }
  if (url.origin !== sourceOrigin) return;

  const pathname = normalizePathname(url.pathname);
  if (kind === "page" && !isAssetPath(pathname)) {
    if (!seenPages.has(pathname)) pageQueue.push(pathname);
    return;
  }
  if (isAssetPath(pathname)) seenAssets.add(pathname);
}

function collectHtmlReferences(html) {
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
    collectUrl(match[1], "page");
  }
  for (const match of html.matchAll(/\bsrcset=["']([^"']+)["']/gi)) {
    for (const candidate of match[1].split(",")) {
      collectUrl(candidate.trim().split(/\s+/)[0], "asset");
    }
  }
}

function collectCssReferences(css, stylesheetPath) {
  for (const match of css.matchAll(/url\((?:["'])?([^"')]+)(?:["'])?\)/gi)) {
    collectUrl(match[1], "asset", stylesheetPath);
  }
}

function prepareHtml(html) {
  const rewrite = (value) => extractImageSource(value);
  const rewrittenImages = html
    .replace(/\bsrc=(["'])([^"']+)\1/gi, (whole, quote, value) => `src=${quote}${rewrite(value)}${quote}`)
    .replace(/\bsrcset=(["'])([^"']+)\1/gi, (whole, quote, value) => {
      const candidates = value.split(",").map((candidate) => {
        const [url, ...descriptor] = candidate.trim().split(/\s+/);
        return [rewrite(url), ...descriptor].join(" ");
      });
      return `srcset=${quote}${candidates.join(", ")}${quote}`;
    });

  const fullNavigation = `<script>document.addEventListener("click",function(e){if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;var a=e.target.closest("a[href]");if(!a)return;var u=new URL(a.href,location.href);if(u.origin!==location.origin||u.pathname.startsWith("/_next/")||u.pathname===location.pathname&&u.hash){return;}e.preventDefault();location.assign(u.pathname+u.search+u.hash);},true);</script>`;
  return rewrittenImages.replace("</head>", `${fullNavigation}</head>`);
}

async function fetchResponse(pathname) {
  const response = await fetch(sourceUrl(pathname), { redirect: "follow" });
  if (!response.ok) throw new Error(`${pathname} returned ${response.status}`);
  return response;
}

async function savePage(pathname) {
  const response = await fetchResponse(pathname);
  const html = prepareHtml(await response.text());
  collectHtmlReferences(html);
  const target = outputPathForPage(pathname);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html, "utf8");
}

async function saveAsset(pathname) {
  const target = outputPathForAsset(pathname);
  if (!isSafeOutputPath(target)) throw new Error(`Unsafe asset path: ${pathname}`);

  const response = await fetchResponse(pathname);
  const contentType = response.headers.get("content-type") ?? "";
  const body = Buffer.from(await response.arrayBuffer());
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, body);

  if (contentType.includes("text/css") || pathname.endsWith(".css")) {
    collectCssReferences(body.toString("utf8"), pathname);
  }
}

const localServer = `param([int]$Port = 4173)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootFull = [System.IO.Path]::GetFullPath($root)
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://127.0.0.1:$Port/")

try {
  $listener.Start()
} catch {
  Write-Host "Unable to start the offline site on port $Port. Close the existing window using that port, then try again." -ForegroundColor Red
  exit 1
}

$mimeTypes = @{
  ".avif" = "image/avif"; ".css" = "text/css; charset=utf-8"; ".gif" = "image/gif"; ".html" = "text/html; charset=utf-8"
  ".ico" = "image/x-icon"; ".jpg" = "image/jpeg"; ".jpeg" = "image/jpeg"; ".js" = "text/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"; ".map" = "application/json; charset=utf-8"; ".mjs" = "text/javascript; charset=utf-8"
  ".mp4" = "video/mp4"; ".png" = "image/png"; ".svg" = "image/svg+xml"; ".webp" = "image/webp"; ".woff" = "font/woff"; ".woff2" = "font/woff2"
}

Start-Process "http://127.0.0.1:$Port/"
Write-Host "Offline site is running at http://127.0.0.1:$Port/" -ForegroundColor Cyan
Write-Host "Keep this window open while browsing. Press Ctrl+C to stop it."

while ($listener.IsListening) {
  $context = $listener.GetContext()
  try {
    $requestPath = [uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart("/"))
    if ([string]::IsNullOrWhiteSpace($requestPath)) { $requestPath = "index.html" }
    $candidate = [System.IO.Path]::GetFullPath((Join-Path $root $requestPath))
    if (-not $candidate.StartsWith($rootFull, [System.StringComparison]::OrdinalIgnoreCase)) { throw "Invalid path" }
    if (Test-Path -LiteralPath $candidate -PathType Container) { $candidate = Join-Path $candidate "index.html" }
    if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) {
      $directoryIndex = Join-Path $candidate "index.html"
      if (Test-Path -LiteralPath $directoryIndex -PathType Leaf) { $candidate = $directoryIndex } else { throw "Not found" }
    }
    $extension = [System.IO.Path]::GetExtension($candidate).ToLowerInvariant()
    $context.Response.ContentType = if ($mimeTypes.ContainsKey($extension)) { $mimeTypes[$extension] } else { "application/octet-stream" }
    $bytes = [System.IO.File]::ReadAllBytes($candidate)
    $context.Response.StatusCode = 200
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } catch {
    $context.Response.StatusCode = 404
    $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not found")
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } finally {
    $context.Response.Close()
  }
}
`;

const launcher = `@echo off\r\npowershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-offline.ps1"\r\n`;

async function main() {
  await rm(exportRoot, { recursive: true, force: true });
  await mkdir(exportRoot, { recursive: true });

  while (pageQueue.length > 0) {
    const pathname = pageQueue.shift();
    if (!pathname || seenPages.has(pathname)) continue;
    seenPages.add(pathname);
    await savePage(pathname);
  }

  for (const pathname of seenAssets) {
    await saveAsset(pathname);
  }

  let assetIndex = 0;
  while (assetIndex < seenAssets.size) {
    const asset = [...seenAssets][assetIndex++];
    const target = outputPathForAsset(asset);
    try {
      await stat(target);
    } catch {
      await saveAsset(asset);
    }
  }

  await writeFile(join(exportRoot, "start-offline.ps1"), localServer, "utf8");
  await writeFile(join(exportRoot, "启动离线网站.cmd"), launcher, "utf8");
  const readme = `晴蛙视觉离线网站\n\n双击“启动离线网站.cmd”后，在浏览器中访问自动打开的本机地址。\n整个文件夹需要保持完整；离线版本不包含在线商品、订单和支付功能。\n`;
  await writeFile(join(exportRoot, "README.txt"), readme, "utf8");

  console.log(`Exported ${seenPages.size} pages and ${seenAssets.size} assets to ${exportRoot}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
