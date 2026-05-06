-- 1) Ajout des nouvelles valeurs à l'enum app_role (idempotent)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'blog_editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'realisations_editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'sections_editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'recrutement_editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'commercial';

-- 2) Helpers (text-based pour pouvoir utiliser les valeurs nouvelles dans la même migration)
CREATE OR REPLACE FUNCTION public.has_role_text(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role::text = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_role_or_admin(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_admin_or_editor(_user_id)
      OR public.has_role_text(_user_id, _role);
$$;

-- 3) blog_articles : ouvre write aux blog_editor
DROP POLICY IF EXISTS "Editors can insert articles" ON public.blog_articles;
DROP POLICY IF EXISTS "Editors can update articles" ON public.blog_articles;
DROP POLICY IF EXISTS "Editors can view all articles" ON public.blog_articles;

CREATE POLICY "Blog editors can insert articles" ON public.blog_articles
  FOR INSERT TO authenticated
  WITH CHECK (public.is_role_or_admin(auth.uid(), 'blog_editor'));
CREATE POLICY "Blog editors can update articles" ON public.blog_articles
  FOR UPDATE TO authenticated
  USING (public.is_role_or_admin(auth.uid(), 'blog_editor'));
CREATE POLICY "Blog editors can view all articles" ON public.blog_articles
  FOR SELECT TO authenticated
  USING (public.is_role_or_admin(auth.uid(), 'blog_editor'));

-- 4) realisations : ouvre write aux realisations_editor
DROP POLICY IF EXISTS "Editors can insert realisations" ON public.realisations;
DROP POLICY IF EXISTS "Editors can update realisations" ON public.realisations;
DROP POLICY IF EXISTS "Editors can view all realisations" ON public.realisations;

CREATE POLICY "Realisations editors can insert" ON public.realisations
  FOR INSERT TO authenticated
  WITH CHECK (public.is_role_or_admin(auth.uid(), 'realisations_editor'));
CREATE POLICY "Realisations editors can update" ON public.realisations
  FOR UPDATE TO authenticated
  USING (public.is_role_or_admin(auth.uid(), 'realisations_editor'));
CREATE POLICY "Realisations editors can view all" ON public.realisations
  FOR SELECT TO authenticated
  USING (public.is_role_or_admin(auth.uid(), 'realisations_editor'));

-- 5) realisation_photos
DROP POLICY IF EXISTS "Editors can manage photos" ON public.realisation_photos;
DROP POLICY IF EXISTS "Editors can view all photos" ON public.realisation_photos;

CREATE POLICY "Realisations editors manage photos" ON public.realisation_photos
  FOR ALL TO authenticated
  USING (public.is_role_or_admin(auth.uid(), 'realisations_editor'))
  WITH CHECK (public.is_role_or_admin(auth.uid(), 'realisations_editor'));

-- 6) site_sections
DROP POLICY IF EXISTS "Editors can insert sections" ON public.site_sections;
DROP POLICY IF EXISTS "Editors can update sections" ON public.site_sections;

CREATE POLICY "Sections editors can insert" ON public.site_sections
  FOR INSERT TO authenticated
  WITH CHECK (public.is_role_or_admin(auth.uid(), 'sections_editor'));
CREATE POLICY "Sections editors can update" ON public.site_sections
  FOR UPDATE TO authenticated
  USING (public.is_role_or_admin(auth.uid(), 'sections_editor'));

-- 7) section_photos
DROP POLICY IF EXISTS "Editors can manage section photos" ON public.section_photos;

CREATE POLICY "Sections editors manage section photos" ON public.section_photos
  FOR ALL TO authenticated
  USING (public.is_role_or_admin(auth.uid(), 'sections_editor'))
  WITH CHECK (public.is_role_or_admin(auth.uid(), 'sections_editor'));

-- 8) job_offers
DROP POLICY IF EXISTS "Editors can insert job offers" ON public.job_offers;
DROP POLICY IF EXISTS "Editors can update job offers" ON public.job_offers;
DROP POLICY IF EXISTS "Editors can view all job offers" ON public.job_offers;

CREATE POLICY "Recrutement editors can insert" ON public.job_offers
  FOR INSERT TO authenticated
  WITH CHECK (public.is_role_or_admin(auth.uid(), 'recrutement_editor'));
CREATE POLICY "Recrutement editors can update" ON public.job_offers
  FOR UPDATE TO authenticated
  USING (public.is_role_or_admin(auth.uid(), 'recrutement_editor'));
CREATE POLICY "Recrutement editors can view all" ON public.job_offers
  FOR SELECT TO authenticated
  USING (public.is_role_or_admin(auth.uid(), 'recrutement_editor'));

-- 9) client_users : write réservé admin/editor ; commercial = read-only
DROP POLICY IF EXISTS "Editors can view all client_users" ON public.client_users;

CREATE POLICY "Editors and commercial can view client_users" ON public.client_users
  FOR SELECT TO authenticated
  USING (public.is_role_or_admin(auth.uid(), 'commercial'));

-- 10) client_documents : commercial peut lire
DROP POLICY IF EXISTS "Editors can view all client_documents" ON public.client_documents;

CREATE POLICY "Editors and commercial can view client_documents" ON public.client_documents
  FOR SELECT TO authenticated
  USING (public.is_role_or_admin(auth.uid(), 'commercial'));
