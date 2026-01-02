import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BookOpen, ChevronRight, LayoutGrid } from 'lucide-react';
import { availableSubjects } from '../lib/navData';

export default function SubjectNavbar() {
  const router = useRouter();
  const subjects = availableSubjects;

  const isNavigationalPage = router.pathname.startsWith('/subjects') || router.pathname.startsWith('/learn');
  if (!isNavigationalPage) return null;

  return (
    <nav className="sticky top-16 z-40 w-full bg-ui-dark/80 backdrop-blur-xl border-b border-ui-border shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 py-4 overflow-x-auto no-scrollbar">
          <Link 
            href="/subjects"
            className={`flex-shrink-0 p-2.5 rounded-2xl transition-all duration-500 ${
              router.pathname === '/subjects' && !router.asPath.includes('#')
              ? 'bg-rose-500 text-primary shadow-glow-rose scale-110' 
              : 'bg-ui-card text-text-muted hover:text-rose-400 border border-ui-border hover:border-rose-500/30'
            }`}
          >
            <LayoutGrid size={20} />
          </Link>

          <div className="flex items-center gap-3">
            {subjects.map((subject) => {
              const subjectId = subject.slug;
              const isActive = router.asPath.includes(subjectId);

              return (
                <Link
                  key={subjectId}
                  href={router.pathname === '/subjects' ? `#${subjectId}` : `/subjects#${subjectId}`}
                  className={`flex-shrink-0 px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 border ${
                    isActive
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/50 shadow-glow-rose-sm'
                      : 'bg-primary/40 text-text-muted border-ui-border hover:border-rose-500/30 hover:text-text-primary'
                  }`}
                >
                  {subject.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
