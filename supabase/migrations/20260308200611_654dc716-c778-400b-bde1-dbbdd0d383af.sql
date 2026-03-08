
-- Page view analytics (anonymous, no auth required)
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  referrer text,
  user_agent text,
  country text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (anonymous tracking)
CREATE POLICY "Anyone can log page views" ON public.page_views
  FOR INSERT WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can view page views" ON public.page_views
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Deny anonymous reads
CREATE POLICY "Deny anonymous reads on page views" ON public.page_views
  FOR SELECT USING (false);

-- No updates or deletes
CREATE POLICY "Deny updates on page views" ON public.page_views
  FOR UPDATE USING (false);

CREATE POLICY "Deny deletes on page views" ON public.page_views
  FOR DELETE USING (false);
