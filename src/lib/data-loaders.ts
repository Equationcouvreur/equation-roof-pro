import { supabase } from "@/integrations/supabase/client";
import type { GalleryImage } from "@/components/PhotoGallery";

export type RealisationCardData = {
  id: string;
  slug: string | null;
  title: string;
  category: string;
  description: string;
  surface?: string | null;
  technique?: string | null;
  year?: string | null;
  location?: string | null;
  videoUrl?: string | null;
  images: GalleryImage[];
};

export type BlogArticleData = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  coverImageUrl: string | null;
  publishedAt: string | null;
};

// Fetch all published realisations + their photos as a flat structure
// suitable for both SSG pre-rendering and client-side route loading.
export async function fetchPublishedRealisations(): Promise<RealisationCardData[]> {
  const { data: reals, error } = await supabase
    .from("realisations")
    .select("id,slug,title,category,description,surface,technique,year,location,display_order,video_url")
    .eq("status", "published")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error || !reals?.length) return [];

  const ids = reals.map((r) => r.id);
  const { data: photos } = await supabase
    .from("realisation_photos")
    .select("realisation_id,url,alt_text,caption,display_order,is_favorite")
    .in("realisation_id", ids)
    .order("is_favorite", { ascending: false })
    .order("display_order", { ascending: true });

  return reals.map((r) => {
    const imgs = (photos || [])
      .filter((p) => p.realisation_id === r.id)
      .map<GalleryImage>((p) => ({
        src: p.url,
        alt: p.alt_text || r.title,
        caption: p.caption || undefined,
      }));
    return {
      id: r.id,
      slug: (r as { slug?: string | null }).slug ?? null,
      title: r.title,
      category: r.category,
      description: r.description || "",
      surface: r.surface,
      technique: r.technique,
      year: r.year,
      location: r.location,
      videoUrl: (r as { video_url?: string | null }).video_url || null,
      images: imgs.length ? imgs : [{ src: "/placeholder.svg", alt: r.title }],
    };
  });
}

export async function fetchPublishedBlogArticles(): Promise<BlogArticleData[]> {
  const { data, error } = await supabase
    .from("blog_articles")
    .select("slug,title,category,excerpt,cover_image_url,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return data.map((a) => ({
    slug: a.slug,
    title: a.title,
    category: a.category,
    excerpt: a.excerpt || "",
    coverImageUrl: a.cover_image_url || null,
    publishedAt: a.published_at || null,
  }));
}
