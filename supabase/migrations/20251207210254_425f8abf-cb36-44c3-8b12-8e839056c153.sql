-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'viewer');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'staff',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on new tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'staff');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Drop old permissive policies and create new authenticated ones

-- handoff_reports: Only authenticated staff can access
DROP POLICY IF EXISTS "Allow public access on handoff_reports" ON public.handoff_reports;
CREATE POLICY "Authenticated users can read handoff_reports"
  ON public.handoff_reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert handoff_reports"
  ON public.handoff_reports FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ai_chat_history: Only authenticated users
DROP POLICY IF EXISTS "Allow public access on ai_chat" ON public.ai_chat_history;
CREATE POLICY "Authenticated users can access chat history"
  ON public.ai_chat_history FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- feedback: Only authenticated users
DROP POLICY IF EXISTS "Allow public access on feedback" ON public.feedback;
CREATE POLICY "Authenticated users can access feedback"
  ON public.feedback FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- audience_questions: Only authenticated users
DROP POLICY IF EXISTS "Allow public access on questions" ON public.audience_questions;
CREATE POLICY "Authenticated users can access questions"
  ON public.audience_questions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- viewer_analytics: Only authenticated users
DROP POLICY IF EXISTS "Allow public access on analytics" ON public.viewer_analytics;
CREATE POLICY "Authenticated users can access analytics"
  ON public.viewer_analytics FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- poll_responses: Only authenticated users
DROP POLICY IF EXISTS "Allow public access on poll_responses" ON public.poll_responses;
CREATE POLICY "Authenticated users can access poll_responses"
  ON public.poll_responses FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- polls: Only authenticated users
DROP POLICY IF EXISTS "Allow public access on polls" ON public.polls;
CREATE POLICY "Authenticated users can access polls"
  ON public.polls FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- presentation_sessions: Only authenticated users
DROP POLICY IF EXISTS "Allow public insert on sessions" ON public.presentation_sessions;
DROP POLICY IF EXISTS "Allow public read on sessions" ON public.presentation_sessions;
DROP POLICY IF EXISTS "Allow public update on sessions" ON public.presentation_sessions;
CREATE POLICY "Authenticated users can access sessions"
  ON public.presentation_sessions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);