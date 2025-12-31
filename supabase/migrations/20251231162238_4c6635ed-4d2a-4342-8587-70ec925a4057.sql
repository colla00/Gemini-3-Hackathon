-- Create patent_attestations table for immutable witness signatures
CREATE TABLE public.patent_attestations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_hash TEXT NOT NULL,
  document_version TEXT NOT NULL,
  witness_name TEXT NOT NULL,
  witness_title TEXT NOT NULL,
  organization TEXT,
  signature TEXT NOT NULL,
  attested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  claims_count INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.patent_attestations ENABLE ROW LEVEL SECURITY;

-- Attestations are immutable - no updates or deletes allowed
-- Only admins and staff can view attestations
CREATE POLICY "Staff and admins can view attestations"
ON public.patent_attestations
FOR SELECT
USING (has_role(auth.uid(), 'staff'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can create attestations
CREATE POLICY "Authenticated users can create attestations"
ON public.patent_attestations
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Create index for faster lookups by document hash
CREATE INDEX idx_patent_attestations_document_hash ON public.patent_attestations(document_hash);

-- Add comment for documentation
COMMENT ON TABLE public.patent_attestations IS 'Immutable record of witness attestations for patent evidence documentation';