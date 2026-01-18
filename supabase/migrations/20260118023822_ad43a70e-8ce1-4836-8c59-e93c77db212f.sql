-- Fix 1: profiles table - Remove overly permissive authentication policy
-- The "Require authentication for profiles" policy allows ANY authenticated user to read ALL profiles
-- This exposes user email addresses and names to all authenticated users

DROP POLICY IF EXISTS "Require authentication for profiles" ON public.profiles;

-- The existing policies are sufficient:
-- - "Users can view their own profile" allows users to see their own data
-- - "Admins can view all profiles" allows admins to see all profiles
-- - "Users can insert their own profile" allows users to create their profile
-- - "Users can update their own profile" allows users to update their profile

-- Fix 2: witness_invitations table - Remove overly broad authentication policy
-- The "Require authentication for witness invitations" policy allows ANY authenticated user 
-- to read ALL witness invitations, exposing witness emails and invitation tokens

DROP POLICY IF EXISTS "Require authentication for witness invitations" ON public.witness_invitations;

-- The existing specific policies are sufficient:
-- - "Creators can view their invitations" (using invited_by = auth.uid()::text)
-- - "Witnesses can view their own invitations" (using check_witness_email)
-- - "Authenticated users can create invitations" (with proper check)
-- - "Creators can update/delete their invitations"
-- - "Witnesses can complete their invitations"