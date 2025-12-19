import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  Rocket, Target, Clock, Star, 
  ChevronRight, ArrowLeft, Trophy, Layers,
  CheckCircle2, Compass
} from 'lucide-react';
import Layout from '../../components/Layout';
import { useAuth } from '../../components/Auth/AuthContext';
import { supabase } from '../../lib/supabase';

const ROLES = [
  'Full Stack Developer', 'Frontend Specialist', 'Backend Engineer', 
  'Data Scientist', 'DevOps Architect', 'AI Engineer', 
  'UI/UX Designer', 'Product Manager'
];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const AVAILABILITY = ['< 5 hours/week', '10-20 hours/week', 'Full-time Immersion'];

export default function ProfileSetup() {
  const { user, isVerified, loading: authLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    target_roles: [] as string[],
    career_goal: '',
    skill_level: '',
    time_availability: ''
  });

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
    if (!authLoading && user && !isVerified) router.push('/auth/signup');
  }, [user, isVerified, authLoading, router]);

  const toggleRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      target_roles: prev.target_roles.includes(role) 
        ? prev.target_roles.filter(r => r !== role)
        : [...prev.target_roles, role]
    }));
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          is_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;
      router.push('/profile');
    } catch (err) {
      console.error(err);
      alert('Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <Layout>
      <Head>
        <title>Setup Your Identity | LearnHub</title>
      </Head>
      <div className="min-h-screen py-12 px-4 bg-primary/30 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          
          {/* Progress Header */}
          <div className="flex justify-between items-center mb-12 px-8">
            <div className="flex gap-4">
              {[1, 2, 3].map(s => (
                <div 
                  key={s}
                  className={`h-2 w-16 rounded-full transition-all duration-500 ${
                    step >= s ? 'bg-highlight shadow-glow-blue' : 'bg-ui-border'
                  }`}
                ></div>
              ))}
            </div>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Calibration Module {step}/3</span>
          </div>

          <div className="bg-ui-card border border-ui-border rounded-[3rem] p-10 lg:p-16 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col">
            
            {/* Step 1: Career Role */}
            {step === 1 && (
              <div className="animate-in slide-in-from-right-8 duration-500 flex-1">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-highlight/20 text-highlight rounded-2xl flex items-center justify-center">
                    <Compass className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-text-primary tracking-tight">What's your destination?</h1>
                    <p className="text-text-secondary text-sm">Select the roles you are aiming for.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                  {ROLES.map(role => (
                    <button
                      key={role}
                      onClick={() => toggleRole(role)}
                      className={`p-6 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group ${
                        formData.target_roles.includes(role)
                        ? 'bg-highlight/10 border-highlight text-highlight shadow-glow-sm'
                        : 'bg-primary/20 border-ui-border text-text-muted hover:border-text-secondary'
                      }`}
                    >
                      <span className="text-sm font-bold">{role}</span>
                      {formData.target_roles.includes(role) && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Proficiency */}
            {step === 2 && (
              <div className="animate-in slide-in-from-right-8 duration-500 flex-1">
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-14 h-14 bg-accent/20 text-accent rounded-2xl flex items-center justify-center">
                    <Rocket className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-text-primary tracking-tight">Current Altitude</h1>
                    <p className="text-text-secondary text-sm">Where are you starting your journey from?</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4 block mb-4">Starting Proficiency</label>
                    <div className="flex flex-wrap gap-4">
                      {SKILL_LEVELS.map(level => (
                        <button
                          key={level}
                          onClick={() => setFormData({...formData, skill_level: level})}
                          className={`px-8 py-4 rounded-2xl border font-bold transition-all ${
                            formData.skill_level === level
                            ? 'bg-accent/10 border-accent text-accent shadow-glow-sm'
                            : 'bg-primary/20 border-ui-border text-text-muted hover:border-text-secondary'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-4 block mb-4">Primary Learning Goal</label>
                    <textarea 
                      value={formData.career_goal}
                      onChange={(e) => setFormData({...formData, career_goal: e.target.value})}
                      placeholder="e.g. Master React to land a SDE-1 role at a high-growth startup..."
                      className="w-full bg-primary/40 border border-ui-border rounded-2xl p-6 outline-none focus:border-accent transition-all text-text-primary h-32"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Commitment */}
            {step === 3 && (
              <div className="animate-in slide-in-from-right-8 duration-500 flex-1">
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-text-primary tracking-tight">Mission Schedule</h1>
                    <p className="text-text-secondary text-sm">How much bandwidth do you have for this sprint?</p>
                  </div>
                </div>

                <div className="grid gap-6">
                  {AVAILABILITY.map(val => (
                    <button
                      key={val}
                      onClick={() => setFormData({...formData, time_availability: val})}
                      className={`p-8 rounded-[2rem] border text-left transition-all flex items-center justify-between group ${
                        formData.time_availability === val
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-glow-emerald'
                        : 'bg-primary/20 border-ui-border text-text-muted hover:border-text-secondary'
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all ${
                          formData.time_availability === val ? 'border-emerald-500' : 'border-ui-border'
                        }`}>
                          {formData.time_availability === val && <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>}
                        </div>
                        <span className="text-xl font-bold">{val}</span>
                      </div>
                      <ChevronRight className={`w-6 h-6 transition-transform ${formData.time_availability === val ? 'translate-x-2' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-16 flex justify-between items-center pt-8 border-t border-ui-border">
              {step > 1 ? (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 text-text-muted font-bold hover:text-text-primary transition-colors"
                >
                  <ArrowLeft size={20} /> Previous
                </button>
              ) : <div></div>}

              {step < 3 ? (
                <button 
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 ? formData.target_roles.length === 0 : !formData.skill_level}
                  className="px-10 py-5 bg-ui-dark border border-ui-border rounded-2xl text-text-primary font-black flex items-center gap-3 hover:bg-ui-border transition-all disabled:opacity-50"
                >
                  Continue <ChevronRight size={20} />
                </button>
              ) : (
                <button 
                  onClick={handleComplete}
                  disabled={loading || !formData.time_availability}
                  className="px-12 py-5 bg-highlight text-primary font-black rounded-2xl shadow-glow-blue hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {loading ? 'Finalizing...' : (
                    <>
                      Go to Dashboard <Rocket size={20} />
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
