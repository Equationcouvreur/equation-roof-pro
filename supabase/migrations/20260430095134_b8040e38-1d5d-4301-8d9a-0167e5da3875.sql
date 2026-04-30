REVOKE EXECUTE ON FUNCTION public.current_client_user_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_client_user_id() TO authenticated;