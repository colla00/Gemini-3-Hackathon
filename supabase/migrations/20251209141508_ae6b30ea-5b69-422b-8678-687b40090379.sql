-- Add creator_id to presentation_sessions to track ownership
ALTER TABLE public.presentation_sessions 
ADD COLUMN IF NOT EXISTS creator_id uuid REFERENCES auth.users(id);

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can access sessions" ON public.presentation_sessions;
DROP POLICY IF EXISTS "Authenticated users can access chat history" ON public.ai_chat_history;
DROP POLICY IF EXISTS "Authenticated users can access questions" ON public.audience_questions;
DROP POLICY IF EXISTS "Authenticated users can access feedback" ON public.feedback;
DROP POLICY IF EXISTS "Authenticated users can access polls" ON public.polls;
DROP POLICY IF EXISTS "Authenticated users can access poll_responses" ON public.poll_responses;
DROP POLICY IF EXISTS "Authenticated users can access analytics" ON public.viewer_analytics;

-- presentation_sessions: Creators can manage their sessions, anyone authenticated can view live sessions
CREATE POLICY "Creators can manage their sessions"
ON public.presentation_sessions FOR ALL
USING (auth.uid() = creator_id)
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Authenticated users can view live sessions"
ON public.presentation_sessions FOR SELECT
USING (is_live = true);

CREATE POLICY "Authenticated users can create sessions"
ON public.presentation_sessions FOR INSERT
WITH CHECK (auth.uid() = creator_id OR creator_id IS NULL);

-- ai_chat_history: Access scoped to session ownership
CREATE POLICY "Session creators can access chat history"
ON public.ai_chat_history FOR ALL
USING (
  session_id IN (SELECT id FROM public.presentation_sessions WHERE creator_id = auth.uid())
)
WITH CHECK (
  session_id IN (SELECT id FROM public.presentation_sessions WHERE creator_id = auth.uid())
);

CREATE POLICY "Users can insert chat for sessions they participate in"
ON public.ai_chat_history FOR INSERT
WITH CHECK (
  session_id IN (SELECT id FROM public.presentation_sessions WHERE is_live = true)
);

CREATE POLICY "Users can view chat for live sessions"
ON public.ai_chat_history FOR SELECT
USING (
  session_id IN (SELECT id FROM public.presentation_sessions WHERE is_live = true)
);

-- audience_questions: Participants can ask/view questions in live sessions
CREATE POLICY "Session creators can manage all questions"
ON public.audience_questions FOR ALL
USING (
  session_id IN (SELECT id FROM public.presentation_sessions WHERE creator_id = auth.uid())
)
WITH CHECK (
  session_id IN (SELECT id FROM public.presentation_sessions WHERE creator_id = auth.uid())
);

CREATE POLICY "Users can view questions in live sessions"
ON public.audience_questions FOR SELECT
USING (
  session_id IN (SELECT id FROM public.presentation_sessions WHERE is_live = true)
);

CREATE POLICY "Users can ask questions in live sessions"
ON public.audience_questions FOR INSERT
WITH CHECK (
  session_id IN (SELECT id FROM public.presentation_sessions WHERE is_live = true)
);

CREATE POLICY "Users can upvote questions in live sessions"
ON public.audience_questions FOR UPDATE
USING (
  session_id IN (SELECT id FROM public.presentation_sessions WHERE is_live = true)
);

-- feedback: Scoped to session ownership/participation
CREATE POLICY "Session creators can view all feedback"
ON public.feedback FOR SELECT
USING (
  session_id IN (SELECT id FROM public.presentation_sessions WHERE creator_id = auth.uid())
);

CREATE POLICY "Users can submit feedback to live sessions"
ON public.feedback FOR INSERT
WITH CHECK (
  session_id IN (SELECT id FROM public.presentation_sessions WHERE is_live = true)
);

-- polls: Session creators manage polls, participants can view active polls
CREATE POLICY "Session creators can manage polls"
ON public.polls FOR ALL
USING (
  session_id IN (SELECT id FROM public.presentation_sessions WHERE creator_id = auth.uid())
)
WITH CHECK (
  session_id IN (SELECT id FROM public.presentation_sessions WHERE creator_id = auth.uid())
);

CREATE POLICY "Users can view active polls in live sessions"
ON public.polls FOR SELECT
USING (
  is_active = true AND 
  session_id IN (SELECT id FROM public.presentation_sessions WHERE is_live = true)
);

-- poll_responses: Users can respond to active polls
CREATE POLICY "Session creators can view all responses"
ON public.poll_responses FOR SELECT
USING (
  poll_id IN (
    SELECT p.id FROM public.polls p 
    JOIN public.presentation_sessions ps ON p.session_id = ps.id 
    WHERE ps.creator_id = auth.uid()
  )
);

CREATE POLICY "Users can submit responses to active polls"
ON public.poll_responses FOR INSERT
WITH CHECK (
  poll_id IN (
    SELECT p.id FROM public.polls p 
    JOIN public.presentation_sessions ps ON p.session_id = ps.id 
    WHERE p.is_active = true AND ps.is_live = true
  )
);

-- viewer_analytics: Session creators can view analytics
CREATE POLICY "Session creators can view analytics"
ON public.viewer_analytics FOR SELECT
USING (
  session_id IN (SELECT id FROM public.presentation_sessions WHERE creator_id = auth.uid())
);

CREATE POLICY "Users can submit analytics for live sessions"
ON public.viewer_analytics FOR INSERT
WITH CHECK (
  session_id IN (SELECT id FROM public.presentation_sessions WHERE is_live = true)
);