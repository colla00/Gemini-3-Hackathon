
-- Protect audit logs from tampering: explicitly deny UPDATE and DELETE for everyone
CREATE POLICY "Deny update on audit logs"
ON public.audit_logs
FOR UPDATE
USING (false);

CREATE POLICY "Deny delete on audit logs"
ON public.audit_logs
FOR DELETE
USING (false);

-- Tighten patent_attestations: allow creators to view their own attestations
CREATE POLICY "Users can view own attestations"
ON public.patent_attestations
FOR SELECT
USING (auth.uid() = created_by);
