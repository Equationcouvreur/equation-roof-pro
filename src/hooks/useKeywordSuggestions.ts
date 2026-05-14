import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { foldKeyword, normalizeKeyword } from "@/lib/keywords";

/**
 * Returns a deduped, alphabetically-sorted list of keywords already used
 * across all image-bearing tables. Used for autocomplete suggestions.
 * Keys are normalised (lowercase, trimmed) and folded keys are compared
 * to avoid showing accent/case duplicates.
 */
export function useKeywordSuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [r, s, b] = await Promise.all([
        supabase.from("realisation_photos").select("keywords").limit(2000),
        supabase.from("section_photos").select("keywords").limit(2000),
        supabase.from("blog_articles").select("cover_keywords").limit(2000),
      ]);
      const byFold = new Map<string, string>();
      const collect = (rows: { keywords?: string[] | null; cover_keywords?: string[] | null }[] | null) => {
        rows?.forEach((row) => {
          (row.keywords || row.cover_keywords || []).forEach((k) => {
            if (!k) return;
            const norm = normalizeKeyword(k);
            if (!norm) return;
            const fold = foldKeyword(norm);
            if (!byFold.has(fold)) byFold.set(fold, norm);
          });
        });
      };
      collect(r.data as never);
      collect(s.data as never);
      collect(b.data as never);
      if (!cancelled) {
        setSuggestions(Array.from(byFold.values()).sort((a, b) => a.localeCompare(b, "fr")));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return suggestions;
}
