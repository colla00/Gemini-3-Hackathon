-- Fix: Require authentication for creating presentation sessions (remove anonymous creation)
DROP POLICY IF EXISTS "Authenticated users can create sessions" ON presentation_sessions;
CREATE POLICY "Authenticated users can create sessions" ON presentation_sessions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = creator_id AND creator_id IS NOT NULL);

-- Fix: Remove unused 'role' column from profiles table to prevent privilege escalation confusion
-- The proper role system uses the user_roles table with RLS
ALTER TABLE profiles DROP COLUMN IF EXISTS role;

-- Add comment to clarify authorization model
COMMENT ON TABLE user_roles IS 'Authoritative source for user roles. Never trust profiles table for authorization.';