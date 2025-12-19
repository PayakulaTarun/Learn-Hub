import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { mobileBottomLinks } from '../lib/navData';

export default function MobileBottomNav() {
  const router = useRouter();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-ui-dark/95 backdrop-blur-lg border-t border-ui-border z-50 px-6 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {mobileBottomLinks.map((link) => {
          const isActive = router.pathname === link.href || (link.href !== '/' && router.pathname.startsWith(link.href));
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
                isActive ? 'text-rose-500 scale-110' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all ${isActive ? 'bg-rose-500/20 shadow-glow-rose-sm' : ''}`}>
                <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
