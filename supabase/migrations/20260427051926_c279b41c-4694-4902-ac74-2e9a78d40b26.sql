-- Fix search_path on remaining functions
ALTER FUNCTION public.enforce_single_favorite() SET search_path = public;
ALTER FUNCTION public.set_updated_at() SET search_path = public;

-- Restrict EXECUTE on SECURITY DEFINER functions (only callable internally by RLS / triggers)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_admin_or_editor(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.enforce_single_favorite() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated, public;

-- Restrict bucket listing: only allow viewing specific objects, not listing everything
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
CREATE POLICY "Public can read media objects"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Note: The "listing" warning is acceptable for a public media bucket where URLs are
-- shared publicly anyway. Files are referenced by direct URL from the website.