-- Add policy to allow users to view their own walkthrough requests by email
-- This ensures requesters can check their submission status without exposing other requests

CREATE POLICY "Users can view their own requests by email"
ON public.walkthrough_access_requests
FOR SELECT
USING (
  auth.jwt() ->> 'email' = email
);

-- Add policy to profiles to allow users to insert their own profile
-- This is needed for the profile creation flow when users sign up
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);