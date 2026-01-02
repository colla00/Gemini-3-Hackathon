-- Add DELETE policy for witness_invitations - only creators can delete their invitations
CREATE POLICY "Creators can delete their invitations"
ON witness_invitations FOR DELETE
TO authenticated
USING (invited_by = auth.uid()::text);