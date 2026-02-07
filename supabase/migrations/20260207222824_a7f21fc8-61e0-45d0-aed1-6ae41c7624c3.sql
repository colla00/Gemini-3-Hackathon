
-- Create contact_inquiries table
CREATE TABLE public.contact_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inquiry_type TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  role TEXT,
  timeline TEXT,
  irb_status TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (contact form is public-facing, no auth required)
-- But restrict fields via edge function validation
CREATE POLICY "Anyone can submit contact inquiries"
  ON public.contact_inquiries
  FOR INSERT
  WITH CHECK (status = 'new');

-- Only admins can view inquiries
CREATE POLICY "Admins can view contact inquiries"
  ON public.contact_inquiries
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update inquiries (e.g., mark as reviewed)
CREATE POLICY "Admins can update contact inquiries"
  ON public.contact_inquiries
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));
