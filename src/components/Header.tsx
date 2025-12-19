import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Flame, Star } from 'lucide-react';
import { useGamification } from '../hooks/useGamification';
import { mainNavLinks } from '../lib/navData';

export default function Header() {
  const { stats } = useGamification();
  const router = useRouter();

  return (
    <header className="bg-ui-dark/95 backdrop-blur-md shadow-sm border-b border-ui-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-glow-rose group-hover:scale-110 transition-all duration-500">
                <img src="/logo.png" alt="Student Resource Hub" className="h-6 w-auto brightness-0 invert" />
              </div>
              <span className="text-xl font-black text-text-primary tracking-tighter">Student Resource Hub</span>
            </Link>

            {/* Gamification Stats */}
            <div className="hidden sm:flex items-center gap-4 pl-8 border-l border-ui-border">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 rounded-xl border border-orange-500/20" title="Daily Streak">
                <Flame className={`w-4 h-4 ${stats.streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-text-muted'}`} />
                <span className="text-xs font-black text-orange-500">{stats.streak}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 rounded-xl border border-yellow-500/20" title="Level">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-black text-yellow-500">Lvl {stats.level}</span>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {mainNavLinks.map((link) => {
              const isActive = router.pathname === link.href || (link.href !== '/' && router.pathname.startsWith(link.href));
              
              if (link.isButton) {
                return (
                  <Link 
                    key={link.href}
                    href={link.href}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 hover:scale-105"
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-black uppercase tracking-widest transition-all hover:text-rose-400 ${
                    isActive ? 'text-rose-400' : link.isHighlight ? 'text-rose-400/80 underline decoration-rose-500/50 underline-offset-8' : 'text-text-muted'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile placeholder or Login */}
          <div className="flex md:hidden items-center gap-4">
             {/* Small mobile stats */}
             <div className="flex items-center gap-1 px-2 py-1 bg-rose-500/10 rounded-lg">
                <Star className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span className="text-[10px] font-black text-rose-500">{stats.level}</span>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}
