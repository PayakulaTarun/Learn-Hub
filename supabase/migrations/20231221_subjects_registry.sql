-- Student Resource Hub: Canonical Subject Registry
-- Phase 2: Subject Visibility & Discoverability

CREATE TABLE IF NOT EXISTS public.subjects (
    id TEXT PRIMARY KEY, -- slug, e.g. 'html'
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    icon_name TEXT DEFAULT 'BookOpen',
    color_class TEXT DEFAULT 'bg-gray-500',
    status TEXT DEFAULT 'active', -- 'active', 'coming-soon', 'archived'
    display_order INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read subjects (Public Discovery)
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);

-- Allow admins to update (Service role only by default, but we can add policies later if needed)

-- Initial Seed Data based on auditing the content/ folder
INSERT INTO public.subjects (id, name, category, icon_name, color_class, display_order)
VALUES 
    ('html', 'HTML Foundations', 'Web Development', 'Globe', 'bg-orange-600', 10),
    ('css', 'Modern CSS Design', 'Web Development', 'Wrench', 'bg-blue-400', 20),
    ('javascript', 'Advanced JavaScript', 'Web Development', 'Code', 'bg-yellow-500', 30),
    ('data-structures', 'Data Structures', 'Computer Science', 'Network', 'bg-indigo-600', 40),
    ('algorithms', 'Algorithms', 'Computer Science', 'Cpu', 'bg-orange-500', 50),
    ('operating-systems', 'Operating Systems', 'Core Engineering', 'Server', 'bg-slate-600', 60),
    ('dbms', 'Database Systems', 'Core Engineering', 'Database', 'bg-teal-600', 70),
    ('computer-networks', 'Computer Networks', 'Core Engineering', 'Globe', 'bg-cyan-600', 80),
    ('artificial-intelligence', 'Artificial Intelligence', 'Future Tech', 'Brain', 'bg-rose-600', 90),
    ('machine-learning', 'Machine Learning', 'Future Tech', 'BarChart', 'bg-violet-600', 100),
    ('c-programming', 'C Programming', 'Programming Languages', 'Cpu', 'bg-blue-700', 110),
    ('cpp-programming', 'C++ Programming', 'Programming Languages', 'Code', 'bg-blue-800', 120),
    ('software-engineering', 'Software Engineering', 'Core Engineering', 'Layers', 'bg-emerald-700', 130),
    ('java', 'Java Development', 'Programming Languages', 'Code', 'bg-red-500', 140),
    ('angular', 'Angular Framework', 'Web Development', 'Code', 'bg-red-600', 150),
    ('react', 'React Library', 'Web Development', 'Code', 'bg-blue-500', 160),
    ('next-js', 'Next.js Framework', 'Web Development', 'Code', 'bg-black', 170),
    ('bootstrap', 'Bootstrap CSS', 'Web Development', 'LayoutGrid', 'bg-purple-600', 180),
    ('data-science', 'Data Science', 'Data Analytics', 'BarChart', 'bg-purple-600', 190),
    ('mysql', 'MySQL Database', 'Core Engineering', 'Database', 'bg-blue-600', 200),
    ('mongodb', 'MongoDB (NoSQL)', 'Core Engineering', 'Database', 'bg-green-500', 210),
    ('computer-organization', 'Computer Organization', 'Core Engineering', 'Cpu', 'bg-slate-800', 220),
    ('backend', 'Backend Architecture', 'Web Development', 'Wrench', 'bg-green-500', 230),
    ('python', 'Python Programming', 'Programming Languages', 'Code', 'bg-blue-500', 240);
