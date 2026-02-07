
-- Allow authenticated users to view their own walkthrough access requests by email
CREATE POLICY "Users can view their own access requests"
ON public.walkthrough_access_requests
FOR SELECT
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);
