import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const STATIC_PUBLIC_ROUTES = [
  "/",
  "/coeur-de-metier",
  "/solutions-innovantes",
  "/realisations",
  "/entreprise",
  "/contact",
  "/a-propos",
  "/avis-clients",
  "/blog",
  "/recrutement",
  "/mentions-legales",
];

const SSG_EXCLUDED_PREFIXES = ["/admin", "/espace-client"];

async function fetchDynamicRoutes(
  env: Record<string, string>,
  isProduction: boolean,
): Promise<string[]> {
  const url = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    const msg =
      "[ssg] FATAL: Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY at production build time. Pages réalisations et blog ne seraient pas générées. Configurer les env vars sur Vercel avant de déployer.";
    if (isProduction) throw new Error(msg);
    console.warn("[ssg] Supabase env missing — pre-rendering static routes only.");
    return [];
  }
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(url, key, { auth: { persistSession: false } });

    const dynamic: string[] = [];

    const { data: reals, error: realsErr } = await sb
      .from("realisations")
      .select("slug")
      .eq("status", "published");
    if (realsErr) {
      console.warn("[ssg] realisations fetch failed:", realsErr.message);
    } else {
      for (const r of reals ?? []) {
        if (r?.slug) dynamic.push(`/realisations/${r.slug}`);
      }
    }

    const { data: posts, error: postsErr } = await sb
      .from("blog_articles")
      .select("slug")
      .eq("status", "published");
    if (postsErr) {
      console.warn("[ssg] blog_articles fetch failed:", postsErr.message);
    } else {
      for (const p of posts ?? []) {
        if (p?.slug) dynamic.push(`/blog/${p.slug}`);
      }
    }

    return dynamic;
  } catch (err) {
    console.warn("[ssg] Supabase client init failed:", (err as Error).message);
    return [];
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProduction = mode === "production" || process.env.NODE_ENV === "production";
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-helmet-async",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    build: {
      // manualChunks only applies to the client build — in the SSR build,
      // react/react-dom are externalized as Node modules and would crash
      // Rollup with "EXTERNAL_MODULES_CANNOT_BE_INCLUDED_IN_MANUAL_CHUNKS".
      rollupOptions: isSsrBuild
        ? undefined
        : {
            output: {
              manualChunks: {
                "vendor-react": ["react", "react-dom", "react-router-dom"],
                "vendor-supabase": ["@supabase/supabase-js"],
                "vendor-query": ["@tanstack/react-query"],
                "vendor-ui": ["lucide-react"],
              },
            },
          },
    },
    ssgOptions: {
      script: "async",
      formatting: "none",
      dirStyle: "nested",
      mock: true,
      includedRoutes: async () => {
        const dynamic = await fetchDynamicRoutes(env, isProduction);
        const all = [...STATIC_PUBLIC_ROUTES, ...dynamic].filter(
          (p) => !SSG_EXCLUDED_PREFIXES.some((prefix) => p === prefix || p.startsWith(prefix + "/")),
        );
        // De-dupe preserving order.
        return Array.from(new Set(all));
      },
    },
  };
});
