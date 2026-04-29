ALTER TABLE public.site_sections ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE public.realisations ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS video_url text;