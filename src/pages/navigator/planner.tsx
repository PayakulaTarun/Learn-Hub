
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { 
  Calendar, Clock, Target, Rocket, 
  ArrowRight, CheckCircle, ChevronRight, 
  Settings, BookOpen, Terminal, Sparkles,
  ArrowLeft
} from 'lucide-react';
import { roadmaps } from '../../lib/roadmaps';
import { generatePlan, StudyPlan } from '../../lib/planner';
import Link from 'next/link';

import { useAuth } from '../../context/AuthContext'; // UPDATED
import { useRouter } from 'next/router';

export default function PlannerPage() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState(roadmaps[0].id);
  const [duration, setDuration] = useState(4); // weeks
  const [hours, setHours] = useState(2); // daily
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  
  const { user } = useAuth();
  const router = useRouter();

  const handleGenerate = () => {
    if (!user) {
        if(confirm('Login to save your study plan?')) router.push('/login');
        return;
    }

    const selectedRoadmap = roadmaps.find(r => r.id === goal);
    if (selectedRoadmap) {
      const newPlan = generatePlan(selectedRoadmap, duration, hours);
      setPlan(newPlan);
      setStep(3);
    }
  };

  return (
    <Layout title="Smart Planner | Student Resource Hub">
      <div className="bg-primary min-h-screen pb-20">
        
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Steps Progress */}
            <div className="flex items-center justify-between mb-16 relative">
               <div className="absolute top-1/2 left-0 w-full h-0.5 bg-ui-border -z-10 -translate-y-1/2"></div>
               {[1, 2, 3].map(i => (
                 <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-500 bg-primary ${
                   step >= i ? 'border-accent text-accent shadow-glow' : 'border-ui-border text-text-muted'
                 }`}>
                   {i}
                 </div>
               ))}
            </div>

            {step === 1 && (
              <div className="bg-ui-card border border-ui-border rounded-[2.5rem] p-12 shadow-2xl animate-in slide-in-from-bottom-4">
                <h1 className="text-3xl font-bold mb-8">What is your target <span className="text-accent">Goal</span>?</h1>
                <div className="grid gap-4 mb-12">
                   {roadmaps.map(r => (
                     <button 
                      key={r.id}
                      onClick={() => { setGoal(r.id); setStep(2); }}
                      className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${
                        goal === r.id ? 'border-accent bg-accent/5' : 'border-ui-border hover:border-text-muted'
                      }`}
                     >
                       <div className="text-left">
                          <p className="font-bold text-text-primary">{r.title}</p>
                          <p className="text-xs text-text-muted">{r.description.substring(0, 60)}...</p>
                       </div>
                       <ChevronRight className="w-5 h-5 text-text-muted" />
                     </button>
                   ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-ui-card border border-ui-border rounded-[2.5rem] p-12 shadow-2xl animate-in slide-in-from-bottom-4">
                <button onClick={() => setStep(1)} className="text-xs font-bold text-text-muted hover:text-accent mb-6 flex items-center gap-1">
                   <ArrowLeft className="w-3 h-3" /> Back
                </button>
                <h1 className="text-3xl font-bold mb-8">Set your <span className="text-highlight">Schedule</span></h1>
                
                <div className="space-y-8 mb-12">
                   <div className="space-y-4">
                      <div className="flex justify-between">
                         <label className="text-sm font-bold text-text-secondary uppercase tracking-widest">Total Duration (Weeks)</label>
                         <span className="text-accent font-bold">{duration} Weeks</span>
                      </div>
                      <input type="range" min="1" max="12" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full accent-accent" />
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between">
                         <label className="text-sm font-bold text-text-secondary uppercase tracking-widest">Hours Available Per Day</label>
                         <span className="text-highlight font-bold">{hours} Hours</span>
                      </div>
                      <input type="range" min="1" max="8" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full accent-highlight" />
                   </div>
                </div>

                <button 
                  onClick={handleGenerate}
                  className="w-full py-4 bg-highlight text-primary font-bold rounded-2xl shadow-glow-blue flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
                >
                  Generate My Plan <Sparkles className="w-5 h-5" />
                </button>
              </div>
            )}

            {step === 3 && plan && (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                 <div className="flex justify-between items-end mb-8">
                    <div>
                       <h2 className="text-4xl font-extrabold text-text-primary mb-2">Your 7-Day <span className="text-accent">Sprint</span></h2>
                       <p className="text-text-muted">Optimized for {roadmaps.find(r => r.id === goal)?.title}</p>
                    </div>
                    <button onClick={() => setStep(2)} className="px-4 py-2 bg-ui-card border border-ui-border rounded-xl text-xs font-bold hover:bg-ui-dark">
                       Adjust Settings
                    </button>
                 </div>

                 <div className="grid gap-6">
                    {plan.dailyTasks.slice(0, 7).map((task, i) => (
                      <div key={i} className="bg-ui-card border border-ui-border rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden group hover:border-accent/30 transition-all">
                         <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-tighter mb-1">Day</span>
                            <span className="text-3xl font-black text-accent">{task.day}</span>
                         </div>
                         
                         <div className="flex-1">
                            <div className="flex items-center gap-2 mb-4">
                               <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                                 task.type === 'theory' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-highlight/10 border-highlight/20 text-highlight'
                               }`}>
                                 {task.type.toUpperCase()}
                               </span>
                            </div>
                            <div className="space-y-4">
                               {task.topics.map(topic => (
                                 <div key={topic.id} className="flex justify-between items-center group/item">
                                    <div className="flex items-center gap-3">
                                       <div className="w-6 h-6 rounded-full border border-ui-border flex items-center justify-center group-hover/item:border-accent">
                                          <div className="w-2 h-2 rounded-full bg-accent opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                                       </div>
                                       <span className="text-sm font-semibold">{topic.title}</span>
                                    </div>
                                    <Link 
                                      href={`/learn/${topic.role}/${topic.domain}/${topic.id}`}
                                      className="p-2 text-text-muted hover:text-accent transition-colors"
                                    >
                                       <ArrowRight className="w-4 h-4" />
                                    </Link>
                                 </div>
                               ))}
                            </div>
                         </div>

                         {i % 4 === 0 && (
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                               <Rocket className="w-24 h-24" />
                            </div>
                         )}
                      </div>
                    ))}
                 </div>

                 <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[2rem] flex items-center gap-6">
                    <div className="p-4 bg-emerald-500 text-primary rounded-2xl shadow-glow">
                       <CheckCircle className="w-8 h-8" />
                    </div>
                    <div>
                       <h4 className="text-xl font-bold text-emerald-400">Week 1 Goal</h4>
                       <p className="text-text-secondary text-sm">Master the foundations of semantic structure and time complexity.</p>
                    </div>
                 </div>
              </div>
            )}

          </div>
        </section>

      </div>
    </Layout>
  );
}
