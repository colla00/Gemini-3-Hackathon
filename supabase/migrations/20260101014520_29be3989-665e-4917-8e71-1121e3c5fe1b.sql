-- Create table for multi-witness attestation support
-- This tracks which witnesses are required for a complete attestation

-- Create attestation groups table (groups multiple witnesses for a single document attestation)
CREATE TABLE public.attestation_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_hash TEXT NOT NULL,
  document_version TEXT NOT NULL,
  required_witnesses INTEGER NOT NULL DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'complete')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id)
);

-- Add attestation_group_id to patent_attestations
ALTER TABLE public.patent_attestations 
ADD COLUMN attestation_group_id UUID REFERENCES public.attestation_groups(id);

-- Create patent_activities table for timeline tracking
CREATE TABLE public.patent_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_hash TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on new tables
ALTER TABLE public.attestation_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patent_activities ENABLE ROW LEVEL SECURITY;

-- RLS policies for attestation_groups
CREATE POLICY "Authenticated users can view attestation groups" 
ON public.attestation_groups FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create attestation groups" 
ON public.attestation_groups FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update own attestation groups" 
ON public.attestation_groups FOR UPDATE 
USING (auth.uid() = created_by OR created_by IS NULL);

-- RLS policies for patent_activities
CREATE POLICY "Authenticated users can view activities" 
ON public.patent_activities FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create activities" 
ON public.patent_activities FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Create index for faster activity queries
CREATE INDEX idx_patent_activities_document_hash ON public.patent_activities(document_hash);
CREATE INDEX idx_patent_activities_created_at ON public.patent_activities(created_at DESC);
CREATE INDEX idx_attestation_groups_document_hash ON public.attestation_groups(document_hash);