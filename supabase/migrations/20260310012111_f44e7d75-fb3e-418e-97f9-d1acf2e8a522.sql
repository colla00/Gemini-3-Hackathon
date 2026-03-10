-- Fix deny-anonymous policies that incorrectly target {public} instead of {anon}

-- dataroom_access_logs
DROP POLICY "Deny anonymous access to dataroom logs" ON public.dataroom_access_logs;
CREATE POLICY "Deny anonymous access to dataroom logs" ON public.dataroom_access_logs FOR SELECT TO anon USING (false);

-- dataroom_documents
DROP POLICY "Deny anonymous access to dataroom docs" ON public.dataroom_documents;
CREATE POLICY "Deny anonymous access to dataroom docs" ON public.dataroom_documents FOR SELECT TO anon USING (false);

-- hub_tasks
DROP POLICY "Deny anonymous access to hub tasks" ON public.hub_tasks;
CREATE POLICY "Deny anonymous access to hub tasks" ON public.hub_tasks FOR SELECT TO anon USING (false);

-- licensing_inquiries
DROP POLICY "Deny anonymous read access" ON public.licensing_inquiries;
CREATE POLICY "Deny anonymous read access" ON public.licensing_inquiries FOR SELECT TO anon USING (false);

-- page_views
DROP POLICY "Deny anonymous reads on page views" ON public.page_views;
CREATE POLICY "Deny anonymous reads on page views" ON public.page_views FOR SELECT TO anon USING (false);