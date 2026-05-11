
CREATE TABLE IF NOT EXISTS public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  position text,
  message text NOT NULL,
  cv_url text,
  cv_filename text,
  cv_size_bytes integer,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'interview', 'rejected', 'hired', 'archived')),
  admin_notes text,
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON public.job_applications(created_at DESC);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit application"
ON public.job_applications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Recrutement can view applications"
ON public.job_applications FOR SELECT
TO authenticated
USING (is_role_or_admin(auth.uid(), 'recrutement_editor'));

CREATE POLICY "Recrutement can update applications"
ON public.job_applications FOR UPDATE
TO authenticated
USING (is_role_or_admin(auth.uid(), 'recrutement_editor'));

CREATE POLICY "Recrutement can delete applications"
ON public.job_applications FOR DELETE
TO authenticated
USING (is_role_or_admin(auth.uid(), 'recrutement_editor'));

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cv-candidats',
  'cv-candidats',
  false,
  5242880,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can upload CV"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cv-candidats');

CREATE POLICY "Recrutement can view CVs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'cv-candidats'
  AND is_role_or_admin(auth.uid(), 'recrutement_editor')
);

CREATE POLICY "Recrutement can delete CVs"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'cv-candidats'
  AND is_role_or_admin(auth.uid(), 'recrutement_editor')
);
