const mediaBaseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "") ?? "";

export function mediaUrl(path: string): string {
  return mediaBaseUrl ? `${mediaBaseUrl}${path}` : path;
}
