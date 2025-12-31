-- Create storage bucket for patent evidence screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('patent-screenshots', 'patent-screenshots', true);

-- Create RLS policies for the bucket
CREATE POLICY "Staff and admins can view patent screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'patent-screenshots' AND (
  has_role(auth.uid(), 'staff'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
));

CREATE POLICY "Authenticated users can upload patent screenshots"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'patent-screenshots' AND auth.uid() IS NOT NULL);

CREATE POLICY "Uploaders can delete their own screenshots"
ON storage.objects FOR DELETE
USING (bucket_id = 'patent-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create table to track patent claim screenshots
CREATE TABLE public.patent_claim_screenshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_number INTEGER NOT NULL,
  document_hash TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  caption TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.patent_claim_screenshots ENABLE ROW LEVEL SECURITY;

-- RLS policies for screenshot metadata
CREATE POLICY "Staff and admins can view screenshot metadata"
ON public.patent_claim_screenshots FOR SELECT
USING (has_role(auth.uid(), 'staff'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can add screenshots"
ON public.patent_claim_screenshots FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Uploaders can delete their screenshots"
ON public.patent_claim_screenshots FOR DELETE
USING (auth.uid() = uploaded_by);

-- Create indexes
CREATE INDEX idx_patent_screenshots_claim ON public.patent_claim_screenshots(claim_number);
CREATE INDEX idx_patent_screenshots_document ON public.patent_claim_screenshots(document_hash);