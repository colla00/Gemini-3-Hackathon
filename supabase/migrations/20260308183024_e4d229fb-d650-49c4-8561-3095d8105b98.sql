
CREATE TABLE public.licensing_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  organization_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization_type TEXT NOT NULL,
  systems_of_interest TEXT[] NOT NULL DEFAULT '{}',
  message TEXT,
  nda_agreed BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'new',
  stripe_session_id TEXT,
  payment_status TEXT
);

ALTER TABLE public.licensing_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit licensing inquiries"
  ON public.licensing_inquiries
  FOR INSERT
  WITH CHECK (status = 'new');

CREATE POLICY "Deny anonymous read access"
  ON public.licensing_inquiries
  FOR SELECT
  USING (false);

CREATE POLICY "Admins can view all licensing inquiries"
  ON public.licensing_inquiries
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update licensing inquiries"
  ON public.licensing_inquiries
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));
