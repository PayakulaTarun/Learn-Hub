import {
    Home, BookOpen, Compass, Trophy, Terminal, Info,
    LayoutGrid, User, Globe, Wrench, Code,
    Database, Cloud, Smartphone, BarChart, Network,
    Cpu, Server, Brain, Layers, Rocket, Zap,
    ShieldCheck, Settings, Github, Sparkles, Target,
    Layout as LayoutIcon
} from 'lucide-react';

export const iconMap: Record<string, any> = {
    Home, BookOpen, Compass, Trophy, Terminal, Info,
    LayoutGrid, User, Globe, Wrench, Code,
    Database, Cloud, Smartphone, BarChart, Network,
    Cpu, Server, Brain, Layers, Rocket, Zap,
    ShieldCheck, Settings, Github, Sparkles, Target,
    LayoutIcon
};

export const mainNavLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Subjects', href: '/subjects', icon: BookOpen },
    { label: 'Navigator', href: '/navigator', icon: Compass },
    { label: 'Evaluator', href: '/evaluator', icon: Trophy, isHighlight: true },
    { label: 'Practice', href: '/practice', icon: Terminal, isButton: true },
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'About', href: '/about', icon: Info },
];

export const mobileBottomLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Subjects', href: '/subjects', icon: LayoutGrid },
    { label: 'Navigator', href: '/navigator', icon: Compass },
    { label: 'Evaluator', href: '/evaluator', icon: Trophy },
    { label: 'Profile', href: '/profile', icon: User },
];

export const availableSubjects = [
    // Web Development
    { slug: 'html', label: 'HTML Foundations', category: 'Web Development', icon: 'Globe', order: 1 },
    { slug: 'css', label: 'Modern CSS Design', category: 'Web Development', icon: 'LayoutGrid', order: 2 },
    { slug: 'javascript', label: 'JavaScript Engine', category: 'Web Development', icon: 'Code', order: 3 },
    { slug: 'react', label: 'React Library', category: 'Web Development', icon: 'Rocket', order: 4 },
    { slug: 'next-js', label: 'Next.js Framework', category: 'Web Development', icon: 'Zap', order: 5 },
    { slug: 'angular', label: 'Angular Framework', category: 'Web Development', icon: 'ShieldCheck', order: 6 },
    { slug: 'bootstrap', label: 'Bootstrap UI', category: 'Web Development', icon: 'LayoutIcon', order: 7 },
    { slug: 'backend', label: 'Backend Architecture', category: 'Web Development', icon: 'Database', order: 8 },

    // Computer Science Core
    { slug: 'data-structures', label: 'Data Structures', category: 'Computer Science', icon: 'Layers', order: 10 },
    { slug: 'algorithms', label: 'Algorithms', category: 'Computer Science', icon: 'Cpu', order: 11 },
    { slug: 'operating-systems', label: 'Operating Systems', category: 'Core Engineering', icon: 'Settings', order: 12 },
    { slug: 'dbms', label: 'Database (DBMS)', category: 'Core Engineering', icon: 'Database', order: 13 },
    { slug: 'computer-networks', label: 'Computer Networks', category: 'Core Engineering', icon: 'Globe', order: 14 },
    { slug: 'software-engineering', label: 'Software Engineering', category: 'Core Engineering', icon: 'BookOpen', order: 15 },
    { slug: 'computer-organization', label: 'Computer Org', category: 'Core Engineering', icon: 'Cpu', order: 16 },

    // Languages & Tools
    { slug: 'java', label: 'Java', category: 'Programming Languages', icon: 'Code', order: 20 },
    { slug: 'python', label: 'Python', category: 'Programming Languages', icon: 'Terminal', order: 21 },
    { slug: 'c-programming', label: 'C Programming', category: 'Programming Languages', icon: 'Terminal', order: 22 },
    { slug: 'cpp-programming', label: 'C++ Programming', category: 'Programming Languages', icon: 'Terminal', order: 23 },
    { slug: 'git', label: 'Git & Versioning', category: 'Tools', icon: 'Github', order: 24 },

    // Data & AI
    { slug: 'artificial-intelligence', label: 'AI Foundations', category: 'Advanced Tech', icon: 'Sparkles', order: 30 },
    { slug: 'machine-learning', label: 'Machine Learning', category: 'Advanced Tech', icon: 'Target', order: 31 },
    { slug: 'data-science', label: 'Data Science', category: 'Advanced Tech', icon: 'BarChart', order: 32 },
    { slug: 'mysql', label: 'MySQL', category: 'Database', icon: 'Database', order: 33 },
    { slug: 'mongodb', label: 'MongoDB', category: 'Database', icon: 'Database', order: 34 }
].sort((a, b) => a.order - b.order);

export const getSubjectLabel = (slug: string) => {
    return availableSubjects.find(s => s.slug === slug)?.label || slug;
};

export const getSubjectsByCategory = (category: string) => {
    return availableSubjects.filter(s => s.category === category);
};
