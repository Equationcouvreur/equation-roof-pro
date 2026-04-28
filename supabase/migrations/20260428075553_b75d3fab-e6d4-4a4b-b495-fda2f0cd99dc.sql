CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'info@etanche.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  ELSIF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'on_auth_user_bootstrap_admin'
  ) THEN
    CREATE TRIGGER on_auth_user_bootstrap_admin
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.bootstrap_first_admin();
  END IF;
END $$;

REVOKE EXECUTE ON FUNCTION public.bootstrap_first_admin() FROM anon, authenticated, public;