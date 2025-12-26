-- Fix: Remove vulnerable email-matching RLS policy that could expose applicant PII
-- Only admins should be able to view walkthrough access requests

-- Drop the vulnerable policy that matches by email (can be exploited)
DROP POLICY IF EXISTS "Users can view their own requests by email" ON public.walkthrough_access_requests;

-- The remaining policies are secure:
-- 1. "Deny anonymous access to walkthrough requests" - blocks anon
-- 2. "Anyone can submit access requests" - allows INSERT only
-- 3. "Admins can view all requests" - admin-only SELECT
-- 4. "Admins can update requests" - admin-only UPDATE
-- 5. "Admins can delete requests" - admin-only DELETE