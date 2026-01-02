-- Fix 1: Presenter role check - Require admin role to create presentation sessions
DROP POLICY IF EXISTS "Authenticated users can create sessions" ON presentation_sessions;
CREATE POLICY "Admins can create sessions"
ON presentation_sessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator_id AND creator_id IS NOT NULL AND has_role(auth.uid(), 'admin'));

-- Fix 2: public_sessions view - Add security barrier and restrict access
-- First drop the existing view if it exists
DROP VIEW IF EXISTS public_sessions;

-- Recreate as a security barrier view with limited exposure
CREATE VIEW public_sessions WITH (security_barrier = true) AS
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

-- Fix 3: Attestation groups null creator bypass - Remove the NULL check loophole
DROP POLICY IF EXISTS "Authenticated users can update own attestation groups" ON attestation_groups;
CREATE POLICY "Authenticated users can update own attestation groups"
ON attestation_groups FOR UPDATE
TO authenticated
USING (auth.uid() = created_by);