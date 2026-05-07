REVOKE EXECUTE ON FUNCTION public.trigger_vercel_rebuild(text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_content_change() FROM PUBLIC, anon, authenticated;