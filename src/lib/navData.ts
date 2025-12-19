import { Home, BookOpen, Compass, Trophy, Terminal, Info, LayoutGrid } from 'lucide-react';

export const mainNavLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Subjects', href: '/subjects', icon: BookOpen },
    { label: 'Navigator', href: '/navigator', icon: Compass },
    { label: 'Evaluator', href: '/evaluator', icon: Trophy, isHighlight: true },
    { label: 'Practice', href: '/practice', icon: Terminal, isButton: true },
    { label: 'About', href: '/about', icon: Info },
];

export const mobileBottomLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Subjects', href: '/subjects', icon: LayoutGrid },
    { label: 'Navigator', href: '/navigator', icon: Compass },
    { label: 'Evaluator', href: '/evaluator', icon: Trophy },
];

export const availableSubjects = [
    'HTML', 'CSS', 'JavaScript', 'Data Structures', 'Algorithms',
    'Operating Systems', 'DBMS', 'Computer Networks', 'AI', 'ML',
    'C Programming', 'C++ Programming', 'Software Engineering'
];
