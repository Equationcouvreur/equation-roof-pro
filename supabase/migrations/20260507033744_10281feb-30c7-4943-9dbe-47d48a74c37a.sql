CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE TABLE IF NOT EXISTS public.vercel_deploy_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  triggered_at timestamptz NOT NULL DEFAULT now(),
  source_table text NOT NULL,
  source_action text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_vercel_deploy_log_triggered_at
  ON public.vercel_deploy_log(triggered_at DESC);

ALTER TABLE public.vercel_deploy_log ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.trigger_vercel_rebuild(
  source_table text,
  source_action text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  last_trigger timestamptz;
  edge_url text := 'https://nvhjsaiczhjyjdoflykg.supabase.co/functions/v1/trigger-vercel-rebuild';
BEGIN
  SELECT MAX(triggered_at) INTO last_trigger FROM public.vercel_deploy_log;

  IF last_trigger IS NOT NULL AND last_trigger > (now() - interval '60 seconds') THEN
    RAISE NOTICE 'Rebuild skipped (debounce): last trigger at %', last_trigger;
    RETURN;
  END IF;

  INSERT INTO public.vercel_deploy_log (source_table, source_action)
  VALUES (source_table, source_action);

  PERFORM net.http_post(
    url := edge_url,
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object('source_table', source_table, 'source_action', source_action)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_content_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.trigger_vercel_rebuild(TG_TABLE_NAME, TG_OP);
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_blog_articles_rebuild ON public.blog_articles;
CREATE TRIGGER trg_blog_articles_rebuild
AFTER INSERT OR UPDATE OR DELETE ON public.blog_articles
FOR EACH ROW EXECUTE FUNCTION public.notify_content_change();

DROP TRIGGER IF EXISTS trg_realisations_rebuild ON public.realisations;
CREATE TRIGGER trg_realisations_rebuild
AFTER INSERT OR UPDATE OR DELETE ON public.realisations
FOR EACH ROW EXECUTE FUNCTION public.notify_content_change();

DROP TRIGGER IF EXISTS trg_realisation_photos_rebuild ON public.realisation_photos;
CREATE TRIGGER trg_realisation_photos_rebuild
AFTER INSERT OR UPDATE OR DELETE ON public.realisation_photos
FOR EACH ROW EXECUTE FUNCTION public.notify_content_change();

DROP TRIGGER IF EXISTS trg_site_sections_rebuild ON public.site_sections;
CREATE TRIGGER trg_site_sections_rebuild
AFTER INSERT OR UPDATE OR DELETE ON public.site_sections
FOR EACH ROW EXECUTE FUNCTION public.notify_content_change();

DROP TRIGGER IF EXISTS trg_section_photos_rebuild ON public.section_photos;
CREATE TRIGGER trg_section_photos_rebuild
AFTER INSERT OR UPDATE OR DELETE ON public.section_photos
FOR EACH ROW EXECUTE FUNCTION public.notify_content_change();

DROP TRIGGER IF EXISTS trg_job_offers_rebuild ON public.job_offers;
CREATE TRIGGER trg_job_offers_rebuild
AFTER INSERT OR UPDATE OR DELETE ON public.job_offers
FOR EACH ROW EXECUTE FUNCTION public.notify_content_change();