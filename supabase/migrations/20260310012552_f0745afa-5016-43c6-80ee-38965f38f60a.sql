-- Add explicit anon deny policies to tables currently relying on implicit denial
-- encryption_keys and rate_limits already covered by their ALL policies

-- attestation_groups
CREATE POLICY "Deny anonymous access to attestation groups" ON public.attestation_groups FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anonymous writes to attestation groups" ON public.attestation_groups FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to attestation groups" ON public.attestation_groups FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from attestation groups" ON public.attestation_groups FOR DELETE TO anon USING (false);

-- office_actions
CREATE POLICY "Deny anonymous access to office actions" ON public.office_actions FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anonymous writes to office actions" ON public.office_actions FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to office actions" ON public.office_actions FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from office actions" ON public.office_actions FOR DELETE TO anon USING (false);

-- patent_activities
CREATE POLICY "Deny anonymous access to patent activities" ON public.patent_activities FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anonymous writes to patent activities" ON public.patent_activities FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to patent activities" ON public.patent_activities FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from patent activities" ON public.patent_activities FOR DELETE TO anon USING (false);

-- patent_claim_screenshots
CREATE POLICY "Deny anonymous access to claim screenshots" ON public.patent_claim_screenshots FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anonymous writes to claim screenshots" ON public.patent_claim_screenshots FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to claim screenshots" ON public.patent_claim_screenshots FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from claim screenshots" ON public.patent_claim_screenshots FOR DELETE TO anon USING (false);

-- patent_figures
CREATE POLICY "Deny anonymous access to patent figures" ON public.patent_figures FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anonymous writes to patent figures" ON public.patent_figures FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to patent figures" ON public.patent_figures FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from patent figures" ON public.patent_figures FOR DELETE TO anon USING (false);

-- patent_filing_receipts
CREATE POLICY "Deny anonymous access to filing receipts" ON public.patent_filing_receipts FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anonymous writes to filing receipts" ON public.patent_filing_receipts FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to filing receipts" ON public.patent_filing_receipts FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from filing receipts" ON public.patent_filing_receipts FOR DELETE TO anon USING (false);

-- patents
CREATE POLICY "Deny anonymous access to patents" ON public.patents FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anonymous writes to patents" ON public.patents FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to patents" ON public.patents FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from patents" ON public.patents FOR DELETE TO anon USING (false);

-- site_archives
CREATE POLICY "Deny anonymous access to site archives" ON public.site_archives FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anonymous writes to site archives" ON public.site_archives FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to site archives" ON public.site_archives FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from site archives" ON public.site_archives FOR DELETE TO anon USING (false);

-- sla_metrics
CREATE POLICY "Deny anonymous access to sla metrics" ON public.sla_metrics FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anonymous writes to sla metrics" ON public.sla_metrics FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to sla metrics" ON public.sla_metrics FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from sla metrics" ON public.sla_metrics FOR DELETE TO anon USING (false);

-- slide_analytics
CREATE POLICY "Deny anonymous access to slide analytics" ON public.slide_analytics FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anonymous writes to slide analytics" ON public.slide_analytics FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to slide analytics" ON public.slide_analytics FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from slide analytics" ON public.slide_analytics FOR DELETE TO anon USING (false);

-- smart_apps
CREATE POLICY "Deny anonymous access to smart apps" ON public.smart_apps FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anonymous writes to smart apps" ON public.smart_apps FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to smart apps" ON public.smart_apps FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from smart apps" ON public.smart_apps FOR DELETE TO anon USING (false);

-- vendor_api_keys
CREATE POLICY "Deny anonymous access to vendor keys" ON public.vendor_api_keys FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anonymous writes to vendor keys" ON public.vendor_api_keys FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to vendor keys" ON public.vendor_api_keys FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from vendor keys" ON public.vendor_api_keys FOR DELETE TO anon USING (false);

-- webhook_delivery_log
CREATE POLICY "Deny anonymous access to webhook logs" ON public.webhook_delivery_log FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anonymous writes to webhook logs" ON public.webhook_delivery_log FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to webhook logs" ON public.webhook_delivery_log FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from webhook logs" ON public.webhook_delivery_log FOR DELETE TO anon USING (false);

-- witness_invitations
CREATE POLICY "Deny anonymous access to invitations" ON public.witness_invitations FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anonymous writes to invitations" ON public.witness_invitations FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anonymous updates to invitations" ON public.witness_invitations FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from invitations" ON public.witness_invitations FOR DELETE TO anon USING (false);

-- fhir_events: add missing anon deny for SELECT/UPDATE/DELETE (INSERT is intentionally open)
CREATE POLICY "Deny anonymous reads on fhir events" ON public.fhir_events FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anonymous updates to fhir events" ON public.fhir_events FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anonymous deletes from fhir events" ON public.fhir_events FOR DELETE TO anon USING (false);