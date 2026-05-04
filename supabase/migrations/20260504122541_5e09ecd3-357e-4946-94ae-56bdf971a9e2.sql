ALTER TABLE public.realisations
  ADD COLUMN IF NOT EXISTS slug text;

UPDATE public.realisations SET slug = CASE title
  WHEN 'CPAM Nevers'                                 THEN 'cpam-nevers'
  WHEN 'Nièvre Habitat Nevers'                       THEN 'nievre-habitat-nevers'
  WHEN 'Groupe La Glacière — Auvergne Habitat'       THEN 'groupe-la-glaciere'
  WHEN 'Assemblia Clermont-Ferrand'                  THEN 'assemblia-clermont-ferrand'
  WHEN 'Université d''Auvergne — Bât. Paul Collomp'  THEN 'universite-auvergne'
  WHEN 'Résidence Arverne — Square Habitat'          THEN 'residence-arverne'
  WHEN 'Terrasse Privée IPE — Lames Premium'         THEN 'terrasse-ipe'
  WHEN 'Toiture Sedum Murol'                         THEN 'toiture-sedum-murol'
  WHEN 'École Jean Alix — Extension'                 THEN 'ecole-jean-alix'
  WHEN 'Romagnat — 18 Logements'                     THEN 'romagnat-18-logements'
  WHEN 'Centre Multi-Accueil Vic-le-Comte'           THEN 'centre-multi-accueil-vic-le-comte'
  WHEN '16 Logements Le Cendre — Accession Sociale'  THEN '16-logements-le-cendre'
  ELSE slug
END
WHERE slug IS NULL;

UPDATE public.realisations
SET slug = trim(both '-' from regexp_replace(
  lower(translate(
    title,
    'àáâäãåèéêëìíîïòóôöõùúûüýñçœæ''’"',
    'aaaaaaeeeeiiiiooooouuuuyncoea  '
  )),
  '[^a-z0-9]+', '-', 'g'
))
WHERE slug IS NULL OR slug = '';

ALTER TABLE public.realisations
  ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS realisations_slug_unique_idx
  ON public.realisations (slug);

NOTIFY pgrst, 'reload schema';