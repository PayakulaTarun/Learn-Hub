import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-ui-dark text-text-primary border-t border-ui-border relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <img src="/logo.png" alt="Logo" className="h-12 w-auto transition-transform group-hover:scale-110" />
              <span className="text-2xl font-black text-text-primary tracking-tighter">Student Resource Hub</span>
            </Link>
            <p className="text-text-muted max-w-md leading-relaxed">
              Accelerating the next generation of software engineers through production-grade 
              learning paths, real-time analytics, and high-fidelity interview simulations.
            </p>
          </div>
          
          {/* Quick Learning */}
          <div>
            <h3 className="font-bold mb-6 text-text-primary text-sm">Curriculum</h3>
            <ul className="space-y-3 text-sm font-medium text-text-muted">
              <li><Link href="/subjects/html-introduction" className="hover:text-accent transition-colors flex items-center gap-2">HTML Masterclass</Link></li>
              <li><Link href="/subjects/css-introduction" className="hover:text-accent transition-colors flex items-center gap-2">Modern CSS Design</Link></li>
              <li><Link href="/subjects" className="hover:text-accent transition-colors flex items-center gap-2">Browse All Subjects</Link></li>
            </ul>
          </div>
          
          {/* Engineering Tools */}
          <div>
            <h3 className="font-bold mb-6 text-text-primary text-sm">Engineering Tools</h3>
            <ul className="space-y-3 text-sm font-medium text-text-muted">
              <li><Link href="/navigator" className="hover:text-accent transition-colors flex items-center gap-2">Career Navigator</Link></li>
              <li><Link href="/evaluator" className="hover:text-accent transition-colors flex items-center gap-2">Interview Battlegrounds</Link></li>
              <li><Link href="/toolkit/resume-builder" className="hover:text-accent transition-colors flex items-center gap-2">AI Resume Builder</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-ui-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-[10px] text-text-muted font-bold uppercase tracking-widest">
            <span>&copy; {new Date().getFullYear()} Student Resource Hub.</span>
            <span className="hidden md:inline">&bull;</span>
            <span>Built for High-Performance Learning.</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-text-muted">
            <Link href="/about" className="hover:text-text-primary transition-colors">About Hub</Link>
            <Link href="/login" className="hover:text-text-primary transition-colors text-accent">Enroll Now</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
