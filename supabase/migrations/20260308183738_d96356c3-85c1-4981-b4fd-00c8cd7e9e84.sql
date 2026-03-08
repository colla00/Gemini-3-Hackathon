
CREATE TABLE public.patents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  patent_number TEXT NOT NULL,
  nickname TEXT NOT NULL,
  description TEXT,
  filing_date DATE,
  np_deadline DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  priority_level TEXT NOT NULL DEFAULT 'STANDARD',
  attorney_assigned BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  bundle_group TEXT
);

ALTER TABLE public.patents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view patents"
  ON public.patents FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage patents"
  ON public.patents FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
