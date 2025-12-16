-- Create rate_limit_violations table for monitoring
CREATE TABLE public.rate_limit_violations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL,
  ip_address text,
  endpoint text NOT NULL,
  violation_count integer NOT NULL DEFAULT 1,
  first_violation_at timestamp with time zone NOT NULL DEFAULT now(),
  last_violation_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_rate_limit_violations_key ON public.rate_limit_violations (key);
CREATE INDEX idx_rate_limit_violations_endpoint ON public.rate_limit_violations (endpoint);
CREATE INDEX idx_rate_limit_violations_ip ON public.rate_limit_violations (ip_address);
CREATE INDEX idx_rate_limit_violations_last_violation ON public.rate_limit_violations (last_violation_at DESC);

-- Enable RLS
ALTER TABLE public.rate_limit_violations ENABLE ROW LEVEL SECURITY;

-- Only admins can view violations (for monitoring dashboard)
CREATE POLICY "Admins can view rate limit violations"
ON public.rate_limit_violations
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Function to log rate limit violations (called by edge functions via service role)
CREATE OR REPLACE FUNCTION public.log_rate_limit_violation(
  p_key text,
  p_ip_address text,
  p_endpoint text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_id uuid;
BEGIN
  -- Check if there's a recent violation from same key/endpoint (within last hour)
  SELECT id INTO v_existing_id
  FROM rate_limit_violations
  WHERE key = p_key 
    AND endpoint = p_endpoint
    AND last_violation_at > now() - interval '1 hour'
  LIMIT 1;
  
  IF v_existing_id IS NOT NULL THEN
    -- Update existing violation record
    UPDATE rate_limit_violations
    SET violation_count = violation_count + 1,
        last_violation_at = now()
    WHERE id = v_existing_id;
  ELSE
    -- Insert new violation record
    INSERT INTO rate_limit_violations (key, ip_address, endpoint)
    VALUES (p_key, p_ip_address, p_endpoint);
  END IF;
END;
$$;

-- Function to get violation stats for monitoring
CREATE OR REPLACE FUNCTION public.get_rate_limit_stats(p_hours integer DEFAULT 24)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_violations', COALESCE(SUM(violation_count), 0),
    'unique_keys', COUNT(DISTINCT key),
    'unique_ips', COUNT(DISTINCT ip_address),
    'by_endpoint', (
      SELECT jsonb_object_agg(endpoint, cnt)
      FROM (
        SELECT endpoint, SUM(violation_count) as cnt
        FROM rate_limit_violations
        WHERE last_violation_at > now() - (p_hours || ' hours')::interval
        GROUP BY endpoint
      ) e
    ),
    'top_offenders', (
      SELECT jsonb_agg(row_to_json(t))
      FROM (
        SELECT ip_address, SUM(violation_count) as total_violations
        FROM rate_limit_violations
        WHERE last_violation_at > now() - (p_hours || ' hours')::interval
        GROUP BY ip_address
        ORDER BY total_violations DESC
        LIMIT 10
      ) t
    )
  ) INTO v_result
  FROM rate_limit_violations
  WHERE last_violation_at > now() - (p_hours || ' hours')::interval;
  
  RETURN COALESCE(v_result, '{}'::jsonb);
END;
$$;

-- Cleanup function for old violation records
CREATE OR REPLACE FUNCTION public.cleanup_rate_limit_violations(p_older_than_days integer DEFAULT 30)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted integer;
BEGIN
  DELETE FROM rate_limit_violations 
  WHERE last_violation_at < now() - (p_older_than_days || ' days')::interval;
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;