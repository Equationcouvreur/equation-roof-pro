#!/usr/bin/env node
// Generate public/sitemap.xml.
//
// URL de base : https://equation-roof-pro.vercel.app
// TODO: basculer sur https://etanche.com une fois le domaine branché.
//
// Lists all static public routes plus the published realisations and
// blog articles fetched from Supabase. Wrapped in try/catch so the build
// degrades gracefully when Supabase is unreachable at build time.

import { mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = dirname(__dirname);
const PUBLIC_DIR = join(PROJECT_ROOT, "public");
const OUTPUT = join(PUBLIC_DIR, "sitemap.xml");

const SITE_BASE = "https://equation-roof-pro.vercel.app";

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/coeur-de-metier", priority: "0.9", changefreq: "monthly" },
  { path: "/solutions-innovantes", priority: "0.9", changefreq: "monthly" },
  { path: "/realisations", priority: "0.9", changefreq: "weekly" },
  { path: "/entreprise", priority: "0.8", changefreq: "monthly" },
  { path: "/contact", priority: "0.8", changefreq: "yearly" },
  { path: "/a-propos", priority: "0.7", changefreq: "monthly" },
  { path: "/avis-clients", priority: "0.7", changefreq: "monthly" },
  { path: "/blog", priority: "0.8", changefreq: "weekly" },
  { path: "/recrutement", priority: "0.6", changefreq: "monthly" },
  { path: "/mentions-legales", priority: "0.3", changefreq: "yearly" },
];

function loadDotEnv() {
  try {
    const raw = readFileSync(join(PROJECT_ROOT, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/i);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {
    /* fall back to process env */
  }
}
loadDotEnv();

async function fetchSlugs() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.warn("[sitemap] Supabase env missing — skipping dynamic routes.");
    return { realisations: [], blog: [] };
  }
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(url, key, { auth: { persistSession: false } });
    const realisations = [];
    const blog = [];

    const realResp = await sb
      .from("realisations")
      .select("slug,updated_at")
      .eq("status", "published");
    if (realResp.error) {
      console.warn("[sitemap] realisations fetch failed:", realResp.error.message);
    } else {
      for (const r of realResp.data ?? []) {
        if (r?.slug) realisations.push({ slug: r.slug, lastmod: r.updated_at });
      }
    }

    const blogResp = await sb
      .from("blog_articles")
      .select("slug,updated_at,published_at")
      .eq("status", "published");
    if (blogResp.error) {
      console.warn("[sitemap] blog_articles fetch failed:", blogResp.error.message);
    } else {
      for (const b of blogResp.data ?? []) {
        if (b?.slug) blog.push({ slug: b.slug, lastmod: b.updated_at || b.published_at });
      }
    }
    return { realisations, blog };
  } catch (err) {
    console.warn("[sitemap] Supabase init failed:", err.message);
    return { realisations: [], blog: [] };
  }
}

function urlEntry(loc, lastmod, priority, changefreq) {
  const lm = lastmod ? new Date(lastmod).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lm}</lastmod>`,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

async function main() {
  const { realisations, blog } = await fetchSlugs();
  const today = new Date().toISOString().slice(0, 10);

  const entries = [];
  for (const r of STATIC_ROUTES) {
    entries.push(urlEntry(`${SITE_BASE}${r.path}`, today, r.priority, r.changefreq));
  }
  for (const r of realisations) {
    entries.push(urlEntry(`${SITE_BASE}/realisations/${r.slug}`, r.lastmod, "0.7", "monthly"));
  }
  for (const b of blog) {
    entries.push(urlEntry(`${SITE_BASE}/blog/${b.slug}`, b.lastmod, "0.7", "monthly"));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

  await mkdir(PUBLIC_DIR, { recursive: true });
  await writeFile(OUTPUT, xml, "utf8");
  console.log(`[sitemap] wrote ${OUTPUT} (${STATIC_ROUTES.length} static + ${realisations.length} réalisations + ${blog.length} blog = ${STATIC_ROUTES.length + realisations.length + blog.length} URLs)`);
}

main().catch((err) => {
  console.error("[sitemap] failed:", err);
  process.exit(1);
});
