-- Fix security definer view - change to security invoker
ALTER VIEW public.public_sessions SET (security_invoker = on);