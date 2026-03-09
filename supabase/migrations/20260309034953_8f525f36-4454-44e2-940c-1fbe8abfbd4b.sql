
-- ══════════════════════════════════════════════════════
-- Gap 1 & 2: SMART on FHIR apps + Vendor API Keys
-- ══════════════════════════════════════════════════════

-- Vendor API keys table for EHR integration partners
CREATE TABLE public.vendor_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name text NOT NULL,
  vendor_id text NOT NULL UNIQUE,
  api_key_hash text NOT NULL,
  api_key_prefix text NOT NULL,
  environment text NOT NULL DEFAULT 'sandbox' CHECK (environment IN ('sandbox', 'production')),
  is_active boolean NOT NULL DEFAULT true,
  rate_limit_per_min integer NOT NULL DEFAULT 120,
  allowed_ips text[] DEFAULT '{}',
  scopes text[] DEFAULT '{read}',
  contact_email text,
  contact_name text,
  baa_signed boolean NOT NULL DEFAULT false,
  nda_signed boolean NOT NULL DEFAULT false,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  last_used_at timestamptz,
  total_requests bigint NOT NULL DEFAULT 0
);

ALTER TABLE public.vendor_api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage vendor API keys"
  ON public.vendor_api_keys FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can view vendor API keys"
  ON public.vendor_api_keys FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

-- SMART on FHIR registered apps
CREATE TABLE public.smart_apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL UNIQUE,
  client_name text NOT NULL,
  vendor_id text REFERENCES public.vendor_api_keys(vendor_id),
  redirect_uris text[] NOT NULL DEFAULT '{}',
  scopes text[] NOT NULL DEFAULT '{launch,patient/Patient.read}',
  launch_url text,
  logo_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.smart_apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage SMART apps"
  ON public.smart_apps FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can view SMART apps"
  ON public.smart_apps FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

-- ══════════════════════════════════════════════════════
-- Gap 3: Webhook retry / dead-letter queue
-- ══════════════════════════════════════════════════════

CREATE TABLE public.webhook_delivery_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fhir_event_id uuid REFERENCES public.fhir_events(id) ON DELETE CASCADE,
  target_url text NOT NULL,
  vendor_id text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'failed', 'dead_letter')),
  http_status integer,
  response_body text,
  attempt_count integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 5,
  next_retry_at timestamptz,
  last_attempt_at timestamptz,
  delivered_at timestamptz,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.webhook_delivery_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage delivery logs"
  ON public.webhook_delivery_log FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can view delivery logs"
  ON public.webhook_delivery_log FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

-- ══════════════════════════════════════════════════════
-- Gap 4: SLA monitoring metrics
-- ══════════════════════════════════════════════════════

CREATE TABLE public.sla_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id text,
  endpoint text NOT NULL,
  check_type text NOT NULL DEFAULT 'http' CHECK (check_type IN ('http', 'fhir', 'webhook')),
  status text NOT NULL DEFAULT 'up' CHECK (status IN ('up', 'down', 'degraded')),
  response_time_ms integer,
  http_status integer,
  error_message text,
  checked_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sla_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage SLA metrics"
  ON public.sla_metrics FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can view SLA metrics"
  ON public.sla_metrics FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

-- Allow service role inserts for cron jobs
CREATE POLICY "Service can insert SLA metrics"
  ON public.sla_metrics FOR INSERT
  WITH CHECK (true);

-- ══════════════════════════════════════════════════════
-- Gap 7: Patent filing receipt tracking
-- ══════════════════════════════════════════════════════

CREATE TABLE public.patent_filing_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patent_id uuid REFERENCES public.patents(id) ON DELETE CASCADE,
  filing_type text NOT NULL DEFAULT 'nonprovisional' CHECK (filing_type IN ('provisional', 'nonprovisional', 'continuation', 'divisional')),
  confirmation_number text,
  application_number text,
  filing_date date,
  receipt_date date,
  entity_type text NOT NULL DEFAULT 'micro' CHECK (entity_type IN ('micro', 'small', 'large')),
  filing_fee_paid numeric(10,2),
  search_fee_paid numeric(10,2),
  examination_fee_paid numeric(10,2),
  total_fees_paid numeric(10,2),
  claims_count integer,
  independent_claims_count integer,
  excess_claims_fee numeric(10,2) DEFAULT 0,
  receipt_document_path text,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.patent_filing_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage filing receipts"
  ON public.patent_filing_receipts FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can view filing receipts"
  ON public.patent_filing_receipts FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

-- Index for performance
CREATE INDEX idx_webhook_delivery_status ON public.webhook_delivery_log(status, next_retry_at);
CREATE INDEX idx_sla_metrics_vendor ON public.sla_metrics(vendor_id, checked_at DESC);
CREATE INDEX idx_vendor_api_keys_active ON public.vendor_api_keys(is_active, api_key_hash);
