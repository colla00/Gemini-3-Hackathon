
-- Data Retention Policies table
CREATE TABLE public.data_retention_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  retention_days integer NOT NULL DEFAULT 365,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  last_cleanup_at timestamptz,
  rows_deleted_last_run integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);

ALTER TABLE public.data_retention_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage retention policies" ON public.data_retention_policies FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can view retention policies" ON public.data_retention_policies FOR SELECT TO authenticated USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Deny anon select on retention policies" ON public.data_retention_policies FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anon insert on retention policies" ON public.data_retention_policies FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anon update on retention policies" ON public.data_retention_policies FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anon delete on retention policies" ON public.data_retention_policies FOR DELETE TO anon USING (false);

-- Data Deletion Requests table
CREATE TABLE public.data_deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_email text NOT NULL,
  requester_name text NOT NULL,
  request_type text NOT NULL DEFAULT 'full_deletion',
  reason text,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid,
  reviewed_at timestamptz,
  completed_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.data_deletion_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage deletion requests" ON public.data_deletion_requests FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can view deletion requests" ON public.data_deletion_requests FOR SELECT TO authenticated USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Deny anon select on deletion requests" ON public.data_deletion_requests FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anon insert on deletion requests" ON public.data_deletion_requests FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anon update on deletion requests" ON public.data_deletion_requests FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anon delete on deletion requests" ON public.data_deletion_requests FOR DELETE TO anon USING (false);

-- HIPAA Training Modules table
CREATE TABLE public.hipaa_training_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general',
  duration_minutes integer NOT NULL DEFAULT 30,
  passing_score integer NOT NULL DEFAULT 80,
  is_required boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  version text NOT NULL DEFAULT '1.0',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hipaa_training_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage training modules" ON public.hipaa_training_modules FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can view training modules" ON public.hipaa_training_modules FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Deny anon select on training modules" ON public.hipaa_training_modules FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anon insert on training modules" ON public.hipaa_training_modules FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anon update on training modules" ON public.hipaa_training_modules FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anon delete on training modules" ON public.hipaa_training_modules FOR DELETE TO anon USING (false);

-- HIPAA Training Completions table
CREATE TABLE public.hipaa_training_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_id uuid NOT NULL REFERENCES public.hipaa_training_modules(id) ON DELETE CASCADE,
  score integer,
  passed boolean NOT NULL DEFAULT false,
  completed_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '1 year'),
  certificate_number text DEFAULT encode(gen_random_bytes(8), 'hex'),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

ALTER TABLE public.hipaa_training_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own completions" ON public.hipaa_training_completions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own completions" ON public.hipaa_training_completions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all completions" ON public.hipaa_training_completions FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can view all completions" ON public.hipaa_training_completions FOR SELECT TO authenticated USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Deny anon select on completions" ON public.hipaa_training_completions FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anon insert on completions" ON public.hipaa_training_completions FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anon update on completions" ON public.hipaa_training_completions FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anon delete on completions" ON public.hipaa_training_completions FOR DELETE TO anon USING (false);

-- Security Risk Assessments table
CREATE TABLE public.security_risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_year integer NOT NULL,
  assessment_type text NOT NULL DEFAULT 'annual',
  status text NOT NULL DEFAULT 'draft',
  assessor_name text,
  findings_count integer DEFAULT 0,
  critical_findings integer DEFAULT 0,
  high_findings integer DEFAULT 0,
  medium_findings integer DEFAULT 0,
  low_findings integer DEFAULT 0,
  overall_risk_level text DEFAULT 'moderate',
  summary text,
  recommendations text,
  next_review_date date,
  completed_at timestamptz,
  approved_by uuid,
  approved_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.security_risk_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage risk assessments" ON public.security_risk_assessments FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can view risk assessments" ON public.security_risk_assessments FOR SELECT TO authenticated USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Deny anon select on risk assessments" ON public.security_risk_assessments FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anon insert on risk assessments" ON public.security_risk_assessments FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anon update on risk assessments" ON public.security_risk_assessments FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anon delete on risk assessments" ON public.security_risk_assessments FOR DELETE TO anon USING (false);

-- Breach Incidents table
CREATE TABLE public.breach_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_number text NOT NULL DEFAULT ('INC-' || to_char(now(), 'YYYYMMDD') || '-' || encode(gen_random_bytes(3), 'hex')),
  severity text NOT NULL DEFAULT 'low',
  status text NOT NULL DEFAULT 'detected',
  title text NOT NULL,
  description text,
  affected_individuals integer DEFAULT 0,
  phi_involved boolean NOT NULL DEFAULT false,
  discovery_date timestamptz NOT NULL DEFAULT now(),
  notification_deadline timestamptz,
  containment_date timestamptz,
  eradication_date timestamptz,
  recovery_date timestamptz,
  lessons_learned text,
  root_cause text,
  corrective_actions text,
  reported_to_hhs boolean DEFAULT false,
  reported_to_individuals boolean DEFAULT false,
  reported_to_media boolean DEFAULT false,
  reported_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.breach_incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage breach incidents" ON public.breach_incidents FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can view breach incidents" ON public.breach_incidents FOR SELECT TO authenticated USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Deny anon select on breach incidents" ON public.breach_incidents FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anon insert on breach incidents" ON public.breach_incidents FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anon update on breach incidents" ON public.breach_incidents FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anon delete on breach incidents" ON public.breach_incidents FOR DELETE TO anon USING (false);

-- Tabletop Exercises table
CREATE TABLE public.tabletop_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  scenario_description text NOT NULL,
  exercise_date date NOT NULL,
  duration_minutes integer DEFAULT 60,
  facilitator_name text,
  participants text[],
  status text NOT NULL DEFAULT 'scheduled',
  findings text,
  action_items text,
  next_exercise_date date,
  completed_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tabletop_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage tabletop exercises" ON public.tabletop_exercises FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Staff can view tabletop exercises" ON public.tabletop_exercises FOR SELECT TO authenticated USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Deny anon select on tabletop exercises" ON public.tabletop_exercises FOR SELECT TO anon USING (false);
CREATE POLICY "Deny anon insert on tabletop exercises" ON public.tabletop_exercises FOR INSERT TO anon WITH CHECK (false);
CREATE POLICY "Deny anon update on tabletop exercises" ON public.tabletop_exercises FOR UPDATE TO anon USING (false);
CREATE POLICY "Deny anon delete on tabletop exercises" ON public.tabletop_exercises FOR DELETE TO anon USING (false);
