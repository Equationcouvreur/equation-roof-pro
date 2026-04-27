-- Table des sections éditables (Cœur de Métier + Solutions Innovantes)
CREATE TABLE IF NOT EXISTS public.site_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  page text NOT NULL CHECK (page IN ('coeur-metier', 'solutions-innovantes')),
  title text NOT NULL,
  intro text,
  points text[] DEFAULT '{}'::text[],
  reference_text text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.section_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.site_sections(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt_text text,
  caption text,
  display_order int NOT NULL DEFAULT 0,
  is_favorite boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_section_photos_section ON public.section_photos(section_id);

-- Réutilise le trigger updated_at déjà défini
DROP TRIGGER IF EXISTS site_sections_updated_at ON public.site_sections;
CREATE TRIGGER site_sections_updated_at
  BEFORE UPDATE ON public.site_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Réutilise le trigger "une seule favorite" en l'adaptant aux sections
CREATE OR REPLACE FUNCTION public.enforce_single_section_favorite()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.is_favorite = true THEN
    UPDATE public.section_photos
    SET is_favorite = false
    WHERE section_id = NEW.section_id
      AND id <> NEW.id
      AND is_favorite = true;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS section_photos_single_favorite ON public.section_photos;
CREATE TRIGGER section_photos_single_favorite
  BEFORE INSERT OR UPDATE OF is_favorite ON public.section_photos
  FOR EACH ROW EXECUTE FUNCTION public.enforce_single_section_favorite();

-- RLS
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sections"
  ON public.site_sections FOR SELECT
  TO public USING (true);

CREATE POLICY "Editors can insert sections"
  ON public.site_sections FOR INSERT
  TO authenticated WITH CHECK (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Editors can update sections"
  ON public.site_sections FOR UPDATE
  TO authenticated USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can delete sections"
  ON public.site_sections FOR DELETE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view section photos"
  ON public.section_photos FOR SELECT
  TO public USING (true);

CREATE POLICY "Editors can manage section photos"
  ON public.section_photos FOR ALL
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()))
  WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Seed des 10 sections existantes
INSERT INTO public.site_sections (slug, page, title, intro, points, reference_text, display_order) VALUES
('isolation', 'coeur-metier', 'Isolation Thermique — Le Poste N°1 d''Économie d''Énergie',
 'L''isolation thermique par la toiture est le poste n°1 d''économie d''énergie. Jusqu''à 30% des déperditions de chaleur passent par le toit. EQUATION réalise des complexes d''isolation thermique performants en toiture terrasse : mousse polyuréthane projetée, verre cellulaire FOAMGLAS, laine de roche, polystyrène extrudé (XPS). Nos solutions respectent les exigences de la RE 2020 et sont éligibles aux aides MaPrimeRénov.',
 ARRAY['Conforme RE 2020','Éligible MaPrimeRénov','Performances thermiques certifiées','Couplage isolation + étanchéité'],
 NULL, 1),
('bitumineuse', 'coeur-metier', 'Étanchéité Bitumineuse — La Solution Éprouvée',
 'La membrane bitumineuse est le système d''étanchéité le plus répandu sur les toitures terrasses. Chez EQUATION, nous maîtrisons la mise en œuvre des systèmes monocouche et bicouche soudés au chalumeau, conformément au DTU 43.1. Nos équipes interviennent sur tous types de supports — béton, acier, bois — et réalisent des complexes complets incluant pare-vapeur, isolation thermique et revêtement d''étanchéité autoprotégé ou sous protection lourde.',
 ARRAY['Conforme NF DTU 43.1','Compatible isolation polyuréthane et verre cellulaire','Protection autoprotégée ou sous gravillons','Garantie décennale'],
 NULL, 2),
('resine', 'coeur-metier', 'Étanchéité Résine — Sans Joint, Sans Limite',
 'Les systèmes d''étanchéité liquide (SEL) permettent de traiter les surfaces complexes, les angles, les relevés et les points singuliers avec une membrane continue sans joint ni soudure. Idéale en rénovation sur supports irréguliers, la résine polyuréthane ou PMMA forme un film étanche parfaitement adhérent au support.',
 ARRAY['Membrane continue sans raccord','Idéale pour rénovation et géométries complexes','Application à froid, sans flamme','Résistance aux UV et au trafic léger'],
 NULL, 3),
('dalles', 'coeur-metier', 'Terrasses Dalles sur Plots — Aménagez Votre Toiture',
 'Transformez votre toiture terrasse inaccessible en un véritable espace de vie. Le système de dalles sur plots réglables permet de créer une terrasse accessible et esthétique tout en protégeant le complexe d''étanchéité. EQUATION assure la pose sur plots de dalles béton, grès cérame, pierre naturelle, ainsi que de dalles et lames en bois IPE pour une finition haut de gamme.',
 ARRAY['Plots PVC réglables 40-100mm','Bois IPE classe 4 imputrescible','Clips invisibles inox A4','Drainage naturel sous dalles'],
 NULL, 4),
('vegetalisee', 'coeur-metier', 'Toitures Végétalisées — Esthétique et Écologie',
 'La toiture végétalisée associe performance d''étanchéité et bénéfices environnementaux : isolation thermique et acoustique renforcée, gestion des eaux pluviales, biodiversité urbaine, lutte contre les îlots de chaleur. EQUATION installe des systèmes extensifs (sedums, graminées) et semi-intensifs sur tous types de supports.',
 ARRAY['Membrane anti-racines certifiée FLL','Substrat drainant léger','Sedums et graminées résistants','Entretien réduit'],
 NULL, 5),
('fuite', 'coeur-metier', 'Recherche de Fuite — Diagnostic Précis',
 'EQUATION dispose d''équipements de pointe pour localiser précisément les infiltrations sur toiture terrasse : caméra thermique, fumigènes, test à l''eau, test électrique haute tension. Nos diagnostics sont accompagnés d''un rapport détaillé et d''un devis de réparation.',
 ARRAY['Caméra thermique infrarouge','Test électrique haute tension','Rapport détaillé sous 48h','Devis de réparation immédiat'],
 NULL, 6),
('foamglas', 'solutions-innovantes', 'Isolation Thermique FOAMGLAS — Garantie 30 Ans',
 'Le verre cellulaire FOAMGLAS est le matériau d''isolation le plus performant et le plus durable du marché pour les toitures terrasses. Étanche à l''eau et à la vapeur, incompressible, incombustible et résistant aux insectes et rongeurs, le FOAMGLAS offre une durée de vie exceptionnelle avec une garantie fabricant de 30 ans. EQUATION est qualifiée pour la mise en œuvre de ce procédé haut de gamme, collé au bitume à chaud sur les toitures terrasses.',
 ARRAY['Garantie fabricant 30 ans','Étanche à l''eau ET à la vapeur (pas besoin de pare-vapeur séparé)','Incompressible — supporte les charges lourdes sans tassement','Incombustible classement A1 — sécurité incendie maximale','Insensible aux rongeurs, insectes et moisissures'],
 'Référence chantier : Groupe La Glacière pour Auvergne Habitat — 1 200 m² de toitures terrasses avec verre cellulaire collé au bitume à chaud.', 1),
('cool-roof', 'solutions-innovantes', 'Toitures Froides / Cool Roof',
 'Le Cool Roof est une solution de toiture réfléchissante qui réduit la température intérieure des bâtiments en réfléchissant les rayons solaires au lieu de les absorber. En appliquant un revêtement blanc hautement réflectif sur la membrane d''étanchéité existante, la température en toiture peut baisser de 30 à 40°C en période estivale.',
 ARRAY['Réduction température toiture de 30 à 40°C en été','Baisse de la consommation de climatisation de 20 à 40%','Application sur étanchéité existante (pas de dépose)','Prolonge la durée de vie de la membrane d''étanchéité','Contribue à la lutte contre les îlots de chaleur urbains'],
 NULL, 2),
('photovoltaique', 'solutions-innovantes', 'Toitures avec Panneaux Photovoltaïques',
 'EQUATION réalise l''intégration de panneaux photovoltaïques sur les toitures terrasses en coordination avec les installateurs solaires. Notre rôle : garantir que l''étanchéité de la toiture reste parfaite malgré les fixations et le poids des modules.',
 ARRAY['Complexes d''étanchéité renforcés sous panneaux','Compatibles systèmes lestés, fixés ou collés','Reprise d''étanchéité autour de chaque pénétration','Coordination avec installateurs solaires'],
 NULL, 3),
('quartz', 'solutions-innovantes', 'Revêtement Quartz — Finition Haut de Gamme',
 'Le revêtement quartz est une finition décorative et résistante appliquée sur étanchéité résine. Idéal pour les balcons, coursives et terrasses accessibles, il offre une surface antidérapante, esthétique et facile à entretenir, avec un large choix de coloris.',
 ARRAY['Surface antidérapante','Large choix de coloris','Compatible étanchéité résine','Entretien facile'],
 NULL, 4)
ON CONFLICT (slug) DO NOTHING;