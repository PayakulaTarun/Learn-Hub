import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ShieldCheck, Sparkles, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabase';

export default function VerificationHandler() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Supabase automatically handles the hash in the URL on verification click
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email_confirmed_at) {
        setStatus('success');
        // Check if profile setup is needed
        const { data: profile } = await supabase
          .from('profiles')
          .select('target_roles')
          .single();

        setTimeout(() => {
          if (profile && profile.target_roles && profile.target_roles.length > 0) {
            router.push('/profile');
          } else {
            router.push('/profile/setup');
          }
        }, 3000);
      } else {
        // Not verified yet or error in session
        const { error } = await supabase.auth.refreshSession();
        if (error) {
          setStatus('error');
          setErrorMessage(error.message);
        } else {
          // Check again after refresh
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email_confirmed_at) {
            setStatus('success');
            setTimeout(() => router.push('/profile/setup'), 3000);
          } else {
            setStatus('error');
            setErrorMessage("Verification link expired or invalid.");
          }
        }
      }
    };

    checkSession();
  }, [router]);

  return (
    <Layout>
      <Head>
        <title>Authenticating Identity | Student Resource Hub</title>
      </Head>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-ui-card border border-ui-border rounded-[3rem] p-12 text-center shadow-2xl">
          
          {status === 'verifying' && (
            <div className="animate-in fade-in duration-500">
               <div className="w-20 h-20 bg-highlight/20 text-highlight rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Loader2 className="w-10 h-10 animate-spin" />
               </div>
               <h1 className="text-2xl font-black text-text-primary mb-4">Securing Identity</h1>
               <p className="text-text-secondary text-sm leading-relaxed">
                 We are validating your cryptographic signature and establishing your learning vault...
               </p>
            </div>
          )}

          {status === 'success' && (
            <div className="animate-in zoom-in-95 duration-500">
               <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow-emerald">
                  <CheckCircle2 className="w-10 h-10" />
               </div>
               <h1 className="text-3xl font-black text-text-primary mb-4 tracking-tight">Identity Verified</h1>
               <p className="text-text-secondary text-sm leading-relaxed mb-8">
                 Your pillar is secure. Redirecting you to the Profile Setup Wizard to calibrate your roadmap...
               </p>
               <div className="flex justify-center">
                  <div className="h-1 w-24 bg-ui-border rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 animate-progress"></div>
                  </div>
               </div>
            </div>
          )}

          {status === 'error' && (
            <div className="animate-in shake duration-500">
               <div className="w-20 h-20 bg-rose-500/20 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow-rose">
                  <ShieldCheck className="w-10 h-10" />
               </div>
               <h1 className="text-2xl font-black text-text-primary mb-4">Access Denied</h1>
               <p className="text-rose-400 text-sm font-medium mb-8">
                 {errorMessage || "The verification signature has expired or is invalid."}
               </p>
               <button 
                 onClick={() => router.push('/auth/signup')}
                 className="w-full py-4 bg-ui-dark border border-ui-border rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-ui-border transition-all"
               >
                 Try Re-registering <ArrowRight size={18} />
               </button>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
