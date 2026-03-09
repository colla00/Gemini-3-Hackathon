
CREATE TABLE public.office_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patent_id uuid REFERENCES public.patents(id) ON DELETE CASCADE NOT NULL,
  action_type text NOT NULL DEFAULT 'non-final',
  mailing_date date,
  response_deadline date,
  status text NOT NULL DEFAULT 'pending',
  examiner_name text,
  art_unit text,
  rejection_types text[] DEFAULT '{}',
  cited_references text[] DEFAULT '{}',
  summary text,
  response_notes text,
  responded_at timestamp with time zone,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.office_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage office actions"
  ON public.office_actions FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can view office actions"
  ON public.office_actions FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));
