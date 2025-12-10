-- Drop the existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can read handoff_reports" ON public.handoff_reports;
DROP POLICY IF EXISTS "Authenticated users can insert handoff_reports" ON public.handoff_reports;

-- Create role-based RLS policies for handoff_reports
CREATE POLICY "Staff and admins can read handoff reports"
ON public.handoff_reports
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff and admins can create handoff reports"
ON public.handoff_reports
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));