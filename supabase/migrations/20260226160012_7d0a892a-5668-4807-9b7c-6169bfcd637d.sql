
-- Document public_sessions view rationale
COMMENT ON VIEW public.public_sessions IS 'Intentionally public view for audience join flow. Exposes only non-sensitive session metadata (session_key, presenter_name, slide counts, is_live status). No RLS needed because this is a read-only view filtered to live sessions. Reviewed 2026-02-26.';
