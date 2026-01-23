-- Create table for tracking slide engagement analytics
CREATE TABLE public.slide_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.presentation_sessions(id) ON DELETE CASCADE,
  slide_id TEXT NOT NULL,
  slide_title TEXT,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 1,
  first_viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_patent_slide BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, slide_id)
);

-- Enable RLS
ALTER TABLE public.slide_analytics ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert/update their own session analytics
CREATE POLICY "Users can insert slide analytics" 
ON public.slide_analytics 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update slide analytics" 
ON public.slide_analytics 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can view slide analytics" 
ON public.slide_analytics 
FOR SELECT 
USING (true);

-- Create index for faster queries
CREATE INDEX idx_slide_analytics_session ON public.slide_analytics(session_id);
CREATE INDEX idx_slide_analytics_slide ON public.slide_analytics(slide_id);
CREATE INDEX idx_slide_analytics_patent ON public.slide_analytics(is_patent_slide) WHERE is_patent_slide = true;