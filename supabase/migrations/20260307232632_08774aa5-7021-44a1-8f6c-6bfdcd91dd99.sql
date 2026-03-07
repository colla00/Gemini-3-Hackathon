
-- Enable pgcrypto if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Store encryption key in vault
-- First check if pgsodium/vault is available, use a GUC fallback
DO $$
BEGIN
  -- Insert encryption key into vault
  PERFORM vault.create_secret(
    encode(gen_random_bytes(32), 'hex'),
    'pii_encryption_key',
    'Encryption key for PII fields in patent_attestations'
  );
EXCEPTION WHEN OTHERS THEN
  -- If vault is not available, we'll use a generated key stored in a config table
  RAISE NOTICE 'Vault not available, using config table for key storage';
END;
$$;

-- Create a secure config table for the encryption key (fallback if vault unavailable)
CREATE TABLE IF NOT EXISTS public.encryption_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name text UNIQUE NOT NULL,
  key_value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.encryption_keys ENABLE ROW LEVEL SECURITY;

-- No RLS policies = only service role / SECURITY DEFINER functions can access
-- This is intentional - the key should never be accessible from client

-- Insert encryption key if not exists
INSERT INTO public.encryption_keys (key_name, key_value)
VALUES ('pii_encryption_key', encode(gen_random_bytes(32), 'hex'))
ON CONFLICT (key_name) DO NOTHING;

-- Add encrypted columns to patent_attestations
ALTER TABLE public.patent_attestations
  ADD COLUMN IF NOT EXISTS witness_email_encrypted bytea,
  ADD COLUMN IF NOT EXISTS ip_address_encrypted bytea;

-- Create encryption helper function
CREATE OR REPLACE FUNCTION public.encrypt_pii(plaintext text)
RETURNS bytea
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  enc_key text;
BEGIN
  IF plaintext IS NULL THEN
    RETURN NULL;
  END IF;
  
  SELECT key_value INTO enc_key FROM encryption_keys WHERE key_name = 'pii_encryption_key';
  
  IF enc_key IS NULL THEN
    RAISE EXCEPTION 'Encryption key not found';
  END IF;
  
  RETURN pgp_sym_encrypt(plaintext, enc_key);
END;
$$;

-- Create decryption helper function
CREATE OR REPLACE FUNCTION public.decrypt_pii(ciphertext bytea)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  enc_key text;
BEGIN
  IF ciphertext IS NULL THEN
    RETURN NULL;
  END IF;
  
  SELECT key_value INTO enc_key FROM encryption_keys WHERE key_name = 'pii_encryption_key';
  
  IF enc_key IS NULL THEN
    RAISE EXCEPTION 'Encryption key not found';
  END IF;
  
  RETURN pgp_sym_decrypt(ciphertext, enc_key);
END;
$$;

-- Migrate existing plaintext data to encrypted columns
UPDATE public.patent_attestations
SET 
  witness_email_encrypted = encrypt_pii(witness_email),
  ip_address_encrypted = encrypt_pii(ip_address)
WHERE witness_email IS NOT NULL OR ip_address IS NOT NULL;

-- Create trigger to auto-encrypt on INSERT/UPDATE
CREATE OR REPLACE FUNCTION public.encrypt_attestation_pii()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Encrypt witness_email if provided
  IF NEW.witness_email IS NOT NULL THEN
    NEW.witness_email_encrypted := encrypt_pii(NEW.witness_email);
    NEW.witness_email := '***encrypted***';
  END IF;
  
  -- Encrypt ip_address if provided
  IF NEW.ip_address IS NOT NULL THEN
    NEW.ip_address_encrypted := encrypt_pii(NEW.ip_address);
    NEW.ip_address := '***encrypted***';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER encrypt_pii_before_write
  BEFORE INSERT OR UPDATE ON public.patent_attestations
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_attestation_pii();

-- Create admin-only RPC to get decrypted attestations
CREATE OR REPLACE FUNCTION public.get_decrypted_attestations()
RETURNS TABLE (
  id uuid,
  witness_name text,
  witness_title text,
  organization text,
  witness_email text,
  ip_address text,
  attested_at timestamptz,
  document_hash text,
  document_version text,
  claims_count integer,
  signature text,
  created_at timestamptz,
  attestation_group_id uuid,
  email_confirmed boolean,
  confirmed_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only admins can decrypt PII
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;
  
  RETURN QUERY
  SELECT 
    pa.id,
    pa.witness_name,
    pa.witness_title,
    pa.organization,
    COALESCE(decrypt_pii(pa.witness_email_encrypted), pa.witness_email) AS witness_email,
    COALESCE(decrypt_pii(pa.ip_address_encrypted), pa.ip_address) AS ip_address,
    pa.attested_at,
    pa.document_hash,
    pa.document_version,
    pa.claims_count,
    pa.signature,
    pa.created_at,
    pa.attestation_group_id,
    pa.email_confirmed,
    pa.confirmed_at
  ORDER BY pa.attested_at DESC;
END;
$$;

-- Create function to decrypt a single witness email (for edge functions)
CREATE OR REPLACE FUNCTION public.decrypt_witness_email(attestation_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  result text;
BEGIN
  SELECT decrypt_pii(witness_email_encrypted) INTO result
  FROM patent_attestations
  WHERE id = attestation_id;
  
  RETURN result;
END;
$$;
