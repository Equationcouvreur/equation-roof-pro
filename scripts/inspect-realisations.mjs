import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = readFileSync(join(__dirname, "..", ".env"), "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/i);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false },
});

const { data, error } = await sb
  .from("realisations")
  .select("id,title,status,display_order")
  .order("display_order", { ascending: true });
if (error) { console.error("realisations error:", error.message); process.exit(1); }
console.log("realisations count:", data.length);
data.forEach((r) => console.log(`  ${r.display_order}\t${r.status}\t${r.id}\t${r.title}`));

console.log("\n--- blog_articles ---");
const { data: bp, error: bpe } = await sb.from("blog_articles").select("id,title,slug,status").limit(20);
if (bpe) console.log("blog_articles error:", bpe.message);
else { console.log("  count:", bp?.length); bp?.forEach(b => console.log(`  ${b.status}\t${b.slug}\t${b.title}`)); }

console.log("\n--- check slug column on realisations ---");
const { data: slugCheck, error: slugErr } = await sb
  .from("realisations")
  .select("title,slug")
  .eq("status", "published")
  .order("display_order");
if (slugErr) console.log("  ERROR:", slugErr.message);
else {
  console.log("  count:", slugCheck.length);
  slugCheck.forEach((r) => console.log(`  ${r.slug || "(NULL)"}\t${r.title}`));
}
