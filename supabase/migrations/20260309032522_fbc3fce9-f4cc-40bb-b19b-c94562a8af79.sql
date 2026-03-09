
-- FHIR webhook events table
CREATE TABLE public.fhir_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL DEFAULT 'unknown',
  resource_type text NOT NULL,
  resource_id text,
  vendor text,
  patient_id text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  signature_valid boolean DEFAULT false,
  source_ip text,
  processed_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for querying by resource type and vendor
CREATE INDEX idx_fhir_events_resource_type ON public.fhir_events (resource_type);
CREATE INDEX idx_fhir_events_vendor ON public.fhir_events (vendor);
CREATE INDEX idx_fhir_events_created_at ON public.fhir_events (created_at DESC);

-- Enable RLS
ALTER TABLE public.fhir_events ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read events
CREATE POLICY "Authenticated users can read fhir_events"
  ON public.fhir_events FOR SELECT TO authenticated
  USING (true);

-- Only admins can delete events
CREATE POLICY "Admins can delete fhir_events"
  ON public.fhir_events FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Service role inserts (from edge function) - allow inserts for anon (webhook)
CREATE POLICY "Allow webhook inserts to fhir_events"
  ON public.fhir_events FOR INSERT TO anon
  WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.fhir_events;
