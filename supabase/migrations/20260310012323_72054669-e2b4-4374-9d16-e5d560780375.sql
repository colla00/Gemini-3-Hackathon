-- Block anonymous INSERT/UPDATE/DELETE on tables that should have no anon writes
-- Excluding: contact_inquiries, licensing_inquiries, walkthrough_access_requests, page_views (intentional public inserts)
-- Excluding: fhir_events (intentional webhook inserts - already has anon INSERT policy)

-- ai_chat_history
CREATE POLICY "Deny anonymous writes to chat history" ON public.ai_chat_history FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to chat history" ON public.ai_chat_history FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from chat history" ON public.ai_chat_history FOR DELETE TO anon USING (false);

-- audience_questions
CREATE POLICY "Deny anonymous writes to audience questions" ON public.audience_questions FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to audience questions" ON public.audience_questions FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from audience questions" ON public.audience_questions FOR DELETE TO anon USING (false);

-- audit_logs
CREATE POLICY "Deny anonymous writes to audit logs" ON public.audit_logs FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to audit logs" ON public.audit_logs FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from audit logs" ON public.audit_logs FOR DELETE TO anon USING (false);

-- dataroom_access_logs
CREATE POLICY "Deny anonymous writes to dataroom logs" ON public.dataroom_access_logs FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to dataroom logs" ON public.dataroom_access_logs FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from dataroom logs" ON public.dataroom_access_logs FOR DELETE TO anon USING (false);

-- dataroom_documents
CREATE POLICY "Deny anonymous writes to dataroom docs" ON public.dataroom_documents FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to dataroom docs" ON public.dataroom_documents FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from dataroom docs" ON public.dataroom_documents FOR DELETE TO anon USING (false);

-- feedback
CREATE POLICY "Deny anonymous writes to feedback" ON public.feedback FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to feedback" ON public.feedback FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from feedback" ON public.feedback FOR DELETE TO anon USING (false);

-- handoff_reports
CREATE POLICY "Deny anonymous writes to handoff reports" ON public.handoff_reports FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to handoff reports" ON public.handoff_reports FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from handoff reports" ON public.handoff_reports FOR DELETE TO anon USING (false);

-- hub_tasks
CREATE POLICY "Deny anonymous writes to hub tasks" ON public.hub_tasks FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to hub tasks" ON public.hub_tasks FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from hub tasks" ON public.hub_tasks FOR DELETE TO anon USING (false);

-- patent_attestations
CREATE POLICY "Deny anonymous writes to attestations" ON public.patent_attestations FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to attestations" ON public.patent_attestations FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from attestations" ON public.patent_attestations FOR DELETE TO anon USING (false);

-- poll_responses
CREATE POLICY "Deny anonymous writes to poll responses" ON public.poll_responses FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to poll responses" ON public.poll_responses FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from poll responses" ON public.poll_responses FOR DELETE TO anon USING (false);

-- polls
CREATE POLICY "Deny anonymous writes to polls" ON public.polls FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to polls" ON public.polls FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from polls" ON public.polls FOR DELETE TO anon USING (false);

-- presentation_sessions
CREATE POLICY "Deny anonymous writes to sessions" ON public.presentation_sessions FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to sessions" ON public.presentation_sessions FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from sessions" ON public.presentation_sessions FOR DELETE TO anon USING (false);

-- profiles
CREATE POLICY "Deny anonymous writes to profiles" ON public.profiles FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to profiles" ON public.profiles FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from profiles" ON public.profiles FOR DELETE TO anon USING (false);

-- rate_limit_violations
CREATE POLICY "Deny anonymous writes to violations" ON public.rate_limit_violations FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to violations" ON public.rate_limit_violations FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from violations" ON public.rate_limit_violations FOR DELETE TO anon USING (false);

-- user_roles
CREATE POLICY "Deny anonymous writes to user roles" ON public.user_roles FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to user roles" ON public.user_roles FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from user roles" ON public.user_roles FOR DELETE TO anon USING (false);

-- viewer_analytics
CREATE POLICY "Deny anonymous writes to viewer analytics" ON public.viewer_analytics FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to viewer analytics" ON public.viewer_analytics FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from viewer analytics" ON public.viewer_analytics FOR DELETE TO anon USING (false);

-- walkthrough_access_requests: only block UPDATE/DELETE (INSERT is intentionally public)
CREATE POLICY "Deny anonymous updates to walkthrough requests" ON public.walkthrough_access_requests FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from walkthrough requests" ON public.walkthrough_access_requests FOR DELETE TO anon USING (false);

-- contact_inquiries: only block UPDATE/DELETE (INSERT is intentionally public)
CREATE POLICY "Deny anonymous updates to contact inquiries" ON public.contact_inquiries FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from contact inquiries" ON public.contact_inquiries FOR DELETE TO anon USING (false);

-- licensing_inquiries: only block UPDATE/DELETE (INSERT is intentionally public)
CREATE POLICY "Deny anonymous updates to licensing inquiries" ON public.licensing_inquiries FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from licensing inquiries" ON public.licensing_inquiries FOR DELETE TO anon USING (false);

-- page_views: only block UPDATE/DELETE (INSERT is intentionally public)
CREATE POLICY "Deny anonymous updates to page views" ON public.page_views FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from page views" ON public.page_views FOR DELETE TO anon USING (false);