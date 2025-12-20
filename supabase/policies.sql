-- 0. Schema: Create tables if they don't exist
CREATE TABLE IF NOT EXISTS user_activity_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  updated_at timestamptz,
  website text
);

-- 1. Enable RLS on all tables (Safety Default)
ALTER TABLE user_activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Profiles: Users can read everyone (for social features) but ONLY update themselves
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Analytics Events: STRICTEST POLICY
-- DENY ALL DIRECT CLIENT INSERTS for generic events.
-- Writes must happen via Service Role (API Route) or valid authenticated triggers.
-- We intentionally DO NOT add an INSERT policy for authenticated users here 
-- to force them to use the /api/auth/events endpoint.

-- Exception: Allow users to read their OWN events if needed for UI history
CREATE POLICY "Users can view own events" 
ON user_activity_events FOR SELECT USING (auth.uid() = user_id);

-- 4. Secure Service Role Access
-- (Supabase Service Role bypasses RLS by default, so API routes work automagically)
