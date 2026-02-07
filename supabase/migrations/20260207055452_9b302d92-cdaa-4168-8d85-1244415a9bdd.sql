-- Fix the RLS policy that references auth.users directly (causing 403)
-- Replace it with a policy that uses the user's JWT email claim instead

DROP POLICY IF EXISTS "Users can view their own access requests" ON public.walkthrough_access_requests;

CREATE POLICY "Users can view their own access requests"
ON public.walkthrough_access_requests
FOR SELECT
TO authenticated
USING (email = (auth.jwt() ->> 'email')::text);