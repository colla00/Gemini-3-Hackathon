
-- Fix the overly permissive SLA metrics insert policy
DROP POLICY "Service can insert SLA metrics" ON public.sla_metrics;

-- Replace with authenticated-only insert
CREATE POLICY "Authenticated users can insert SLA metrics"
  ON public.sla_metrics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
