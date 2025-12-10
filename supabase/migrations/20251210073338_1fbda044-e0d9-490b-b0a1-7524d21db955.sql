-- Create table for walkthrough access requests
CREATE TABLE public.walkthrough_access_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  role TEXT,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.walkthrough_access_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a request (public form)
CREATE POLICY "Anyone can submit access requests"
ON public.walkthrough_access_requests
FOR INSERT
TO public
WITH CHECK (true);

-- Only admins can view all requests
CREATE POLICY "Admins can view all requests"
ON public.walkthrough_access_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update requests (approve/deny)
CREATE POLICY "Admins can update requests"
ON public.walkthrough_access_requests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete requests
CREATE POLICY "Admins can delete requests"
ON public.walkthrough_access_requests
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));