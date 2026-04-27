-- =========================================
-- 1. ROLES SYSTEM
-- =========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: is admin or editor
CREATE OR REPLACE FUNCTION public.is_admin_or_editor(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'editor')
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- 2. PROFILES
-- =========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- 3. BLOG ARTICLES
-- =========================================
CREATE TABLE public.blog_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  cover_image_url TEXT,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_blog_articles_status ON public.blog_articles(status);
CREATE INDEX idx_blog_articles_slug ON public.blog_articles(slug);

ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published articles"
  ON public.blog_articles FOR SELECT
  USING (status = 'published');

CREATE POLICY "Editors can view all articles"
  ON public.blog_articles FOR SELECT
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Editors can insert articles"
  ON public.blog_articles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Editors can update articles"
  ON public.blog_articles FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can delete articles"
  ON public.blog_articles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- 4. REALISATIONS
-- =========================================
CREATE TABLE public.realisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  surface TEXT,
  technique TEXT,
  year TEXT,
  location TEXT,
  display_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_realisations_status ON public.realisations(status);
CREATE INDEX idx_realisations_order ON public.realisations(display_order);

ALTER TABLE public.realisations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published realisations"
  ON public.realisations FOR SELECT
  USING (status = 'published');

CREATE POLICY "Editors can view all realisations"
  ON public.realisations FOR SELECT
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Editors can insert realisations"
  ON public.realisations FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Editors can update realisations"
  ON public.realisations FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can delete realisations"
  ON public.realisations FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- 5. REALISATION PHOTOS
-- =========================================
CREATE TABLE public.realisation_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  realisation_id UUID NOT NULL REFERENCES public.realisations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_realisation_photos_realisation ON public.realisation_photos(realisation_id);
CREATE INDEX idx_realisation_photos_order ON public.realisation_photos(display_order);

ALTER TABLE public.realisation_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view photos of published realisations"
  ON public.realisation_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.realisations r
      WHERE r.id = realisation_id AND r.status = 'published'
    )
  );

CREATE POLICY "Editors can view all photos"
  ON public.realisation_photos FOR SELECT
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Editors can manage photos"
  ON public.realisation_photos FOR ALL
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()))
  WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Enforce single favorite per realisation
CREATE OR REPLACE FUNCTION public.enforce_single_favorite()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_favorite = true THEN
    UPDATE public.realisation_photos
    SET is_favorite = false
    WHERE realisation_id = NEW.realisation_id
      AND id <> NEW.id
      AND is_favorite = true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_single_favorite
  AFTER INSERT OR UPDATE OF is_favorite ON public.realisation_photos
  FOR EACH ROW
  WHEN (NEW.is_favorite = true)
  EXECUTE FUNCTION public.enforce_single_favorite();

-- =========================================
-- 6. UPDATED_AT TRIGGERS
-- =========================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_articles_updated BEFORE UPDATE ON public.blog_articles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_realisations_updated BEFORE UPDATE ON public.realisations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================
-- 7. STORAGE BUCKET
-- =========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Editors can upload media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Editors can update media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Editors can delete media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_admin_or_editor(auth.uid()));