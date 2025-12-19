import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  User, ShieldCheck, Star, 
  Flame, Trophy, BookOpen, 
  Settings, LogOut, ChevronRight,
  Target, Rocket, CheckCircle2,
  Lock, Calendar, Zap, Sparkles,
  Clock, Swords
} from 'lucide-react';
import LayoutComponent from '../../components/Layout';
import { useAuth } from '../../components/Auth/AuthContext';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function ProfileDashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [xpData, setXpData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');

    const fetchUserData = async () => {
      if (!user) return;
      
      const [profileRes, xpRes, statsRes, eventsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('user_xp').select('*').eq('user_id', user.id).single(),
        supabase.from('user_learning_stats').select('*').eq('user_id', user.id).single(),
        supabase.from('user_activity_events').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (xpRes.data) setXpData(xpRes.data);
      
      // Merge all stats for easier display
      setProfile((prev: any) => ({
        ...prev,
        stats: statsRes.data || { total_time_spent_ms: 0, problems_solved_count: 0, tutorials_completed_count: 0 },
        recentEvents: eventsRes.data || []
      }));
      
      setLoading(false);
    };

    if (user) fetchUserData();
  }, [user, authLoading, router]);

  if (authLoading || loading) return null;

  return (
    <LayoutComponent>
      <Head>
        <title>Intelligence Vault | {profile?.full_name || 'User'}</title>
      </Head>
      <div className="bg-primary min-h-screen text-text-primary">
        
        {/* Profile Header */}
        <section className="relative pt-16 pb-32 overflow-hidden border-b border-ui-border">
          <div className="absolute inset-0 bg-accent/5 radial-gradient opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            
            <div className="flex flex-col md:flex-row items-center gap-10">
               {/* Avatar State */}
               <div className="relative">
                  <div className="w-40 h-40 bg-ui-card border-4 border-ui-border rounded-full flex items-center justify-center p-2 relative shadow-glow-indigo/20">
                     <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-rose-600 rounded-full flex items-center justify-center text-white text-5xl font-black">
                        {profile?.full_name?.charAt(0) || 'U'}
                     </div>
                     {profile?.is_verified && (
                       <div className="absolute bottom-2 right-2 p-2 bg-emerald-500 text-primary rounded-full border-4 border-ui-dark shadow-glow-emerald">
                          <ShieldCheck size={20} />
                       </div>
                     )}
                  </div>
                  <div className="absolute -top-4 -right-4 px-4 py-1.5 bg-rose-500 text-primary text-[10px] font-black uppercase tracking-tighter rounded-full border-2 border-ui-dark shadow-glow-rose">
                     Lvl {xpData?.level || 1}
                  </div>
               </div>

               <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                     <h1 className="text-4xl md:text-5xl font-black tracking-tight">{profile?.full_name}</h1>
                     <div className="flex items-center gap-2 px-3 py-1 bg-ui-card border border-ui-border rounded-lg text-xs font-bold text-text-muted mx-auto md:mx-0">
                        <Lock size={12} /> {user?.email}
                     </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
                     {profile?.target_roles?.map((role: string) => (
                       <span key={role} className="px-4 py-1.5 bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 rounded-full text-[10px] font-black uppercase tracking-widest">{role}</span>
                     ))}
                     <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">{profile?.skill_level}</span>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button className="p-4 bg-ui-card border border-ui-border rounded-2xl text-text-muted hover:text-text-primary transition-all">
                     <Settings size={22} />
                  </button>
                  <button 
                    onClick={() => signOut().then(() => router.push('/'))}
                    className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 hover:bg-rose-500 hover:text-primary transition-all shadow-glow-rose-sm"
                  >
                     <LogOut size={22} />
                  </button>
               </div>
            </div>

          </div>
        </section>

        {/* Intelligence Quadrants */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
               <div className="bg-ui-card border border-ui-border p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                     <Flame className="w-24 h-24 text-orange-500" />
                  </div>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Focus Streak</p>
                  <div className="flex items-end gap-3 mb-2">
                     <span className="text-5xl font-black text-orange-500">{xpData?.streak_days || 0}</span>
                     <span className="text-xl font-bold text-text-muted mb-1">Days</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">Maintaining architectural consistency.</p>
               </div>

               <div className="bg-ui-card border border-ui-border p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                     <Clock className="w-24 h-24 text-indigo-500" />
                  </div>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Study Time</p>
                  <div className="flex items-end gap-3 mb-2">
                     <span className="text-5xl font-black text-indigo-500">
                        {Math.floor((profile?.stats?.total_time_spent_ms || 0) / (1000 * 60 * 60))}
                     </span>
                     <span className="text-xl font-bold text-text-muted mb-1">Hours</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">Deep-work engineering hours logged.</p>
               </div>

               <div className="bg-ui-card border border-ui-border p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                     <Target className="w-24 h-24 text-emerald-500" />
                  </div>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Pillars Mastered</p>
                  <div className="flex items-end gap-3 mb-2">
                     <span className="text-5xl font-black text-emerald-500">{profile?.stats?.tutorials_completed_count || 0}</span>
                     <span className="text-xl font-bold text-text-muted mb-1">Topics</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">Core conceptual pillars stabilized.</p>
               </div>

               <div className="bg-ui-card border border-ui-border p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                     <Swords className="w-24 h-24 text-rose-500" />
                  </div>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Problems Solved</p>
                  <div className="flex items-end gap-3 mb-2">
                     <span className="text-5xl font-black text-rose-500">{profile?.stats?.problems_solved_count || 0}</span>
                     <span className="text-xl font-bold text-text-muted mb-1">Solved</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">Challenges crushed in the field.</p>
               </div>
            </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Progress & Paths */}
              <div className="lg:col-span-2 space-y-8">
                 <div className="bg-ui-card border border-ui-border p-10 rounded-[3rem] shadow-2xl">
                    <div className="flex justify-between items-center mb-10">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center">
                             <Target size={22} />
                          </div>
                          <h2 className="text-2xl font-black tracking-tight">Active Roadmap</h2>
                       </div>
                       <Link href="/navigator" className="text-xs font-black uppercase text-highlight hover:underline tracking-widest">Open Navigator</Link>
                    </div>

                    <div className="p-8 bg-ui-dark border border-ui-border rounded-[2rem] relative overflow-hidden group mb-6">
                       <div className="relative z-10">
                          <h3 className="text-xl font-bold mb-2">Technical Software Architect</h3>
                          <p className="text-sm text-text-muted mb-6">Global standard path for Full-Stack Scalability.</p>
                          <div className="flex items-center gap-10">
                             <div className="flex-1">
                                <div className="flex justify-between text-[10px] font-black uppercase mb-2 tracking-widest text-text-muted">
                                   <span>Stage 3: Distributed Systems</span>
                                   <span>65%</span>
                                </div>
                                <div className="h-3 bg-primary rounded-full overflow-hidden border border-ui-border">
                                   <div className="h-full bg-gradient-to-r from-indigo-500 to-rose-500 shadow-glow-indigo" style={{ width: '65%' }}></div>
                                </div>
                             </div>
                             <div className="w-14 h-14 bg-accent/20 text-accent rounded-2xl flex items-center justify-center shadow-glow-indigo group-hover:scale-110 transition-all cursor-pointer">
                                <ChevronRight />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-ui-card border border-ui-border p-10 rounded-[3rem] shadow-2xl">
                    <div className="flex items-center gap-4 mb-10">
                       <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                          <BookOpen size={22} />
                       </div>
                       <h2 className="text-2xl font-black tracking-tight">Recent Activity</h2>
                    </div>
                    
                     <div className="space-y-4">
                        {profile?.recentEvents?.length > 0 ? (
                          profile.recentEvents.map((item: any, i: number) => {
                            const eventConfigs: Record<string, { icon: any, color: string, label: string }> = {
                              solve: { icon: Target, color: 'text-rose-400', label: 'Solved' },
                              view: { icon: BookOpen, color: 'text-indigo-400', label: 'Viewed' },
                              run: { icon: Zap, color: 'text-orange-400', label: 'Practiced' },
                              test_attempt: { icon: Trophy, color: 'text-emerald-400', label: 'Tested' },
                            };
                            
                            const config = eventConfigs[item.event_type] || { icon: Sparkles, color: 'text-text-muted', label: 'Activity' };
                            const Icon = config.icon;
                            return (
                              <div key={i} className="flex items-center gap-6 p-6 bg-ui-dark border border-ui-border rounded-2xl hover:border-ui-border transition-all">
                                 <div className={`w-12 h-12 bg-ui-card border border-ui-border rounded-xl flex items-center justify-center ${config.color}`}>
                                    <Icon size={20} />
                                 </div>
                                 <div className="flex-1">
                                    <h4 className="font-bold">{item.entity_id}</h4>
                                    <p className="text-xs text-text-muted uppercase tracking-widest font-black mt-1">
                                       {config.label} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                 </div>
                                 <ChevronRight className="text-text-muted" size={16} />
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-12 text-text-muted italic border-2 border-dashed border-ui-border rounded-[2rem]">
                             No recent mission activity detected.
                          </div>
                        )}
                     </div>
                 </div>
              </div>

              {/* Right Column: Achievements & Stats */}
              <div className="space-y-8">
                 <div className="bg-ui-card border border-ui-border p-8 rounded-[3rem] shadow-2xl">
                    <h2 className="text-xl font-black tracking-tight mb-8 flex items-center gap-3">
                       <Trophy className="text-rose-500" size={24} /> Achievements
                    </h2>
                    <div className="grid grid-cols-3 gap-6">
                       {[1, 2, 3, 4, 5, 6].map(i => (
                         <div key={i} className="aspect-square bg-ui-dark border border-ui-border rounded-2xl flex items-center justify-center relative group cursor-help">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-lg shadow-glow-rose scale-90 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                               <Sparkles className="text-primary w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                         </div>
                       ))}
                    </div>
                    <button className="w-full mt-8 py-3 bg-ui-dark border border-ui-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-all">View Hall of Fame</button>
                 </div>

                 <div className="bg-indigo-600 border border-indigo-400 p-10 rounded-[3rem] shadow-glow-indigo relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                       <Rocket className="w-40 h-40 text-white" />
                    </div>
                    <div className="relative z-10">
                       <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">Mission <br />Planner</h2>
                       <p className="text-white/80 text-sm mb-10 leading-relaxed font-medium">You have 12 hours scheduled this week. 4 hours remaining to hit target.</p>
                       <div className="flex gap-4">
                          <Link href="/navigator/planner" className="px-6 py-3 bg-white text-indigo-600 font-black rounded-2xl shadow-xl hover:scale-105 transition-all text-xs uppercase tracking-widest">
                             Launch
                          </Link>
                          <div className="flex items-center gap-2 text-white/60">
                             <Calendar size={18} />
                             <span className="text-[10px] font-black uppercase tracking-widest">Daily Log</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

        </section>
      </div>
    </LayoutComponent>
  );
}
