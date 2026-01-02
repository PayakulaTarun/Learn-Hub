-- Enable RLS on core user data tables
ALTER TABLE IF EXISTS public.user_activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_learning_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users can view their own profile, anyone can insert (on signup triggering), users can update their own
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
-- Note: Insert policy usually handled by trigger or service role, but for client-side creation:
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. User Activity Events: Strictly private
CREATE POLICY "Users can view own events" ON public.user_activity_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can log own events" ON public.user_activity_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. User Learning Stats: Strictly private
CREATE POLICY "Users can view own stats" ON public.user_learning_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON public.user_learning_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON public.user_learning_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. User XP: Strictly private
CREATE POLICY "Users can view own xp" ON public.user_xp FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own xp" ON public.user_xp FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own xp" ON public.user_xp FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Subjects / Content: Public Read Only (ensure this exists)
ALTER TABLE IF EXISTS public.subjects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON public.subjects;
CREATE POLICY "Public Read Access" ON public.subjects FOR SELECT USING (true);
