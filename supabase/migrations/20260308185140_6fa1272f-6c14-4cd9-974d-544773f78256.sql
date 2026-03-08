
CREATE TABLE public.hub_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'backlog',
  category text NOT NULL DEFAULT 'general',
  priority text NOT NULL DEFAULT 'medium',
  assigned_to text,
  due_date date,
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hub_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage hub tasks" ON public.hub_tasks
  FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can view hub tasks" ON public.hub_tasks
  FOR SELECT USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can update hub tasks" ON public.hub_tasks
  FOR UPDATE USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Deny anonymous access to hub tasks" ON public.hub_tasks
  FOR SELECT USING (false);

-- Seed pre-loaded tasks
INSERT INTO public.hub_tasks (title, description, status, category, priority, sort_order) VALUES
('File PCT applications for CRIS-E & IDI', 'Bundle filing strategy for 63/932,953 and 63/945,678. Attorney coordination required.', 'in_progress', 'ip-legal', 'critical', 1),
('Complete IRB pre-submission package', 'Compile protocol synopsis, consent forms, and data management plan for multi-site pilot.', 'todo', 'regulatory', 'high', 2),
('Finalize ANIA 2026 poster materials', 'Print-ready PDF with QR codes, ensure abstract alignment with poster content.', 'done', 'conference', 'high', 3),
('Negotiate hospital pilot MOU', 'Draft memorandum of understanding for 90-day clinical validation pilot at partner site.', 'todo', 'business', 'critical', 4),
('Build investor data room', 'Secure document repository with access logging for due diligence materials.', 'done', 'engineering', 'high', 5),
('Implement FHIR R4 integration demo', 'Working HL7 FHIR connector for live demo with synthetic patient data.', 'in_progress', 'engineering', 'medium', 6),
('Draft Series A term sheet framework', 'Outline valuation methodology, IP contribution schedule, and dilution modeling.', 'backlog', 'business', 'medium', 7),
('Security penetration test remediation', 'Address findings from latest pen test: RLS hardening, input validation, error sanitization.', 'done', 'engineering', 'critical', 8),
('Submit FDA Pre-Sub meeting request', 'Q-Sub package for AI/ML-based SaMD classification guidance.', 'backlog', 'regulatory', 'high', 9),
('Design closed-loop alert optimization study', 'Protocol for measuring alert fatigue reduction with adaptive threshold algorithm.', 'todo', 'research', 'medium', 10),
('Update SBOM and dependency audit', 'Refresh software bill of materials, run vulnerability scan, document mitigations.', 'todo', 'engineering', 'medium', 11),
('Prepare patent claims mapping document', 'Map each of 20 independent claims to working prototype features with screenshots.', 'in_progress', 'ip-legal', 'high', 12),
('Recruit clinical advisory board members', 'Identify and outreach to 3-5 CNOs/CMIOs for advisory roles.', 'backlog', 'business', 'medium', 13),
('License VitaSignal trademark', 'File USPTO trademark application, conduct clearance search.', 'backlog', 'ip-legal', 'low', 14),
('Build automated regression test suite', 'E2E tests for critical paths: auth, dashboard, patent tracker, data room.', 'todo', 'engineering', 'medium', 15);
