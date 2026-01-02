-- Make the patent-screenshots bucket private to enforce RLS policies
UPDATE storage.buckets 
SET public = false 
WHERE name = 'patent-screenshots';