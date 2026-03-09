
-- 1. Lock down encryption_keys table with RLS
ALTER TABLE public.encryption_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny all access to encryption_keys"
ON public.encryption_keys
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- 2. Tighten fhir_events SELECT to staff/admin only
DROP POLICY IF EXISTS "Authenticated users can read fhir_events" ON public.fhir_events;

CREATE POLICY "Staff and admins can read fhir_events"
ON public.fhir_events
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'staff'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- 3. Attach handle_new_user trigger (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;
