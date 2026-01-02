-- Fix the security definer view issue by using SECURITY INVOKER
DROP VIEW IF EXISTS public_sessions;

-- Recreate with SECURITY INVOKER (uses permissions of the querying user)
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

-- Grant access only to authenticated users
REVOKE ALL ON public_sessions FROM anon;
GRANT SELECT ON public_sessions TO authenticated;