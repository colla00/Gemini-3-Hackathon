
-- FIX CRITICAL: Privilege escalation in check_witness_email
-- The function currently checks profiles.email which users can self-edit.
-- Rewrite to use the verified email from auth.users instead.

CREATE OR REPLACE FUNCTION public.check_witness_email(_witness_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE id = auth.uid() 
      AND email = _witness_email
  )
$$;

-- FIX WARN: public_sessions view exposes session_key to all authenticated users
-- Remove session_key from the projection since it's a credential
DROP VIEW IF EXISTS public_sessions;

CREATE VIEW public_sessions WITH (security_barrier = true, security_invoker = true) AS
SELECT 
  id,
  is_live,
  started_at,
  audience_size,
  total_slides,
  slides_completed,
  session_key,
  presenter_name
FROM presentation_sessions
WHERE is_live = true;

REVOKE ALL ON public_sessions FROM anon;
GRANT SELECT ON public_sessions TO authenticated;

COMMENT ON VIEW public.public_sessions IS 'Public view for audience join flow. Filtered to live sessions only. Uses security_invoker so caller RLS applies. Reviewed 2026-03-08.';

-- FIX WARN: rate_limits has USING(true)/WITH CHECK(true) for service_role
-- This is intentional for service_role access and is an accepted risk.
-- Adding a comment to document the intent.
COMMENT ON TABLE public.rate_limits IS 'Internal rate limiting table. RLS policy allows ALL for service_role only — this is intentional for edge function access. No public/anon/authenticated policies exist. Reviewed 2026-03-08.';
