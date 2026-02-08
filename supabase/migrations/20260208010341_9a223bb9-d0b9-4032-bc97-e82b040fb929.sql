-- Deny anonymous access to contact inquiries (prevent public reads)
CREATE POLICY "Deny anonymous access to contact inquiries"
ON public.contact_inquiries
FOR SELECT
USING (false);
