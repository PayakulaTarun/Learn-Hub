import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { mainNavLinks } from '../lib/navData';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-ui-dark/95 backdrop-blur-md shadow-sm border-b border-ui-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <img src="/logo.png" alt="Student Resource Hub" className="h-10 w-auto transition-transform duration-500 group-hover:scale-110" />
              <span className="text-2xl font-black text-text-primary tracking-tighter">Student Resource Hub</span>
            </Link>


          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {mainNavLinks.map((link) => {
              if ((link as any).isAuthHidden && user) return null; // Hide Login/Signup if logged in
              
              const isActive = router.pathname === link.href || (link.href !== '/' && router.pathname.startsWith(link.href));

              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-black uppercase tracking-widest transition-all hover:text-rose-400 ${
                    isActive ? 'text-rose-400' : 'text-text-muted'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {user ? null : (
                <Link 
                    href="/login"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-rose-500/20"
                >
                    Login
                </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
