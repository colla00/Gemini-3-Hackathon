-- Pilot engagements table for client portal
CREATE TABLE public.pilot_engagements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  facility_type TEXT DEFAULT 'community',
  bed_count INTEGER DEFAULT 0,
  icu_beds INTEGER DEFAULT 0,
  ehr_system TEXT,
  pilot_start_date DATE,
  pilot_end_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  unit_deployed TEXT DEFAULT 'ICU',
  metrics JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pilot_engagements ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins can manage pilot engagements"
ON public.pilot_engagements FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Staff can view
CREATE POLICY "Staff can view pilot engagements"
ON public.pilot_engagements FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

-- Deny anonymous
CREATE POLICY "Deny anon select on pilot engagements"
ON public.pilot_engagements FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anon insert on pilot engagements"
ON public.pilot_engagements FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anon update on pilot engagements"
ON public.pilot_engagements FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anon delete on pilot engagements"
ON public.pilot_engagements FOR DELETE TO anon USING (false);

-- FDA pre-submission documents table
CREATE TABLE public.fda_presub_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_type TEXT NOT NULL DEFAULT 'q_sub',
  title TEXT NOT NULL,
  sections JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  version TEXT DEFAULT '1.0',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.fda_presub_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage FDA docs"
ON public.fda_presub_documents FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can view FDA docs"
ON public.fda_presub_documents FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Deny anon select on fda docs"
ON public.fda_presub_documents FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anon insert on fda docs"
ON public.fda_presub_documents FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anon update on fda docs"
ON public.fda_presub_documents FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anon delete on fda docs"
ON public.fda_presub_documents FOR DELETE TO anon USING (false);