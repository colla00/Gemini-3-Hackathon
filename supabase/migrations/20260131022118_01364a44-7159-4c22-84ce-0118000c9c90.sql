-- Drop existing permissive policies on slide_analytics
DROP POLICY IF EXISTS "Users can insert slide analytics" ON public.slide_analytics;
DROP POLICY IF EXISTS "Users can update slide analytics" ON public.slide_analytics;
DROP POLICY IF EXISTS "Users can view slide analytics" ON public.slide_analytics;

-- Create more restrictive policies for slide_analytics
-- Allow authenticated users to insert analytics for sessions they participate in or their own sessions
CREATE POLICY "Users can insert analytics for live sessions"
ON public.slide_analytics
FOR INSERT
WITH CHECK (
  session_id IS NULL 
  OR session_id IN (
    SELECT id FROM presentation_sessions WHERE is_live = true
  )
  OR session_id IN (
    SELECT id FROM presentation_sessions WHERE creator_id = auth.uid()
  )
);

-- Allow users to update analytics for sessions they created
CREATE POLICY "Session creators can update analytics"
ON public.slide_analytics
FOR UPDATE
USING (
  session_id IS NULL 
  OR session_id IN (
    SELECT id FROM presentation_sessions WHERE creator_id = auth.uid()
  )
);

-- Allow session creators to view their analytics, and public view for demo purposes
CREATE POLICY "Session creators and demo can view analytics"
ON public.slide_analytics
FOR SELECT
USING (
  session_id IS NULL 
  OR session_id IN (
    SELECT id FROM presentation_sessions WHERE creator_id = auth.uid()
  )
  OR session_id IN (
    SELECT id FROM presentation_sessions WHERE is_live = true
  )
);