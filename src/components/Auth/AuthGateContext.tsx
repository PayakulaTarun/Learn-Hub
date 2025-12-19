import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { X, Lock, Play, ArrowRight, UserPlus, LogIn } from 'lucide-react';

interface AuthGateContextType {
  openGate: (triggerAction?: string) => void;
  closeGate: () => void;
  isGateOpen: boolean;
  triggerAction: string | null;
}

const AuthGateContext = createContext<AuthGateContextType | undefined>(undefined);

export function AuthGateProvider({ children }: { children: React.ReactNode }) {
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [triggerAction, setTriggerAction] = useState<string | null>(null);
  const router = useRouter();

  // Close gate on route change
  useEffect(() => {
    setIsGateOpen(false);
    setTriggerAction(null);
  }, [router.asPath]);

  const openGate = (action: string = 'continue') => {
    setTriggerAction(action);
    setIsGateOpen(true);
  };

  const closeGate = () => {
    setIsGateOpen(false);
    setTimeout(() => setTriggerAction(null), 300); // Clear after animation
  };

  return (
    <AuthGateContext.Provider value={{ openGate, closeGate, isGateOpen, triggerAction }}>
      {children}
      <AuthGateModal isOpen={isGateOpen} onClose={closeGate} triggerAction={triggerAction} />
    </AuthGateContext.Provider>
  );
}

export const useAuthGate = () => {
  const context = useContext(AuthGateContext);
  if (context === undefined) {
    throw new Error('useAuthGate must be used within an AuthGateProvider');
  }
  return context;
};

// --- AUTH GATE MODAL COMPONENT ---

interface AuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerAction: string | null;
}

function AuthGateModal({ isOpen, onClose, triggerAction }: AuthGateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-ui-dark border border-ui-border w-full max-w-md rounded-[2rem] shadow-2xl p-1 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary hover:bg-ui-card rounded-full transition-all z-20"
        >
          <X size={20} />
        </button>

        <div className="p-8 pb-10 text-center relative">
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
          
          {/* Icon */}
          <div className="w-20 h-20 bg-ui-card border-4 border-ui-dark rounded-full shadow-glow-indigo mx-auto flex items-center justify-center mb-6 relative z-10">
             <div className="absolute inset-0 bg-accent/20 rounded-full animate-pulse"></div>
             <Lock className="w-8 h-8 text-accent" />
          </div>

          {/* Text */}
          <h2 className="text-2xl font-black text-text-primary mb-2 tracking-tight">
            Unlock Full Access
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-8 max-w-[80%] mx-auto">
            You need a free account to {triggerAction || 'access this feature'}. Join 1000+ engineers mastering the stack.
          </p>

          {/* Feature List (Micro) */}
          <div className="grid grid-cols-2 gap-3 mb-8 text-left max-w-xs mx-auto">
             <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-text-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow-emerald"></div>
                Run Code
             </div>
             <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-text-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-glow-blue"></div>
                Track Progress
             </div>
             <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-text-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-glow-rose"></div>
                Solve Problems
             </div>
             <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-text-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-glow-orange"></div>
                Save Solutions
             </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
             <Link 
                href="/auth/signup"
                className="flex items-center justify-center gap-3 w-full py-3.5 bg-accent text-primary font-black uppercase text-xs tracking-widest rounded-xl hover:bg-highlight transition-all shadow-lg hover:scale-[1.02]"
                onClick={onClose} // Let navigation handle it
             >
                <UserPlus size={16} /> Create Free Account
             </Link>
             
             <Link 
                href="/auth/login"
                className="flex items-center justify-center gap-3 w-full py-3.5 bg-ui-card border border-ui-border text-text-primary font-black uppercase text-xs tracking-widest rounded-xl hover:bg-ui-border transition-all hover:scale-[1.02]"
                onClick={onClose}
             >
                <LogIn size={16} /> Sign In
             </Link>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-ui-card/50 p-4 border-t border-ui-border text-center">
            <p className="text-[10px] text-text-muted font-medium">
                No credit card required. Free forever for students.
            </p>
        </div>
      </div>
    </div>
  );
}
