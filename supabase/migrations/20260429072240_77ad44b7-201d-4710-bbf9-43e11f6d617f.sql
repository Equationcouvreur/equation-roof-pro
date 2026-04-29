
-- Décale Recherche de Fuite pour insérer la nouvelle section avant
UPDATE public.site_sections
SET display_order = display_order + 1
WHERE page = 'coeur-metier' AND slug = 'fuite';

-- Insère la nouvelle section Sécurité
INSERT INTO public.site_sections (slug, page, title, intro, points, display_order, video_url)
VALUES (
  'securite-desenfumage',
  'coeur-metier',
  'Sécurité — Éclairage Zénithal — Désenfumage',
  E'La sécurité en toiture terrasse passe par des équipements conformes aux réglementations en vigueur. EQUATION assure la fourniture, la pose et la maintenance des dispositifs de sécurité, d''éclairage naturel et de désenfumage sur toitures terrasses et bâtiments industriels, commerciaux et tertiaires.\n\nNos interventions couvrent :\n\n• Les exutoires de désenfumage (DENFC) : dispositifs d''évacuation naturelle des fumées et de la chaleur, obligatoires dans les ERP et les bâtiments industriels conformément à la norme NF EN 12101-2. Nous assurons la pose, le raccordement et la maintenance préventive de ces équipements.\n\n• Les lanterneaux d''éclairage zénithal : apport de lumière naturelle en toiture pour les bâtiments industriels, entrepôts et locaux commerciaux. Voûtes filantes, dômes, costières et lanterneaux ponctuels en polycarbonate ou PMMA.\n\n• Les équipements de sécurité en toiture : garde-corps, lignes de vie, points d''ancrage, crosses d''accès et échelles à crinoline pour la sécurisation des accès et des interventions en toiture. Conformes aux normes NF EN 795 et NF E 85-015.',
  ARRAY[
    'Exutoires de désenfumage conformes NF EN 12101-2',
    'Lanterneaux d''éclairage zénithal (polycarbonate, PMMA)',
    'Garde-corps, lignes de vie et points d''ancrage',
    'Pose, raccordement et maintenance préventive',
    'Conformité ERP et bâtiments industriels'
  ],
  6,
  NULL
)
ON CONFLICT DO NOTHING;
