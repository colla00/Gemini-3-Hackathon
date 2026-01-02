-- Fix 1: witness_invitations - Replace overly permissive policies with secure ones
DROP POLICY IF EXISTS "Anyone can read invitations by token" ON witness_invitations;
DROP POLICY IF EXISTS "Authenticated users can create invitations" ON witness_invitations;
DROP POLICY IF EXISTS "Anyone can update invitations" ON witness_invitations;

-- Deny anonymous access
CREATE POLICY "Deny anonymous access to witness invitations"
ON witness_invitations FOR SELECT
TO anon
USING (false);

-- Authenticated users can view invitations they created
CREATE POLICY "Creators can view their invitations"
ON witness_invitations FOR SELECT
TO authenticated
USING (invited_by = auth.uid()::text);

-- Witnesses can view their own invitations by token (for completing attestation)
CREATE POLICY "Witnesses can view invitations by token"
ON witness_invitations FOR SELECT
TO authenticated
USING (witness_email IN (
  SELECT email FROM profiles WHERE user_id = auth.uid()
));

-- Only authenticated users can create invitations and must set themselves as inviter
CREATE POLICY "Authenticated users can create invitations"
ON witness_invitations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND invited_by = auth.uid()::text);

-- Fix 2: witness_invitations UPDATE - Only allow creators or witnesses to update
CREATE POLICY "Creators can update their invitations"
ON witness_invitations FOR UPDATE
TO authenticated
USING (invited_by = auth.uid()::text);

CREATE POLICY "Witnesses can complete their invitations"
ON witness_invitations FOR UPDATE
TO authenticated
USING (witness_email IN (
  SELECT email FROM profiles WHERE user_id = auth.uid()
) AND status = 'pending');

-- Fix 3: patent_attestations - Add deny anonymous access policy
CREATE POLICY "Deny anonymous access to attestations"
ON patent_attestations FOR SELECT
TO anon
USING (false);