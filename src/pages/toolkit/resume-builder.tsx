
import React, { useState, useMemo } from 'react';
import Layout from '../../components/Layout';
import { 
  FileText, Download, User, Briefcase, 
  GraduationCap, Sparkles, Wand2, CheckCircle2,
  Trophy, Star, Award
} from 'lucide-react';
import { useLearningState } from '../../hooks/useLearningState';
import { useGamification } from '../../hooks/useGamification';

export default function ResumeBuilder() {
  const { completed } = useLearningState();
  const { stats } = useGamification();

  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Academic Learner',
    email: 'learner@Student Resource Hub.com',
    github: 'github.com/Student Resource Hub-pro',
    linkedin: 'linkedin.com/in/Student Resource Hub'
  });

  // Pull skills from verified platform activity
  const verifiedSkills = useMemo(() => {
    if (completed.length > 0) {
      return completed.slice(0, 10);
    }
    return ['HTML5', 'CSS3', 'JavaScript', 'Problem Solving'];
  }, [completed]);

  const achievements = [
    { name: `Level ${stats.level} Developer`, detail: `Earned ${stats.xp} XP through continuous practice` },
    { name: `${stats.streak} Day Learning Streak`, detail: 'Demonstrated exceptional consistency in skill acquisition' },
    { name: `${stats.totalProblemsSolved} Problems Verified`, detail: 'Passed industrial-grade test cases in the Evaluator' }
  ];

  return (
    <Layout title="Tech Resume Builder | Level Up Your Career">
      <div className="bg-ui-dark min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <div>
              <span className="inline-flex items-center px-4 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 tracking-widest uppercase mb-4">
                Pillar Five: The Toolkit
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
                ATS-Optimized <span className="text-indigo-400">Resume Builder</span>
              </h1>
              <p className="text-text-secondary mt-4 max-w-xl">
                One-click generation of professional resumes using your verified Student Resource Hub progress, projects, and achievements.
              </p>
            </div>
            <button className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-glow-indigo flex items-center gap-3 hover:scale-105 transition-all">
              <Download className="w-5 h-5" /> Export PDF
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Editor Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-ui-card border border-ui-border rounded-3xl p-8 shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-400" /> Personal Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-text-muted uppercase mb-1 block">Full Name</label>
                    <input 
                      type="text" 
                      value={personalInfo.name} 
                      onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                      className="w-full bg-primary border border-ui-border rounded-xl px-4 py-2 text-sm focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-text-muted uppercase mb-1 block">Contact Email</label>
                    <input 
                      type="email" 
                      value={personalInfo.email} 
                       onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                      className="w-full bg-primary border border-ui-border rounded-xl px-4 py-2 text-sm focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-ui-card border border-ui-border rounded-3xl p-8 shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                   <Award className="w-5 h-5 text-yellow-400" /> Platform achievements
                </h3>
                <div className="space-y-3">
                  {achievements.map((ach, i) => (
                    <div key={i} className="p-4 bg-primary/40 border border-ui-border rounded-2xl flex gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-text-primary">{ach.name}</p>
                        <p className="text-[10px] text-text-muted">{ach.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 rounded-3xl p-8 relative overflow-hidden group">
                <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10" />
                <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                   <Wand2 className="w-5 h-5 text-indigo-400" /> AI Optimization
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed mb-6">
                  Ready to apply for a <b>Full Stack Developer</b> role? Our AI will prioritize your JavaScript and React projects in the output.
                </p>
                <div className="flex gap-2">
                   {['Product', 'Service', 'Startup'].map(type => (
                      <button key={type} className="px-2 py-1 bg-ui-dark border border-ui-border rounded text-[8px] font-bold uppercase transition-colors hover:border-indigo-500">
                        {type}
                      </button>
                   ))}
                </div>
              </div>
            </div>

            {/* Resume Preview */}
            <div className="lg:col-span-2">
               <div className="bg-white rounded-lg shadow-2xl p-12 text-gray-800 min-h-[842px] relative">
                  <div className="border-b-4 border-gray-800 pb-8 mb-10 flex justify-between items-end">
                     <div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-gray-900">{personalInfo.name}</h2>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600 font-medium">
                           <span>{personalInfo.email}</span>
                           <span>•</span>
                           <span>{personalInfo.github}</span>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-bold bg-gray-100 px-3 py-1 rounded inline-block">Full Stack Software Engineer</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-12">
                     <div className="col-span-1 space-y-10">
                        <section>
                           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-200 pb-1">Verified Skills</h3>
                           <div className="flex flex-wrap gap-2">
                              {verifiedSkills.map((skill: string, i: number) => (
                                 <span key={i} className="text-[10px] font-bold bg-gray-900 text-white px-2 py-1 rounded">{skill}</span>
                              ))}
                           </div>
                        </section>

                        <section>
                           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-200 pb-1">Credentials</h3>
                           <ul className="space-y-4">
                              <li className="flex gap-2 items-start">
                                 <Trophy className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                 <p className="text-[10px] leading-tight"><span className="font-bold">Expert Evaluator Rank</span><br/>91st Percentile in DSA</p>
                              </li>
                              <li className="flex gap-2 items-start">
                                 <Award className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                 <p className="text-[10px] leading-tight"><span className="font-bold">Daily Consistency</span><br/>{stats.streak} Day Learning Streak</p>
                              </li>
                           </ul>
                        </section>
                     </div>

                     <div className="col-span-2 space-y-10">
                        <section>
                           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-200 pb-1">Projects & Achievements</h3>
                           <div className="space-y-6">
                              <div>
                                 <h4 className="text-sm font-bold text-gray-900 flex items-center justify-between">
                                    Full Stack Roadmap Completion
                                    <span className="text-[10px] text-gray-500">Dec 2024</span>
                                 </h4>
                                 <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">
                                    Successfully completed a comprehensive industry-standard curriculum covering frontend architecture, backend systems, and database management. Verified through 25+ hands-on interactive labs.
                                 </p>
                              </div>
                              <div>
                                 <h4 className="text-sm font-bold text-gray-900 flex items-center justify-between">
                                    Code Quality Mastery
                                    <span className="text-[10px] text-gray-500">In Progress</span>
                                 </h4>
                                 <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">
                                    Consistently maintaining a "Clean Code" score of 85+ in the LeadHub Evaluator system. Expert in O(n) optimization and modular programming patterns.
                                 </p>
                              </div>
                           </div>
                        </section>

                        <section>
                           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-200 pb-1">Education</h3>
                           <div>
                              <h4 className="text-sm font-bold text-gray-900">Student Resource Hub Advanced Certification</h4>
                              <p className="text-[10px] text-gray-500">Continuous Professional Development</p>
                           </div>
                        </section>
                     </div>
                  </div>
                  
                  <div className="absolute bottom-12 left-12 right-12 border-t border-gray-100 pt-4 flex justify-between items-center opacity-30">
                     <p className="text-[8px] font-bold uppercase tracking-widest italic">Generated by Student Resource Hub Career Systems</p>
                     <img src="/logo.png" className="h-4 grayscale" alt="logo" />
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
