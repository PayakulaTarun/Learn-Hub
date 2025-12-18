
import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { roadmaps, CareerRoadmap, RoadmapStage, RoadmapTopic } from '../../../lib/roadmaps';
import { useLearningState } from '../../../hooks/useLearningState';
import { 
  ArrowLeft, CheckCircle2, Circle, Lock, 
  MapPin, Clock, Trophy, Zap, ChevronRight,
  BookOpen, Terminal, Code, Settings, Users
} from 'lucide-react';
import Link from 'next/link';

export default function RoadmapPage() {
  const router = useRouter();
  const { role } = router.query;
  const { isCompleted, toggleComplete } = useLearningState();

  const roadmap = useMemo(() => 
    roadmaps.find(r => r.id === role), 
  [role]);

  if (!roadmap) return null;

  // Logic to check if a topic can be unlocked
  const canUnlock = (topicId: string, stageIndex: number, topicIndex: number) => {
    if (stageIndex === 0 && topicIndex === 0) return true;
    
    // Find previous topic
    let prevTopicId = '';
    if (topicIndex > 0) {
      prevTopicId = roadmap.stages[stageIndex].topics[topicIndex - 1].id;
    } else if (stageIndex > 0) {
      const prevStage = roadmap.stages[stageIndex - 1];
      prevTopicId = prevStage.topics[prevStage.topics.length - 1].id;
    }
    
    return isCompleted(prevTopicId);
  };

  return (
    <Layout title={`${roadmap.title} Roadmap | LearnHub`}>
      <div className="bg-primary min-h-screen pb-20">
        
        {/* Sub-Header */}
        <div className="bg-ui-dark border-b border-ui-border sticky top-16 z-30 py-4 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <Link href="/navigator" className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-sm font-bold">
              <ArrowLeft className="w-4 h-4" /> Back to Navigator
            </Link>
            <div className="flex gap-6">
               <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="text-xs font-bold text-text-primary">Est. 240 hrs</span>
               </div>
               <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-highlight" />
                  <span className="text-xs font-bold text-text-primary">8 Certifications</span>
               </div>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <section className="py-20 bg-gradient-to-br from-ui-dark to-primary border-b border-ui-border">
          <div className="max-w-7xl mx-auto px-4">
             <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-6">
                      <Zap className="w-5 h-5 text-accent animate-pulse" />
                      <span className="text-xs font-bold text-accent uppercase tracking-widest">Career Pathway</span>
                   </div>
                   <h1 className="text-4xl md:text-6xl font-extrabold text-text-primary mb-6 leading-tight">
                     Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-highlight">{roadmap.role}</span>
                   </h1>
                   <p className="text-xl text-text-secondary mb-8 leading-relaxed max-w-2xl">
                     {roadmap.description}
                   </p>
                   <div className="flex flex-wrap gap-4">
                      {roadmap.skills.map(skill => (
                        <div key={skill} className="flex items-center gap-2 px-4 py-2 bg-ui-card border border-ui-border rounded-xl text-xs font-bold">
                           <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {skill}
                        </div>
                      ))}
                   </div>
                </div>
                <div className="w-full md:w-80 bg-ui-card rounded-3xl p-8 border border-ui-border relative shadow-2xl overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Settings className="w-48 h-48" />
                   </div>
                   <h3 className="text-sm font-bold text-text-muted uppercase mb-4 tracking-widest">Tech Stack</h3>
                   <div className="grid grid-cols-2 gap-3">
                      {roadmap.tools.map(tool => (
                        <div key={tool} className="p-3 bg-primary/40 text-[10px] font-bold text-text-primary text-center rounded-xl border border-ui-border">
                           {tool}
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Roadmap Steps */}
        <section className="py-20 max-w-4xl mx-auto px-4">
           {roadmap.stages.map((stage, sIdx) => (
             <div key={stage.title} className="mb-16 last:mb-0">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 flex items-center justify-center bg-accent text-primary font-black rounded-2xl shadow-glow">
                      {sIdx + 1}
                   </div>
                   <div>
                      <h2 className="text-2xl font-bold text-text-primary">{stage.title}</h2>
                      <p className="text-text-muted text-sm">{stage.description}</p>
                   </div>
                </div>

                <div className="space-y-4 ml-6 pl-10 border-l-2 border-ui-border relative">
                   {stage.topics.map((topic, tIdx) => {
                      const unlocked = canUnlock(topic.id, sIdx, tIdx);
                      const completed = isCompleted(topic.id);

                      return (
                        <div key={topic.id} className="relative">
                           <div className={`absolute -left-[51px] top-6 w-5 h-5 rounded-full border-4 transition-all duration-500 z-10 ${
                              completed ? 'bg-emerald-500 border-primary' : unlocked ? 'bg-accent border-primary' : 'bg-ui-border border-primary'
                           }`} />
                           
                           <div className={`p-6 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
                              unlocked 
                                ? completed 
                                  ? 'bg-emerald-500/5 border-emerald-500/20' 
                                  : 'bg-ui-card border-ui-border hover:border-accent/40' 
                                : 'bg-primary/20 border-ui-border opacity-60 grayscale cursor-not-allowed'
                           }`}>
                              {!unlocked && (
                                <div className="absolute inset-0 bg-ui-dark/10 backdrop-blur-[1px] flex items-center justify-center z-20">
                                   <div className="flex items-center gap-2 px-3 py-1 bg-ui-dark border border-ui-border rounded-lg shadow-xl">
                                      <Lock className="w-3 h-3 text-text-muted" />
                                      <span className="text-[10px] font-bold text-text-muted tracking-tight">PREREQUISITE REQ</span>
                                   </div>
                                </div>
                              )}

                              <div className="flex justify-between items-start">
                                 <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                       <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                          topic.difficulty === 'Beginner' ? 'text-emerald-400 bg-emerald-500/10' : 
                                          topic.difficulty === 'Intermediate' ? 'text-highlight bg-highlight/10' : 'text-rose-400 bg-rose-500/10'
                                       }`}>
                                          {topic.difficulty}
                                       </span>
                                       <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1">
                                          <Clock className="w-3 h-3" /> {topic.estimatedHours}h
                                       </span>
                                    </div>
                                    <h4 className={`text-lg font-bold mb-4 transition-colors ${completed ? 'text-emerald-400' : 'text-text-primary'}`}>{topic.title}</h4>
                                    
                                    <div className="flex gap-3">
                                       {topic.slug && (
                                         <Link 
                                          href={`/subjects/${topic.slug}`}
                                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${
                                            unlocked ? 'bg-accent text-primary hover:bg-highlight hover:text-white' : 'pointer-events-none'
                                          }`}
                                         >
                                           <BookOpen className="w-3 h-3" /> Learn Theory
                                         </Link>
                                       )}
                                       {(topic.practiceId || topic.projectId) && (
                                         <Link 
                                          href={topic.practiceId ? `/practice/${topic.practiceId}` : topic.projectId ? topic.projectId : '#'}
                                          className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-[10px] font-bold transition-all ${
                                            unlocked ? 'border-ui-border text-text-primary hover:bg-ui-dark' : 'pointer-events-none'
                                          }`}
                                         >
                                           <Terminal className="w-3 h-3" /> {topic.practiceId ? 'Launch Lab' : 'Build Project'}
                                         </Link>
                                       )}
                                    </div>
                                 </div>

                                 <button 
                                  onClick={() => unlocked && toggleComplete(topic.id)}
                                  className={`p-2 rounded-xl transition-all ${
                                    completed ? 'bg-emerald-500 text-primary' : 'bg-primary/40 text-text-muted hover:text-accent border border-ui-border'
                                  }`}
                                 >
                                    <CheckCircle2 className="w-6 h-6" />
                                 </button>
                              </div>
                           </div>
                        </div>
                      );
                   })}
                </div>
             </div>
           ))}
        </section>

      </div>
    </Layout>
  );
}
