-- Create a secure view for session discovery that hides creator_id
CREATE VIEW public.public_sessions AS
SELECT 
  id,
  session_key,
  presenter_name,
  is_live,
  started_at,
  audience_size,
  total_slides,
  slides_completed
FROM public.presentation_sessions
WHERE is_live = true;

-- Grant access to the view for authenticated users
GRANT SELECT ON public.public_sessions TO authenticated;

-- Drop the overly permissive policy that exposes creator_id
DROP POLICY IF EXISTS "Authenticated users can view live sessions" ON public.presentation_sessions;

-- Create a more restrictive policy - only creators can see their own sessions in the main table
-- (The public_sessions view handles discovery for everyone else)
CREATE POLICY "Users can view sessions they created"
ON public.presentation_sessions
FOR SELECT
TO authenticated
USING (auth.uid() = creator_id);