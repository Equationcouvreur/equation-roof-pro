
CREATE TABLE IF NOT EXISTS public.frontend_error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  error_message text,
  error_stack text,
  url text,
  user_agent text,
  user_id uuid
);

ALTER TABLE public.frontend_error_logs ENABLE ROW LEVEL SECURITY;

-- Anyone (incl. anonymous visitors) can log an error
CREATE POLICY "Anyone can log frontend errors"
  ON public.frontend_error_logs
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only admins can view logs
CREATE POLICY "Admins can view frontend error logs"
  ON public.frontend_error_logs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_frontend_error_logs_created_at
  ON public.frontend_error_logs (created_at DESC);
