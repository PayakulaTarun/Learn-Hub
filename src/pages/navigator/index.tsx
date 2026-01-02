
import React from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { 
  Compass, Map as MapIcon, Calendar, Target, 
  ArrowRight, Users, Trophy, BookOpen,
  Layout as LayoutIcon, Database, Cpu, Search, 
  Layers, Settings
} from 'lucide-react';
import { roadmaps } from '../../lib/roadmaps';

export default function NavigatorHub() {
  return (
    <Layout title="Navigator | Your Career GPS">
      <div className="bg-primary min-h-screen text-text-primary">
        
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden border-b border-ui-border">
          <div className="absolute inset-0 bg-accent/5 radial-gradient opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-highlight/20 text-highlight border border-highlight/20 tracking-widest uppercase mb-8 animate-pulse">
              Pillar Two: The Navigator
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              Stop Guessing. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-highlight">Start Journeying.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-text-secondary leading-relaxed">
              Eliminate analysis paralysis. Our intelligent navigator maps your career goals to a structured, step-by-step learning path.
            </p>
          </div>
        </section>

        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Career Roadmaps */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-accent/20 text-accent rounded-2xl">
                  <MapIcon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Role Roadmaps</h2>
                  <p className="text-text-muted text-sm">Industrial paths designed for specific careers.</p>
                </div>
              </div>

              <div className="grid gap-6">
                {roadmaps.map(roadmap => (
                  <Link 
                    key={roadmap.id} 
                    href={`/navigator/roadmaps/${roadmap.id}`}
                    className="group bg-ui-card border border-ui-border p-8 rounded-3xl hover:border-accent/40 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-accent/10 transition-colors"></div>
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl font-bold group-hover:text-accent transition-colors">{roadmap.title}</h3>
                      <ArrowRight className="w-6 h-6 text-text-muted group-hover:text-accent group-hover:translate-x-2 transition-all" />
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed mb-6 line-clamp-2">
                       {roadmap.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {roadmap.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="text-[10px] font-bold text-text-muted bg-primary/40 px-2.5 py-1 rounded-md border border-ui-border">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Smart Planner Card */}
            <div className="bg-ui-dark border border-ui-border rounded-[2.5rem] p-12 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <Calendar className="w-64 h-64 text-highlight" />
              </div>
              
              <div className="relative">
                <div className="w-16 h-16 bg-highlight/20 text-highlight flex items-center justify-center rounded-2xl mb-8">
                  <Settings className="w-10 h-10" />
                </div>
                <h2 className="text-4xl font-extrabold mb-6 leading-tight">Smart Study <br />Planner</h2>
                <p className="text-lg text-text-secondary mb-10 leading-relaxed">
                  Have a specific deadline or limited hours? Tell our AI-driven planner your goal and schedule, and we'll generate a custom day-by-day plan for you.
                </p>
                
                <ul className="space-y-4 mb-12">
                   <li className="flex items-center gap-3 text-sm font-medium text-text-primary">
                      <div className="w-1.5 h-1.5 rounded-full bg-highlight shadow-glow-blue"></div>
                      Auto-balances theory & practice
                   </li>
                   <li className="flex items-center gap-3 text-sm font-medium text-text-primary">
                      <div className="w-1.5 h-1.5 rounded-full bg-highlight shadow-glow-blue"></div>
                      Adjusts dynamically if you miss a day
                   </li>
                   <li className="flex items-center gap-3 text-sm font-medium text-text-primary">
                      <div className="w-1.5 h-1.5 rounded-full bg-highlight shadow-glow-blue"></div>
                      Direct links to all tutorials & labs
                   </li>
                </ul>

                <Link 
                  href="/navigator/planner"
                  className="inline-flex items-center justify-center w-full py-4 bg-highlight text-primary font-bold rounded-2xl shadow-glow-blue hover:scale-[1.02] transition-all gap-3"
                >
                  Launch Planner <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Integration Stats */}
        <section className="py-20 bg-ui-dark/50 border-t border-ui-border">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-extrabold text-accent mb-2">1000+</p>
                <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Guided Topics</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-highlight mb-2">15+</p>
                <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Career Paths</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-emerald-400 mb-2">100%</p>
                <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Integrated</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-rose-400 mb-2">0</p>
                <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Guesswork</p>
              </div>
           </div>
        </section>
      </div>
    </Layout>
  );
}
