
-- Drop overly permissive policies and replace with auth-only ones
-- The edge function uses service_role key which bypasses RLS entirely,
-- so we don't need these permissive policies at all
DROP POLICY "Service role can insert archives" ON public.site_archives;
DROP POLICY "Service role can select archives" ON public.site_archives;
