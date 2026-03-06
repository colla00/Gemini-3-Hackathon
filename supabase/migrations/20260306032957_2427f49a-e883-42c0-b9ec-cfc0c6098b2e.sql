
-- SECURITY FIX: Drop overly permissive policies on site_archives
-- Service role already bypasses RLS, so these policies just open access to anon/public
DROP POLICY IF EXISTS "Service role can insert archives" ON public.site_archives;
DROP POLICY IF EXISTS "Service role can select archives" ON public.site_archives;

-- SECURITY FIX: Drop conflicting deny policy on contact_inquiries
-- The blanket deny (USING: false) on public role conflicts with admin SELECT policy
-- Admin policy alone is sufficient
DROP POLICY IF EXISTS "Deny anonymous access to contact inquiries" ON public.contact_inquiries;

-- Add explicit anon deny for contact_inquiries instead
CREATE POLICY "Deny anonymous access to contact inquiries"
  ON public.contact_inquiries
  FOR SELECT
  TO anon
  USING (false);
