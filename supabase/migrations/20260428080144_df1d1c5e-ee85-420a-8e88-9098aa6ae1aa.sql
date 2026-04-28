
CREATE TABLE public.job_offers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  contract_type text NOT NULL DEFAULT 'CDI',
  location text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published job offers"
ON public.job_offers FOR SELECT
USING (is_published = true);

CREATE POLICY "Editors can view all job offers"
ON public.job_offers FOR SELECT TO authenticated
USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Editors can insert job offers"
ON public.job_offers FOR INSERT TO authenticated
WITH CHECK (is_admin_or_editor(auth.uid()));

CREATE POLICY "Editors can update job offers"
ON public.job_offers FOR UPDATE TO authenticated
USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can delete job offers"
ON public.job_offers FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_job_offers_updated_at
BEFORE UPDATE ON public.job_offers
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.job_offers (title, contract_type, location, description, display_order) VALUES
('Étancheur·se confirmé·e', 'CDI', 'Cournon-d''Auvergne (63)', 'Pose d''étanchéité bitumineuse, résine, isolation. Expérience 3+ ans.', 1),
('Étancheur·se débutant·e / Apprenti·e', 'CDI / Alternance', 'Cournon-d''Auvergne (63)', 'Formation assurée en interne. Motivation et rigueur exigées.', 2),
('Chef·fe d''équipe étanchéité', 'CDI', 'Puy-de-Dôme', 'Encadrement chantier, lecture de plans, autonomie complète.', 3),
('Candidature spontanée', 'Toutes fonctions', 'Auvergne', 'Vous ne trouvez pas votre poste ? Envoyez-nous votre CV.', 4);
