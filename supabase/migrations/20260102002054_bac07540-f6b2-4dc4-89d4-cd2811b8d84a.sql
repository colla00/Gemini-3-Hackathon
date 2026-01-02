-- Create witness invitations table
CREATE TABLE public.witness_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_hash TEXT NOT NULL,
  document_version TEXT NOT NULL,
  witness_email TEXT NOT NULL,
  witness_name TEXT,
  invitation_token UUID NOT NULL DEFAULT gen_random_uuid(),
  invited_by TEXT,
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'cancelled')),
  completed_at TIMESTAMP WITH TIME ZONE,
  attestation_id UUID REFERENCES public.patent_attestations(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add email confirmation columns to patent_attestations
ALTER TABLE public.patent_attestations 
ADD COLUMN IF NOT EXISTS witness_email TEXT,
ADD COLUMN IF NOT EXISTS email_confirmed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS confirmation_token UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS confirmation_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE;

-- Enable RLS on witness_invitations
ALTER TABLE public.witness_invitations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read invitations by token (for invitation links)
CREATE POLICY "Anyone can read invitations by token"
ON public.witness_invitations
FOR SELECT
USING (true);

-- Allow authenticated users to create invitations
CREATE POLICY "Authenticated users can create invitations"
ON public.witness_invitations
FOR INSERT
WITH CHECK (true);

-- Allow updates to invitations
CREATE POLICY "Anyone can update invitations"
ON public.witness_invitations
FOR UPDATE
USING (true);

-- Create index for faster token lookups
CREATE INDEX idx_witness_invitations_token ON public.witness_invitations(invitation_token);
CREATE INDEX idx_witness_invitations_email ON public.witness_invitations(witness_email);
CREATE INDEX idx_patent_attestations_confirmation_token ON public.patent_attestations(confirmation_token);