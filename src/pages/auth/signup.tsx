import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Layout from '../../components/Layout';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/verify`,
        },
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-ui-card border border-ui-border rounded-[2.5rem] p-12 text-center shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-rose-500/20 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow-rose">
              <Mail className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-text-primary mb-4 tracking-tight">Verify Your Email</h1>
            <p className="text-text-secondary leading-relaxed mb-8">
              We've sent a verification link to <span className="text-rose-400 font-bold">{email}</span>. 
              Please click the link to activate your account and access the Battlegrounds.
            </p>
            <Link 
              href="/auth/login"
              className="inline-flex items-center gap-2 text-rose-400 font-bold hover:gap-3 transition-all"
            >
              Back to Login <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Join Student Resource Hub | Secure Identity</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center p-4 bg-primary/30">
        <div className="max-w-xl w-full">
          <div className="bg-ui-card border border-ui-border rounded-[3rem] p-10 lg:p-16 shadow-2xl relative overflow-hidden">
            {/* Decal */}
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <ShieldCheck className="w-64 h-64 text-rose-500" />
            </div>

            <div className="relative">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center shadow-glow-rose">
                  <Sparkles className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-text-primary tracking-tight">Create Identity</h1>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Pillar Five: The User Profile</p>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-medium animate-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-rose-500 transition-colors" size={20} />
                    <input 
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-primary/40 border border-ui-border focus:border-rose-500/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all text-text-primary placeholder:text-text-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-rose-500 transition-colors" size={20} />
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full bg-primary/40 border border-ui-border focus:border-rose-500/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all text-text-primary placeholder:text-text-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Secure Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-rose-500 transition-colors" size={20} />
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-primary/40 border border-ui-border focus:border-rose-500/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all text-text-primary placeholder:text-text-muted"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-rose-500 text-primary font-black rounded-2xl shadow-glow-rose hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? 'Initializing...' : (
                    <>
                      Begin Journey <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10 text-center">
                <p className="text-sm text-text-muted">
                  Already have an account? <Link href="/auth/login" className="text-rose-400 font-bold hover:underline">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
