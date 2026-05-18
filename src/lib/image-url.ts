/**
 * Append a cache-busting version query string to an image URL.
 *
 * Why: Supabase Storage + the Vercel CDN cache images aggressively by URL.
 * When an image is replaced or updated in the admin, the URL often stays the
 * same (same storage path) so browsers and CDNs keep serving the stale copy.
 * Appending `?v=<timestamp>` derived from the photo's `updated_at` (or
 * `created_at` as fallback) forces a fresh fetch as soon as the row changes.
 *
 * Local assets (/placeholder.svg, /assets/…) and data: URIs are returned
 * unchanged.
 */
export function withCacheBust(url: string | null | undefined, version?: string | null): string {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;
  // Skip local public assets and Vite-bundled assets.
  if (url.startsWith("/") && !url.startsWith("//")) return url;

  const v = version ? Date.parse(version) : NaN;
  if (!Number.isFinite(v)) return url;

  const separator = url.includes("?") ? "&" : "?";
  // Use a stable param name so admins can recognize it.
  return `${url}${separator}v=${v}`;
}
