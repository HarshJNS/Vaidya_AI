CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT NOT NULL,
  relation TEXT,
  age INTEGER,
  dob DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  height_cm NUMERIC(5,1),
  weight_kg NUMERIC(5,1),
  blood_group TEXT,
  activity_level TEXT DEFAULT 'light' CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active')),
  sleep_hours NUMERIC(3,1),
  location TEXT,
  preferred_lang TEXT DEFAULT 'en' CHECK (preferred_lang IN ('en', 'hi')),
  is_admin BOOLEAN DEFAULT FALSE,
  avatar_color TEXT DEFAULT 'teal',
  profile_pct INTEGER DEFAULT 0 CHECK (profile_pct BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE health_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  conditions TEXT[] DEFAULT '{}',
  medicines JSONB DEFAULT '[]',
  allergies TEXT[] DEFAULT '{}',
  past_surgeries TEXT[] DEFAULT '{}',
  family_history TEXT[] DEFAULT '{}',
  diet_type TEXT DEFAULT 'omnivore' CHECK (diet_type IN ('vegetarian', 'vegan', 'omnivore', 'jain')),
  smoking BOOLEAN DEFAULT FALSE,
  alcohol BOOLEAN DEFAULT FALSE,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  sources TEXT[] DEFAULT '{}',
  safety_flagged BOOLEAN DEFAULT FALSE,
  safety_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  embedding VECTOR(768),
  source TEXT NOT NULL,
  chapter TEXT,
  trust_level INTEGER DEFAULT 2 CHECK (trust_level BETWEEN 1 AND 3),
  language TEXT DEFAULT 'en',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX knowledge_chunks_embedding_idx ON knowledge_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE TABLE safety_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trigger_phrase TEXT,
  category TEXT,
  full_message TEXT,
  action_taken TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER health_details_updated_at
  BEFORE UPDATE ON health_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

