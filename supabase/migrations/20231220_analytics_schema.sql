-- Student Resource Hub: Production Analytics Schema
-- Phase 1: Data Architecture & RLS

-- 1. Raw Activity Audit Log (High Frequency)
CREATE TABLE IF NOT EXISTS public.user_activity_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL, -- 'view', 'solve', 'run', 'login', 'test_attempt', 'roadmap_step'
    entity_type TEXT NOT NULL, -- 'tutorial', 'problem', 'mock_test', 'roadmap'
    entity_id TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    duration_ms INTEGER DEFAULT 0, -- useful for time-spent tracking
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Learning Statistics (Aggregated Rollups)
CREATE TABLE IF NOT EXISTS public.user_learning_stats (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    total_xp INTEGER DEFAULT 0,
    total_time_spent_ms BIGINT DEFAULT 0,
    tutorials_completed_count INTEGER DEFAULT 0,
    problems_solved_count INTEGER DEFAULT 0,
    mock_tests_attempted_count INTEGER DEFAULT 0,
    last_active_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Dashboard Metrics (Cached results for <1s load)
CREATE TABLE IF NOT EXISTS public.user_dashboard_metrics (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    consistency_heatmap JSONB DEFAULT '[]'::jsonb, -- Array of {date, count}
    readiness_scores JSONB DEFAULT '{}'::jsonb, -- { company: score }
    recommendations JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.user_activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_dashboard_metrics ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (Strict privacy)
-- user_activity_events
CREATE POLICY "Users can insert their own activity" ON public.user_activity_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own activity" ON public.user_activity_events
    FOR SELECT USING (auth.uid() = user_id);

-- user_learning_stats
CREATE POLICY "Users can view their own stats" ON public.user_learning_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON public.user_learning_stats
    FOR ALL USING (auth.uid() = user_id);

-- user_dashboard_metrics
CREATE POLICY "Users can view their own dashboard metrics" ON public.user_dashboard_metrics
    FOR SELECT USING (auth.uid() = user_id);

-- 6. Logic: Automatic Stats Rollup
-- Update last_active_at on every new activity event
CREATE OR REPLACE FUNCTION public.handle_user_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_learning_stats (user_id, last_active_at, updated_at)
    VALUES (NEW.user_id, NEW.created_at, NEW.created_at)
    ON CONFLICT (user_id) DO UPDATE SET
        last_active_at = EXCLUDED.last_active_at,
        updated_at = EXCLUDED.updated_at;

    -- If event is 'solve', increment problems_solved
    IF NEW.event_type = 'solve' THEN
        UPDATE public.user_learning_stats
        SET problems_solved_count = problems_solved_count + 1
        WHERE user_id = NEW.user_id;
    END IF;

    -- If event has duration, add to total_time_spent
    IF NEW.duration_ms > 0 THEN
        UPDATE public.user_learning_stats
        SET total_time_spent_ms = total_time_spent_ms + NEW.duration_ms
        WHERE user_id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_activity_event
AFTER INSERT ON public.user_activity_events
FOR EACH ROW EXECUTE FUNCTION public.handle_user_activity();

-- 7. Logic: Initialize stats for new users (via handle_new_user trigger in prev migration)
-- This assumes the handle_new_user function exists from the first migration.
-- We will update it to include these new tables.
