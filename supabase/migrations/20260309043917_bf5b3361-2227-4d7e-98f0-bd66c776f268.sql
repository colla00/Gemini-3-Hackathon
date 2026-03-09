
-- Performance indexes for frequently queried tables
CREATE INDEX IF NOT EXISTS idx_patent_attestations_document_hash ON patent_attestations(document_hash);
CREATE INDEX IF NOT EXISTS idx_patent_attestations_attested_at ON patent_attestations(attested_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_archives_page_url ON site_archives(page_url);
CREATE INDEX IF NOT EXISTS idx_site_archives_captured_at ON site_archives(captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_fhir_events_created_at ON fhir_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fhir_events_patient_id ON fhir_events(patient_id);
CREATE INDEX IF NOT EXISTS idx_licensing_inquiries_status ON licensing_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_patents_np_deadline ON patents(np_deadline);
CREATE INDEX IF NOT EXISTS idx_patents_status ON patents(status);
CREATE INDEX IF NOT EXISTS idx_walkthrough_access_requests_status ON walkthrough_access_requests(status);
CREATE INDEX IF NOT EXISTS idx_rate_limit_violations_last_violation ON rate_limit_violations(last_violation_at DESC);

-- Add patent deadline alerts cron (runs daily at 7 AM UTC)
SELECT cron.schedule(
  'patent-deadline-alerts-daily',
  '0 7 * * *',
  $$
  SELECT net.http_post(
    url := 'https://itgnlmhypwufwrgguvav.supabase.co/functions/v1/patent-deadline-alerts',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0Z25sbWh5cHd1ZndyZ2d1dmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MzIxNTksImV4cCI6MjA4NTMwODE1OX0.Ox_dMgPZWCHUruV9wAgvetnhtndbcLNva3IkwevyPko"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- Add webhook retry cron (runs every 5 minutes for failed deliveries)
SELECT cron.schedule(
  'webhook-retry-queue',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://itgnlmhypwufwrgguvav.supabase.co/functions/v1/webhook-retry',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0Z25sbWh5cHd1ZndyZ2d1dmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MzIxNTksImV4cCI6MjA4NTMwODE1OX0.Ox_dMgPZWCHUruV9wAgvetnhtndbcLNva3IkwevyPko"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
