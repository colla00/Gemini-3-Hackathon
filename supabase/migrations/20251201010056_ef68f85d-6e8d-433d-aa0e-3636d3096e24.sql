-- Create enum for feedback types
CREATE TYPE public.feedback_type AS ENUM ('positive', 'neutral', 'negative', 'question', 'suggestion');

-- Create enum for poll types
CREATE TYPE public.poll_type AS ENUM ('single_choice', 'multiple_choice', 'rating', 'yes_no');

-- Presentation Sessions - tracks each presentation run
CREATE TABLE public.presentation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  presenter_name TEXT,
  audience_size INTEGER DEFAULT 0,
  total_slides INTEGER DEFAULT 11,
  slides_completed INTEGER DEFAULT 0,
  is_live BOOLEAN DEFAULT true,
  session_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Viewer Analytics - tracks individual viewer interactions
CREATE TABLE public.viewer_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.presentation_sessions(id) ON DELETE CASCADE,
  viewer_id TEXT NOT NULL DEFAULT encode(gen_random_bytes(8), 'hex'),
  slide_id TEXT NOT NULL,
  time_on_slide INTEGER DEFAULT 0,
  interactions JSONB DEFAULT '[]'::jsonb,
  device_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Feedback Collection
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.presentation_sessions(id) ON DELETE CASCADE,
  slide_id TEXT,
  feedback_type feedback_type NOT NULL DEFAULT 'neutral',
  message TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  submitted_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Audience Questions (Q&A)
CREATE TABLE public.audience_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.presentation_sessions(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  asked_by TEXT DEFAULT 'Anonymous',
  is_answered BOOLEAN DEFAULT false,
  answer TEXT,
  upvotes INTEGER DEFAULT 0,
  slide_context TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Live Polls
CREATE TABLE public.polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.presentation_sessions(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  poll_type poll_type NOT NULL DEFAULT 'single_choice',
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Poll Responses
CREATE TABLE public.poll_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE,
  voter_id TEXT NOT NULL DEFAULT encode(gen_random_bytes(8), 'hex'),
  selected_options JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(poll_id, voter_id)
);

-- Handoff Reports
CREATE TABLE public.handoff_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  shift_type TEXT NOT NULL,
  unit_name TEXT DEFAULT 'Unit 4C - Med/Surg',
  high_risk_count INTEGER DEFAULT 0,
  medium_risk_count INTEGER DEFAULT 0,
  report_data JSONB NOT NULL,
  generated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Chat History for Q&A
CREATE TABLE public.ai_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.presentation_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.presentation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viewer_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audience_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handoff_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;

-- Public read/write policies (research prototype - no auth required)
CREATE POLICY "Allow public read on sessions" ON public.presentation_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on sessions" ON public.presentation_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on sessions" ON public.presentation_sessions FOR UPDATE USING (true);

CREATE POLICY "Allow public access on analytics" ON public.viewer_analytics FOR ALL USING (true);
CREATE POLICY "Allow public access on feedback" ON public.feedback FOR ALL USING (true);
CREATE POLICY "Allow public access on questions" ON public.audience_questions FOR ALL USING (true);
CREATE POLICY "Allow public access on polls" ON public.polls FOR ALL USING (true);
CREATE POLICY "Allow public access on poll_responses" ON public.poll_responses FOR ALL USING (true);
CREATE POLICY "Allow public access on handoff_reports" ON public.handoff_reports FOR ALL USING (true);
CREATE POLICY "Allow public access on ai_chat" ON public.ai_chat_history FOR ALL USING (true);

-- Enable realtime for interactive features
ALTER PUBLICATION supabase_realtime ADD TABLE public.audience_questions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.polls;
ALTER PUBLICATION supabase_realtime ADD TABLE public.poll_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback;