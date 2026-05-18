import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { withCacheBust } from "@/lib/image-url";
import type { GalleryImage } from "@/components/PhotoGallery";

export interface SectionContent {
  title: string;
  intro: string;
  points: string[];
  reference?: string;
  images: GalleryImage[];
  videoUrl?: string | null;
}

export interface SectionDefaults {
  title: string;
  text: string;
  points: string[];
  ref?: string;
  images: GalleryImage[];
}

/**
 * Loads a section's editable content (title/intro/points/reference + photos + video)
 * from the database by slug. Falls back to provided static defaults so the
 * site keeps rendering even before any admin edit.
 */
export const useSiteSection = (slug: string, defaults: SectionDefaults): SectionContent => {
  const [content, setContent] = useState<SectionContent>({
    title: defaults.title,
    intro: defaults.text,
    points: defaults.points,
    reference: defaults.ref,
    images: defaults.images,
    videoUrl: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: section } = await supabase
        .from("site_sections")
        .select("id, title, intro, points, reference_text, video_url")
        .eq("slug", slug)
        .maybeSingle();
      if (cancelled || !section) return;

      const { data: photos } = await supabase
        .from("section_photos")
        .select("url, caption, alt_text, is_favorite, display_order, updated_at, created_at")
        .eq("section_id", section.id)
        .order("is_favorite", { ascending: false })
        .order("display_order");

      if (cancelled) return;

      const dbImages: GalleryImage[] = (photos || []).map((p) => {
        const version =
          (p as { updated_at?: string | null }).updated_at ||
          (p as { created_at?: string | null }).created_at;
        return {
          src: withCacheBust(p.url, version),
          alt: p.alt_text || p.caption || "",
          caption: p.caption || undefined,
        };
      });

      setContent({
        title: section.title || defaults.title,
        intro: section.intro || defaults.text,
        points: section.points && section.points.length > 0 ? section.points : defaults.points,
        reference: section.reference_text || defaults.ref,
        images: dbImages.length > 0 ? dbImages : defaults.images,
        videoUrl: (section as { video_url?: string | null }).video_url || null,
      });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return content;
};
