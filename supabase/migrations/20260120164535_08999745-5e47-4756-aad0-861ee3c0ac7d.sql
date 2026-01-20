-- Fix overly permissive RLS policy on walkthrough_access_requests
-- The table allows public submissions but we should validate the data being inserted

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can submit access requests" ON public.walkthrough_access_requests;

-- Create a more restrictive INSERT policy that:
-- 1. Still allows anyone to submit (intentional for public contact form)
-- 2. Ensures status is always 'pending' on insert
-- 3. Ensures reviewed_at and reviewed_by are null on insert
CREATE POLICY "Public can submit access requests with validated data"
ON public.walkthrough_access_requests
FOR INSERT
TO public
WITH CHECK (
  -- Ensure new submissions always start with pending status
  status = 'pending'
  -- Ensure review fields are not set on initial submission
  AND reviewed_at IS NULL
  AND reviewed_by IS NULL
);

-- Add a comment explaining why this policy exists
COMMENT ON POLICY "Public can submit access requests with validated data" ON public.walkthrough_access_requests IS 
'Allows public submission of walkthrough requests while ensuring status is pending and review fields are empty. This is intentionally public to enable contact form submissions.';