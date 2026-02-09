
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  quiz_completed BOOLEAN NOT NULL DEFAULT false,
  quiz_results JSONB DEFAULT '{}'::jsonb,
  level TEXT DEFAULT 'beginner',
  learning_motivation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Public username check (for signup uniqueness validation)
CREATE POLICY "Anyone can check username existence"
  ON public.profiles FOR SELECT
  USING (true);

-- NFT collections table (public catalog)
CREATE TABLE public.nft_collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_seed TEXT NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'common',
  category TEXT NOT NULL DEFAULT 'avatar',
  frame_style TEXT DEFAULT 'default',
  unlock_condition TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.nft_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view NFT collections"
  ON public.nft_collections FOR SELECT
  USING (true);

-- User NFTs table
CREATE TABLE public.user_nfts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nft_id UUID NOT NULL REFERENCES public.nft_collections(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, nft_id)
);

ALTER TABLE public.user_nfts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own NFTs"
  ON public.user_nfts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can earn NFTs"
  ON public.user_nfts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at on profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Seed initial NFT collections
INSERT INTO public.nft_collections (name, description, image_seed, rarity, category, frame_style, unlock_condition) VALUES
  ('المبتدئ الشجاع', 'NFT ترحيبي لكل مغامر جديد', 'brave_beginner', 'common', 'avatar', 'cyber-green', 'signup'),
  ('صياد الكلمات', 'لمن يتقن 50 كلمة إسبانية', 'word_hunter', 'uncommon', 'avatar', 'pixel-gold', 'words_50'),
  ('سيد القواعد', 'للفوز في 3 معارك Boss', 'grammar_master', 'rare', 'avatar', 'neon-purple', 'boss_3'),
  ('المستكشف', 'لفتح 3 مناطق على الخريطة', 'explorer', 'uncommon', 'avatar', 'cyber-blue', 'zones_3'),
  ('الأسطورة', 'للوصول للمستوى 10', 'legend', 'legendary', 'avatar', 'rainbow-glow', 'level_10'),
  ('محارب الـ Streak', 'للحفاظ على streak لمدة 7 أيام', 'streak_warrior', 'rare', 'avatar', 'fire-frame', 'streak_7'),
  ('راوي القصص', 'لإكمال 5 قصص تفاعلية', 'storyteller', 'rare', 'avatar', 'book-frame', 'stories_5'),
  ('البطل اليومي', 'لإكمال 10 تحديات يومية', 'daily_hero', 'uncommon', 'avatar', 'star-frame', 'daily_10');
