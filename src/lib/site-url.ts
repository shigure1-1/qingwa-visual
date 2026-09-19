const DEVELOPMENT_SITE_URL = new URL("http://127.0.0.1:3000");

const SITE_URL_CANDIDATES = [
  ["NEXT_PUBLIC_SITE_URL", process.env.NEXT_PUBLIC_SITE_URL],
  ["SITE_URL", process.env.SITE_URL],
  ["VERCEL_PROJECT_PRODUCTION_URL", process.env.VERCEL_PROJECT_PRODUCTION_URL],
  ["VERCEL_URL", process.env.VERCEL_URL],
] as const;

let warnedAboutProductionUrl = false;

function isLocalHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function parseSiteUrl(value: string | undefined, production: boolean) {
  if (!value) return undefined;

  try {
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const url = new URL(withProtocol);

    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    if (production && (url.protocol !== "https:" || isLocalHostname(url.hostname))) return undefined;

    return new URL(url.origin);
  } catch {
    return undefined;
  }
}

function warnAboutProductionUrl() {
  if (warnedAboutProductionUrl) return;
  warnedAboutProductionUrl = true;

  const configuredNames = SITE_URL_CANDIDATES
    .filter(([, value]) => Boolean(value))
    .map(([name]) => name);
  const detail = configuredNames.length > 0
    ? ` (${configuredNames.join(", ")} must contain a public HTTPS origin)`
    : "";

  console.warn(
    `[site-url] No valid production site URL${detail}. metadataBase is unset; configure NEXT_PUBLIC_SITE_URL before deployment.`,
  );
}

export function getMetadataBase() {
  const production = process.env.NODE_ENV === "production";

  for (const [, value] of SITE_URL_CANDIDATES) {
    const url = parseSiteUrl(value, production);
    if (url) return url;
  }

  if (production) {
    warnAboutProductionUrl();
    return undefined;
  }

  return DEVELOPMENT_SITE_URL;
}

export function getSiteUrl() {
  return getMetadataBase() ?? DEVELOPMENT_SITE_URL;
}

export function getAbsoluteSiteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}
