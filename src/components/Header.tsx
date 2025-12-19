import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, BookOpen, Flame, Star, Trophy } from 'lucide-react';
import { useGamification } from '../hooks/useGamification';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { stats } = useGamification();

  return (
    <header className="bg-ui-dark/95 backdrop-blur-md shadow-sm border-b border-ui-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="LearnHub Logo" className="h-10 w-auto" />
              <span className="text-xl font-bold text-text-primary">LearnHub</span>
            </Link>

            {/* Gamification Stats */}
            <div className="hidden sm:flex items-center gap-4 pl-6 border-l border-ui-border">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 rounded-full border border-orange-500/20" title="Daily Streak">
                <Flame className={`w-4 h-4 ${stats.streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-text-muted'}`} />
                <span className="text-xs font-black text-orange-500">{stats.streak}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20" title="Level">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-black text-yellow-500">Lvl {stats.level}</span>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-text-secondary hover:text-accent font-medium transition-colors">
              Home
            </Link>
            <Link href="/subjects" className="text-text-secondary hover:text-accent font-medium transition-colors">
              Subjects
            </Link>
            <Link href="/about" className="text-text-secondary hover:text-accent font-medium transition-colors">
              About
            </Link>
            <Link href="/navigator" className="text-text-secondary hover:text-accent font-medium transition-colors">
              Navigator
            </Link>
            <Link href="/evaluator" className="text-rose-400 hover:text-rose-300 font-bold transition-colors">
              Evaluator
            </Link>
            <Link href="/practice" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
              Practice
            </Link>
          </nav>

          <button
            className="md:hidden text-text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-ui-border bg-ui-dark">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-text-secondary hover:text-accent transition-colors">
                Home
              </Link>
              <Link href="/subjects" className="text-text-secondary hover:text-accent transition-colors">
                Subjects
              </Link>
              <Link href="/about" className="text-text-secondary hover:text-accent transition-colors">
                About
              </Link>
              <Link href="/navigator" className="text-text-secondary hover:text-accent transition-colors">
                Navigator
              </Link>
              <Link href="/evaluator" className="text-rose-400 font-bold hover:text-rose-300 transition-colors">
                Evaluator
              </Link>
              <Link href="/practice" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                Practice Lab
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}