
-- Weekly automated drafts table for investor updates, competitor briefs, social posts
CREATE TABLE public.weekly_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  draft_type TEXT NOT NULL, -- 'investor_update', 'competitor_brief', 'social_posts', 'regulatory_digest'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'reviewed', 'sent'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID
);

ALTER TABLE public.weekly_drafts ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write
CREATE POLICY "Admins can manage weekly drafts"
  ON public.weekly_drafts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Deny anonymous access
CREATE POLICY "Deny anonymous access to weekly drafts"
  ON public.weekly_drafts FOR SELECT TO anon
  USING (false);

CREATE POLICY "Deny anonymous writes to weekly drafts"
  ON public.weekly_drafts FOR INSERT TO anon
  WITH CHECK (false);

CREATE POLICY "Deny anonymous updates to weekly drafts"
  ON public.weekly_drafts FOR UPDATE TO anon
  USING (false);

CREATE POLICY "Deny anonymous deletes from weekly drafts"
  ON public.weekly_drafts FOR DELETE TO anon
  USING (false);
