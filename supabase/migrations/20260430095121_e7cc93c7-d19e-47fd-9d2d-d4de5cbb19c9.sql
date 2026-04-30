-- Table client_users
CREATE TABLE public.client_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID UNIQUE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  company TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'employee')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID
);

CREATE INDEX idx_client_users_auth_user_id ON public.client_users(auth_user_id);

-- Table client_documents
CREATE TABLE public.client_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_user_id UUID NOT NULL REFERENCES public.client_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'image', 'video', 'other')),
  file_size_bytes BIGINT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  uploaded_by UUID
);

CREATE INDEX idx_client_documents_client_user_id ON public.client_documents(client_user_id);

-- Trigger updated_at
CREATE TRIGGER set_client_users_updated_at
BEFORE UPDATE ON public.client_users
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Helper function: get client_user_id for the currently authenticated user
CREATE OR REPLACE FUNCTION public.current_client_user_id()
RETURNS UUID
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.client_users WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

-- Enable RLS
ALTER TABLE public.client_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_documents ENABLE ROW LEVEL SECURITY;

-- client_users policies
CREATE POLICY "Editors can view all client_users"
ON public.client_users FOR SELECT TO authenticated
USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Clients can view own row"
ON public.client_users FOR SELECT TO authenticated
USING (auth_user_id = auth.uid());

CREATE POLICY "Editors can insert client_users"
ON public.client_users FOR INSERT TO authenticated
WITH CHECK (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Editors can update client_users"
ON public.client_users FOR UPDATE TO authenticated
USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can delete client_users"
ON public.client_users FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- client_documents policies
CREATE POLICY "Editors can view all client_documents"
ON public.client_documents FOR SELECT TO authenticated
USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Clients can view own documents"
ON public.client_documents FOR SELECT TO authenticated
USING (client_user_id = public.current_client_user_id());

CREATE POLICY "Editors can insert client_documents"
ON public.client_documents FOR INSERT TO authenticated
WITH CHECK (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Editors can update client_documents"
ON public.client_documents FOR UPDATE TO authenticated
USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Editors can delete client_documents"
ON public.client_documents FOR DELETE TO authenticated
USING (public.is_admin_or_editor(auth.uid()));

-- Storage bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-documents', 'client-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies on storage.objects for bucket client-documents
CREATE POLICY "Editors can read client-documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'client-documents' AND public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Clients can read own folder client-documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'client-documents'
  AND (storage.foldername(name))[1] = public.current_client_user_id()::text
);

CREATE POLICY "Editors can upload client-documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'client-documents' AND public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Editors can update client-documents"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'client-documents' AND public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Editors can delete client-documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'client-documents' AND public.is_admin_or_editor(auth.uid()));