
-- Tighten slide_analytics RLS policies

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Session creators and demo can view analytics" ON public.slide_analytics;
DROP POLICY IF EXISTS "Session creators can update analytics" ON public.slide_analytics;
DROP POLICY IF EXISTS "Users can insert analytics for live sessions" ON public.slide_analytics;

-- New stricter SELECT: only session creators or participants of live sessions (no NULL session bypass)
CREATE POLICY "Authenticated users can view their session analytics"
ON public.slide_analytics
FOR SELECT
TO authenticated
USING (
  session_id IN (
    SELECT id FROM presentation_sessions WHERE creator_id = auth.uid()
  )
  OR session_id IN (
    SELECT id FROM presentation_sessions WHERE is_live = true
  )
);

-- New stricter INSERT: only into live sessions the user participates in (no NULL session bypass)
CREATE POLICY "Authenticated users can insert analytics for live sessions"
ON public.slide_analytics
FOR INSERT
TO authenticated
WITH CHECK (
  session_id IS NOT NULL
  AND session_id IN (
    SELECT id FROM presentation_sessions WHERE is_live = true OR creator_id = auth.uid()
  )
);

-- New stricter UPDATE: only session creators can update their own session analytics
CREATE POLICY "Session creators can update their analytics"
ON public.slide_analytics
FOR UPDATE
TO authenticated
USING (
  session_id IS NOT NULL
  AND session_id IN (
    SELECT id FROM presentation_sessions WHERE creator_id = auth.uid()
  )
);
