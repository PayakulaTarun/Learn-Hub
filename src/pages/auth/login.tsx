import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Layout from '../../components/Layout';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    // 1. Validation
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};
      validation.error.issues.forEach(issue => {
        formattedErrors[String(issue.path[0])] = issue.message;
      });
      setFieldErrors(formattedErrors);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user && !data.user.email_confirmed_at) {
        setError("Your email isn't verified yet. Please check your inbox.");
        return;
      }

      router.push('/profile');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Identity Access | Student Resource Hub</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center p-4 bg-primary/30">
        <div className="max-w-xl w-full">
          <div className="bg-ui-card border border-ui-border rounded-[3rem] p-10 lg:p-16 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5">
              <ShieldCheck className="w-64 h-64 text-indigo-500" />
            </div>

            <div className="relative">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-glow-indigo">
                  <LogIn className="text-white w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-text-primary tracking-tight">Identity Access</h1>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Single Sign-On</p>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-indigo-400 transition-colors" size={20} />
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="jane@example.com"
                      className={`w-full bg-primary/40 border ${fieldErrors.email ? 'border-rose-500' : 'border-ui-border'} focus:border-indigo-500/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all text-text-primary placeholder:text-text-muted`}
                    />
                  </div>
                  {fieldErrors.email && <p className="text-xs text-rose-500 font-bold ml-4">{fieldErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-4">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Password</label>
                    <Link href="/auth/reset" className="text-[10px] font-black text-highlight hover:underline tracking-widest uppercase">Forgot?</Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-indigo-400 transition-colors" size={20} />
                    <input 
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                      className={`w-full bg-primary/40 border ${fieldErrors.password ? 'border-rose-500' : 'border-ui-border'} focus:border-indigo-500/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all text-text-primary placeholder:text-text-muted`}
                    />
                  </div>
                  {fieldErrors.password && <p className="text-xs text-rose-500 font-bold ml-4">{fieldErrors.password}</p>}
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-glow-indigo hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? 'Authenticating...' : (
                    <>
                      Enter Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10 text-center">
                <p className="text-sm text-text-muted">
                  New to Student Resource Hub? <Link href="/auth/signup" className="text-indigo-400 font-bold hover:underline">Create Identity</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
