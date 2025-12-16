-- Create rate_limits table for persistent rate limiting
CREATE TABLE public.rate_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for fast lookups
CREATE INDEX idx_rate_limits_key ON public.rate_limits (key);
CREATE INDEX idx_rate_limits_window_start ON public.rate_limits (window_start);

-- Enable RLS (but allow edge functions with service role to bypass)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- No public policies - only service role can access this table
-- Edge functions will use the service role key

-- Function to check and update rate limit atomically
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key text,
  p_max_requests integer,
  p_window_seconds integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record rate_limits%ROWTYPE;
  v_now timestamp with time zone := now();
  v_window_start timestamp with time zone;
  v_result jsonb;
BEGIN
  -- Calculate window start
  v_window_start := v_now - (p_window_seconds || ' seconds')::interval;
  
  -- Try to get existing record
  SELECT * INTO v_record FROM rate_limits WHERE key = p_key FOR UPDATE;
  
  IF v_record IS NULL THEN
    -- No existing record, create new one
    INSERT INTO rate_limits (key, count, window_start, updated_at)
    VALUES (p_key, 1, v_now, v_now)
    RETURNING * INTO v_record;
    
    RETURN jsonb_build_object(
      'allowed', true,
      'remaining', p_max_requests - 1,
      'reset_at', extract(epoch from v_now + (p_window_seconds || ' seconds')::interval)::bigint
    );
  END IF;
  
  -- Check if window has expired
  IF v_record.window_start < v_window_start THEN
    -- Reset the window
    UPDATE rate_limits 
    SET count = 1, window_start = v_now, updated_at = v_now
    WHERE key = p_key;
    
    RETURN jsonb_build_object(
      'allowed', true,
      'remaining', p_max_requests - 1,
      'reset_at', extract(epoch from v_now + (p_window_seconds || ' seconds')::interval)::bigint
    );
  END IF;
  
  -- Check if rate limit exceeded
  IF v_record.count >= p_max_requests THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'remaining', 0,
      'reset_at', extract(epoch from v_record.window_start + (p_window_seconds || ' seconds')::interval)::bigint
    );
  END IF;
  
  -- Increment counter
  UPDATE rate_limits 
  SET count = count + 1, updated_at = v_now
  WHERE key = p_key;
  
  RETURN jsonb_build_object(
    'allowed', true,
    'remaining', p_max_requests - v_record.count - 1,
    'reset_at', extract(epoch from v_record.window_start + (p_window_seconds || ' seconds')::interval)::bigint
  );
END;
$$;

-- Function to clean up old rate limit entries (run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits(p_older_than_hours integer DEFAULT 24)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted integer;
BEGIN
  DELETE FROM rate_limits 
  WHERE window_start < now() - (p_older_than_hours || ' hours')::interval;
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;