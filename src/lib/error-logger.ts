import { supabase } from "@/integrations/supabase/client";

const RECENT_ERRORS = new Set<string>();
const DEDUP_WINDOW_MS = 5000;

export async function logFrontendError(error: unknown, info?: { source?: string }) {
  try {
    const err = error instanceof Error ? error : new Error(String(error));
    const message = err.message || "Unknown error";
    const stack = err.stack || null;

    const dedupKey = `${message}::${info?.source || ""}`;
    if (RECENT_ERRORS.has(dedupKey)) return;
    RECENT_ERRORS.add(dedupKey);
    setTimeout(() => RECENT_ERRORS.delete(dedupKey), DEDUP_WINDOW_MS);

    if (typeof window === "undefined") return;

    const { data: { user } = { user: null } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

    await supabase.from("frontend_error_logs").insert({
      error_message: info?.source ? `[${info.source}] ${message}` : message,
      error_stack: stack,
      url: window.location.href,
      user_agent: window.navigator.userAgent,
      user_id: user?.id ?? null,
    });
  } catch (e) {
    // Never let the logger crash the app
    console.warn("[error-logger] failed to log error", e);
  }
}

/**
 * Detects "stale chunk" / dynamic import failures that happen after a deploy
 * (Vercel returns an HTML 404 for an old hashed JS file, which causes
 * `JSON.parse` errors or "Failed to fetch dynamically imported module").
 * In that case we reload the page once to pull the new bundle.
 */
const RELOAD_KEY = "__equation_chunk_reload";
export function isChunkLoadError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error || "");
  return (
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg) ||
    /Loading chunk \d+ failed/i.test(msg) ||
    /ChunkLoadError/i.test(msg) ||
    /Unexpected token '<'/i.test(msg) ||
    /is not valid JSON/i.test(msg)
  );
}

export function maybeReloadOnChunkError(error: unknown): boolean {
  if (typeof window === "undefined") return false;
  if (!isChunkLoadError(error)) return false;
  try {
    const already = sessionStorage.getItem(RELOAD_KEY);
    if (already) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    // sessionStorage may be blocked
  }
  // Small delay so the user briefly sees the fallback rather than a flash
  setTimeout(() => window.location.reload(), 600);
  return true;
}

export function clearChunkReloadFlag() {
  try {
    sessionStorage.removeItem(RELOAD_KEY);
  } catch { /* noop */ }
}
