
-- Fix: Replace overly permissive "Anyone can check username existence" policy
-- with a restricted one that only allows checking username column
DROP POLICY IF EXISTS "Anyone can check username existence" ON public.profiles;

-- Create a security definer function to check username existence without exposing all data
CREATE OR REPLACE FUNCTION public.check_username_exists(target_username text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE username = target_username
  );
$$;
