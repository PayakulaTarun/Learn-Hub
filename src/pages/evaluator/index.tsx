
import React from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { 
  Trophy, Swords, ClipboardCheck, Sparkles, 
  ArrowRight, Users, Zap, Search, 
  TrendingUp, BarChart, Target, Rocket
} from 'lucide-react';
import { companies, mockExams } from '../../lib/evaluatorData';

export default function EvaluatorHub() {
  return (
    <Layout title="Evaluator | Proof of Readiness">
      <div className="bg-ui-dark min-h-screen text-text-primary">
        
        {/* Modern Hero Section */}
        <section className="relative py-24 overflow-hidden border-b border-ui-border bg-gradient-to-b from-primary/50 to-ui-dark">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/20 tracking-widest uppercase mb-8">
              Pillar Three: The Evaluator
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
              Don't Just Learn. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Prove You're Ready.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-text-secondary leading-relaxed">
              Transition from student to professional. Our simulation engines verify your mastery through industrial stress tests.
            </p>
          </div>
        </section>

        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Company Battlegrounds */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl shadow-glow-rose">
                  <Swords className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-black">Company Battlegrounds</h2>
                  <p className="text-text-muted text-sm">Targeted interview simulation for top tech firms.</p>
                </div>
              </div>

              <div className="space-y-12">
                {[
                  { title: 'Product-Based Titans', ids: ['google', 'amazon', 'microsoft', 'meta', 'netflix', 'uber', 'adobe', 'flipkart'] },
                  { title: 'Service-Based Giants', ids: ['tcs', 'infosys', 'wipro', 'accenture'] },
                  { title: 'High-Growth Startups', ids: ['zomato', 'razorpay', 'zoho', 'atlassian'] }
                ].map(cat => (
                  <div key={cat.title}>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted mb-6 flex items-center gap-4">
                      {cat.title} <div className="h-px flex-1 bg-ui-border"></div>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {cat.ids.map(id => {
                        const company = companies.find(c => c.id === id);
                        if (!company) return null;
                        return (
                          <Link 
                            key={id}
                            href={`/evaluator/battlegrounds/${id}`}
                            className="group p-5 bg-ui-card border border-ui-border rounded-2xl hover:border-rose-500/40 transition-all duration-300 shadow-xl relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full -mr-8 -mt-8 group-hover:bg-rose-500/10 transition-colors"></div>
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center font-black text-lg text-text-muted group-hover:text-rose-400 transition-colors">
                                {company.name[0]}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold group-hover:text-rose-400 transition-colors">{company.name}</h4>
                                <p className="text-[10px] text-text-muted font-medium">{company.hiringPattern.questionTypes[0]} Focus</p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exam Simulation */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-orange-500/20 text-orange-400 rounded-2xl shadow-glow">
                  <ClipboardCheck className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-black">Exam Simulations</h2>
                  <p className="text-text-muted text-sm">High-fidelity mocks for GATE & University tests.</p>
                </div>
              </div>

              <div className="grid gap-4">
                {mockExams.map(exam => (
                  <div key={exam.id} className="bg-ui-card border border-ui-border rounded-[2rem] p-8 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Target className="w-48 h-48" />
                     </div>
                     <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                           <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-black rounded border border-emerald-500/20 uppercase tracking-widest">Live Now</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{exam.title}</h3>
                        <p className="text-sm text-text-secondary leading-relaxed mb-6">
                           {exam.description}
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                           <div className="bg-primary/30 p-4 rounded-2xl border border-ui-border">
                              <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Duration</p>
                              <p className="text-lg font-black text-orange-400">{exam.durationMinutes}m</p>
                           </div>
                           <div className="bg-primary/30 p-4 rounded-2xl border border-ui-border">
                              <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Pass Benchmark</p>
                              <p className="text-lg font-black text-emerald-400">75%</p>
                           </div>
                        </div>
                        <Link 
                          href={`/evaluator/mock-test/${exam.id}`}
                          className="w-full py-4 bg-orange-500 text-primary font-black rounded-2xl shadow-glow-orange flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
                        >
                           Begin Locked Session <Rocket className="w-5 h-5" />
                        </Link>
                     </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* AI Analytics Teaser */}
        <section className="py-20 border-t border-ui-border bg-gradient-to-t from-primary/30 to-transparent">
           <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-highlight/10 border border-highlight/20 rounded-2xl text-highlight mb-8">
                 <Sparkles className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-widest">AI Readiness Insights</span>
              </div>
              <h2 className="text-4xl font-bold mb-12">Performance Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 {[
                   { label: 'Overall Accuracy', value: '0%', icon: Target, color: 'text-rose-400' },
                   { label: 'Avg Solve Speed', value: 'N/A', icon: Zap, color: 'text-yellow-400' },
                   { label: 'Code Quality Score', value: '0', icon: BarChart, color: 'text-emerald-400' },
                   { label: 'Readiness Index', value: 'Not Started', icon: TrendingUp, color: 'text-highlight' },
                 ].map((stat, i) => (
                   <div key={i} className="bg-ui-card border border-ui-border p-8 rounded-3xl">
                      <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-4`} />
                      <p className="text-sm font-bold text-text-muted mb-1 uppercase">{stat.label}</p>
                      <p className="text-2xl font-black">{stat.value}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

      </div>
    </Layout>
  );
}
