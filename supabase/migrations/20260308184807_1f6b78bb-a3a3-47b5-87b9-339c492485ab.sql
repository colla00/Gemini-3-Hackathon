
-- Data room documents table
CREATE TABLE public.dataroom_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general',
  file_path text,
  file_name text,
  file_size integer,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  is_confidential boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.dataroom_documents ENABLE ROW LEVEL SECURITY;

-- Only admins can manage documents
CREATE POLICY "Admins can manage dataroom documents" ON public.dataroom_documents
  FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Staff can view documents
CREATE POLICY "Staff can view dataroom documents" ON public.dataroom_documents
  FOR SELECT USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

-- Access log table
CREATE TABLE public.dataroom_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES public.dataroom_documents(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  user_email text,
  action text NOT NULL DEFAULT 'view',
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.dataroom_access_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view access logs
CREATE POLICY "Admins can view dataroom access logs" ON public.dataroom_access_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Authenticated users can insert access logs
CREATE POLICY "Authenticated users can log access" ON public.dataroom_access_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Deny anonymous
CREATE POLICY "Deny anonymous access to dataroom docs" ON public.dataroom_documents
  FOR SELECT USING (false);

CREATE POLICY "Deny anonymous access to dataroom logs" ON public.dataroom_access_logs
  FOR SELECT USING (false);

-- Storage bucket for data room files
INSERT INTO storage.buckets (id, name, public) VALUES ('dataroom', 'dataroom', false);

-- Storage policies: admins can upload/manage
CREATE POLICY "Admins can upload dataroom files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'dataroom' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update dataroom files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'dataroom' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete dataroom files" ON storage.objects
  FOR DELETE USING (bucket_id = 'dataroom' AND has_role(auth.uid(), 'admin'));

-- Staff and admins can download
CREATE POLICY "Authorized users can download dataroom files" ON storage.objects
  FOR SELECT USING (bucket_id = 'dataroom' AND (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin')));
