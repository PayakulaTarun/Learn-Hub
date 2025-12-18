import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, BookOpen } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-ui-dark/95 backdrop-blur-md shadow-sm border-b border-ui-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="LearnHub Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-text-primary">LearnHub</span>
          </Link>

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