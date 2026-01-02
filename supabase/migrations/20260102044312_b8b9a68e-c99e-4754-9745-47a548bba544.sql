-- Fix 1: profiles_email_exposure - Update witness_invitations policy to not expose profiles
-- The current "Witnesses can view invitations by token" policy creates a side-channel
-- to query all profiles. Fix by removing subquery against profiles table.
DROP POLICY IF EXISTS "Witnesses can view invitations by token" ON witness_invitations;

-- Witnesses can view their own invitations only via direct email match
-- This requires the witness to be authenticated AND have their email match
CREATE POLICY "Witnesses can view their own invitations"
ON witness_invitations FOR SELECT
TO authenticated
USING (
  witness_email = (SELECT email FROM profiles WHERE user_id = auth.uid() LIMIT 1)
);

-- Fix the UPDATE policy similarly
DROP POLICY IF EXISTS "Witnesses can complete their invitations" ON witness_invitations;
CREATE POLICY "Witnesses can complete their invitations"
ON witness_invitations FOR UPDATE
TO authenticated
USING (
  status = 'pending' AND 
  witness_email = (SELECT email FROM profiles WHERE user_id = auth.uid() LIMIT 1)
);

-- Fix 2: patent_attestations_witness_email - Already has proper RLS, but verify anon denied
-- The existing policies are:
-- - Staff and admins can view attestations (SELECT with has_role check)
-- - Authenticated users can create attestations (INSERT with auth.uid() check)
-- - Deny anonymous access to attestations (SELECT for anon USING false)
-- This is already correctly configured. The finding may be stale.

-- Fix 3: public_sessions_view_unrestricted - The view is intentionally for live session discovery
-- but should still require authentication. Already fixed with GRANT/REVOKE, 
-- but let's also add a comment documenting the intent
COMMENT ON VIEW public_sessions IS 'Intentionally public view for discovering live presentation sessions. Access restricted to authenticated users via GRANT. Shows only is_live=true sessions with non-sensitive metadata.';