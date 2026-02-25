
-- Create table for site archive snapshots (trademark evidence)
CREATE TABLE public.site_archives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  page_url TEXT NOT NULL,
  page_title TEXT,
  content_hash TEXT NOT NULL,
  html_content TEXT,
  markdown_content TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  trigger_type TEXT NOT NULL DEFAULT 'manual' CHECK (trigger_type IN ('manual', 'scheduled', 'milestone')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_archives ENABLE ROW LEVEL SECURITY;

-- Only admins can view archives
CREATE POLICY "Admins can view archives"
  ON public.site_archives FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert archives
CREATE POLICY "Admins can insert archives"
  ON public.site_archives FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow edge functions (service role) to insert
CREATE POLICY "Service role can insert archives"
  ON public.site_archives FOR INSERT
  WITH CHECK (true);

-- Allow edge functions (service role) to select
CREATE POLICY "Service role can select archives"
  ON public.site_archives FOR SELECT
  USING (true);

-- Index for efficient querying
CREATE INDEX idx_site_archives_captured_at ON public.site_archives (captured_at DESC);
CREATE INDEX idx_site_archives_page_url ON public.site_archives (page_url);
CREATE INDEX idx_site_archives_content_hash ON public.site_archives (content_hash);
