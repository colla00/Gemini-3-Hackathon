
-- Create patent_figures table
CREATE TABLE public.patent_figures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patent_id text NOT NULL,
  figure_number integer NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size integer,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.patent_figures ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view figures
CREATE POLICY "Authenticated users can view figures"
  ON public.patent_figures FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Staff/admins can insert figures
CREATE POLICY "Staff and admins can insert figures"
  ON public.patent_figures FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'staff'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Staff/admins can update figures
CREATE POLICY "Staff and admins can update figures"
  ON public.patent_figures FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'staff'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete figures
CREATE POLICY "Admins can delete figures"
  ON public.patent_figures FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for patent figures
INSERT INTO storage.buckets (id, name, public) VALUES ('patent-figures', 'patent-figures', false);

-- Storage RLS: authenticated can upload
CREATE POLICY "Authenticated users can upload figures"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'patent-figures');

-- Storage RLS: authenticated can view
CREATE POLICY "Authenticated users can view figures"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'patent-figures');

-- Storage RLS: admins can delete
CREATE POLICY "Admins can delete figure files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'patent-figures' AND EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ));
