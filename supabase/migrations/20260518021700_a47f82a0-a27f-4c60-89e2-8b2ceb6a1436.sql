ALTER TABLE public.realisation_photos
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.section_photos
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS trg_realisation_photos_updated ON public.realisation_photos;
CREATE TRIGGER trg_realisation_photos_updated
  BEFORE UPDATE ON public.realisation_photos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_section_photos_updated ON public.section_photos;
CREATE TRIGGER trg_section_photos_updated
  BEFORE UPDATE ON public.section_photos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();