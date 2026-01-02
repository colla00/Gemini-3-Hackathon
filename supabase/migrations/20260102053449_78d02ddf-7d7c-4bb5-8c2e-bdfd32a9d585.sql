-- Fix witness_invitations RLS policies
-- Replace vulnerable subquery pattern with SECURITY DEFINER function

-- Create a secure function to check if user's email matches a witness email
CREATE OR REPLACE FUNCTION public.check_witness_email(_witness_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE user_id = auth.uid() 
      AND email = _witness_email
  )
$$;

-- Drop the vulnerable policies that use subqueries
DROP POLICY IF EXISTS "Witnesses can view their own invitations" ON public.witness_invitations;
DROP POLICY IF EXISTS "Witnesses can complete their invitations" ON public.witness_invitations;
DROP POLICY IF EXISTS "Deny anonymous access to witness invitations" ON public.witness_invitations;

-- Recreate policies using the secure function
-- Witnesses can view invitations sent to their email
CREATE POLICY "Witnesses can view their own invitations"
ON public.witness_invitations
FOR SELECT
TO authenticated
USING (check_witness_email(witness_email));

-- Witnesses can complete pending invitations sent to them
CREATE POLICY "Witnesses can complete their invitations"
ON public.witness_invitations
FOR UPDATE
TO authenticated
USING (
  status = 'pending' 
  AND check_witness_email(witness_email)
);

-- Add RESTRICTIVE policy requiring authentication for all operations
CREATE POLICY "Require authentication for witness invitations"
ON public.witness_invitations
AS RESTRICTIVE
FOR ALL
TO public
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);