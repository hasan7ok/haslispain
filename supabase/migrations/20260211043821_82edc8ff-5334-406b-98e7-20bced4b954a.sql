
-- 1. Add username format constraint to profiles table
ALTER TABLE public.profiles ADD CONSTRAINT username_format 
  CHECK (username ~ '^[a-zA-Z0-9_]{3,20}$');

-- Update handle_new_user to validate username format
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  raw_username text;
  safe_username text;
BEGIN
  raw_username := COALESCE(NEW.raw_user_meta_data->>'username', '');
  
  -- Validate username format, fallback to sanitized email prefix
  IF raw_username ~ '^[a-zA-Z0-9_]{3,20}$' THEN
    safe_username := raw_username;
  ELSE
    safe_username := regexp_replace(split_part(NEW.email, '@', 1), '[^a-zA-Z0-9_]', '_', 'g');
    safe_username := left(safe_username, 20);
    IF length(safe_username) < 3 THEN
      safe_username := safe_username || repeat('_', 3 - length(safe_username));
    END IF;
  END IF;

  INSERT INTO public.profiles (user_id, username, avatar_url)
  VALUES (
    NEW.id,
    safe_username,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$;

-- 2. Create rate limiting table for chat
CREATE TABLE public.chat_rate_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  request_count int NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_rate_limits ENABLE ROW LEVEL SECURITY;

-- No direct client access needed - only edge function uses this via service role
-- No RLS policies = no client access (RLS enabled but no policies)

CREATE INDEX idx_chat_rate_limits_user_window ON public.chat_rate_limits (user_id, window_start);

-- 3. Create server-side NFT awarding function
CREATE OR REPLACE FUNCTION public.award_nft(p_unlock_condition text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_nft_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN false;
  END IF;

  -- Find NFT matching the unlock condition
  SELECT id INTO v_nft_id
  FROM public.nft_collections
  WHERE unlock_condition = p_unlock_condition
  LIMIT 1;

  IF v_nft_id IS NULL THEN
    RETURN false;
  END IF;

  -- Insert if not already earned (ignore duplicate)
  INSERT INTO public.user_nfts (user_id, nft_id)
  VALUES (v_user_id, v_nft_id)
  ON CONFLICT DO NOTHING;

  RETURN true;
END;
$$;

-- 4. Remove direct INSERT policy on user_nfts (award_nft RPC handles it now)
DROP POLICY IF EXISTS "Users can earn NFTs" ON public.user_nfts;
