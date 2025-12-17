-- Add explicit anonymous denial policies to all sensitive tables
-- This prevents any edge cases where anonymous users could access protected data

-- profiles table - contains PII (emails, names)
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- walkthrough_access_requests - contains applicant PII
CREATE POLICY "Deny anonymous access to walkthrough requests"
ON public.walkthrough_access_requests
FOR SELECT
TO anon
USING (false);

-- audit_logs - contains user activity and IP addresses
CREATE POLICY "Deny anonymous access to audit logs"
ON public.audit_logs
FOR SELECT
TO anon
USING (false);

-- rate_limit_violations - contains security incident data
CREATE POLICY "Deny anonymous access to rate limit violations"
ON public.rate_limit_violations
FOR SELECT
TO anon
USING (false);

-- user_roles - prevents role enumeration
CREATE POLICY "Deny anonymous access to user roles"
ON public.user_roles
FOR SELECT
TO anon
USING (false);

-- feedback - user feedback data
CREATE POLICY "Deny anonymous access to feedback"
ON public.feedback
FOR SELECT
TO anon
USING (false);

-- ai_chat_history - conversation privacy
CREATE POLICY "Deny anonymous access to chat history"
ON public.ai_chat_history
FOR SELECT
TO anon
USING (false);

-- viewer_analytics - user behavior tracking data
CREATE POLICY "Deny anonymous access to viewer analytics"
ON public.viewer_analytics
FOR SELECT
TO anon
USING (false);

-- polls - poll configuration
CREATE POLICY "Deny anonymous access to polls"
ON public.polls
FOR SELECT
TO anon
USING (false);

-- poll_responses - voting data
CREATE POLICY "Deny anonymous access to poll responses"
ON public.poll_responses
FOR SELECT
TO anon
USING (false);

-- audience_questions - question data
CREATE POLICY "Deny anonymous access to audience questions"
ON public.audience_questions
FOR SELECT
TO anon
USING (false);

-- handoff_reports - medical shift data
CREATE POLICY "Deny anonymous access to handoff reports"
ON public.handoff_reports
FOR SELECT
TO anon
USING (false);

-- presentation_sessions - deny anonymous access (authenticated users can still view live sessions)
CREATE POLICY "Deny anonymous access to presentation sessions"
ON public.presentation_sessions
FOR SELECT
TO anon
USING (false);

-- rate_limits - add service-level access policy for rate limiting to work
CREATE POLICY "Allow service role to manage rate limits"
ON public.rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);