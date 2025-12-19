
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { Tutorial, TutorialExample, CommonMistake, InterviewQuestion, PracticeProblem, RealWorldUseCase, TutorialMetadata } from '../../types/content';
import { getAllTutorials, getAllTutorialSlugs, getTutorialBySlug } from '../../lib/contentLoader';
import { useState, useMemo } from 'react';
import { BookOpen, ChevronRight, Menu, X, ArrowLeft, ArrowRight, Code, AlertTriangle, HelpCircle, GraduationCap, Briefcase } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import InteractiveEditor from '../../components/PracticeEngine/InteractiveEditor';
import SearchingLab from '../../components/PracticeEngine/SearchingLab';
import SortingLab from '../../components/PracticeEngine/SortingLab';
import GraphLab from '../../components/PracticeEngine/GraphLab';
import { getPracticePack } from '../../lib/practiceLoader';
import { PracticePack } from '../../types/practice';
import { Target, Shield, Zap, Swords } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';

interface SubjectPageProps {
  tutorial: Tutorial;
  courseTutorials: TutorialMetadata[];
  practicePack?: PracticePack | null;
  prevTutorial?: { slug: string; title: string } | null;
  nextTutorial?: { slug: string; title: string } | null;
}

interface UISection {
  id: string;
  title: string;
  type: 'theory' | 'example' | 'mistake' | 'interview' | 'practice' | 'usecase' | 'summary' | 'mastery';
  content?: string;
  data?: any;
}

export default function SubjectPage({ tutorial, courseTutorials, practicePack, prevTutorial, nextTutorial }: SubjectPageProps) {
  const { trackTimeSpent } = useAnalytics();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'deep' | 'cram'>('deep');
  const router = useRouter();

  // Track time spent on this specific tutorial
  trackTimeSpent('tutorial', tutorial?.slug || 'unknown', { title: tutorial?.title });

  // Transform raw tutorial data into navigable sections
  const sections: UISection[] = useMemo(() => {
    if (!tutorial) return [];

    const list: UISection[] = [
      { id: 'theory', title: 'Theory & Concepts', type: 'theory', content: tutorial.theory }
    ];

    if (tutorial.syntax) {
      list.push({ id: 'syntax', title: 'Syntax & Basic Usage', type: 'theory', content: `## Syntax\n\n${tutorial.syntax}` });
    }

    if (tutorial.examples && tutorial.examples.length > 0) {
      list.push({ id: 'examples', title: 'Code Examples', type: 'example', data: tutorial.examples });
    }

    if (tutorial.common_mistakes && tutorial.common_mistakes.length > 0) {
      list.push({ id: 'mistakes', title: 'Common Mistakes', type: 'mistake', data: tutorial.common_mistakes });
    }

    if (tutorial.interview_questions && tutorial.interview_questions.length > 0) {
      list.push({ id: 'interview', title: 'Interview Questions', type: 'interview', data: tutorial.interview_questions });
    }
    
    if (tutorial.practice_problems && tutorial.practice_problems.length > 0) {
      list.push({ id: 'practice', title: 'Practice Exercises', type: 'practice', data: tutorial.practice_problems });
    }

    if (tutorial.real_world_use_cases && tutorial.real_world_use_cases.length > 0) {
      list.push({ id: 'usecases', title: 'Real World Use Cases', type: 'usecase', data: tutorial.real_world_use_cases });
    }

    if (tutorial.interactive_lab) {
      list.push({ id: 'lab', title: 'Interactive Practice Lab', type: 'theory', data: tutorial.interactive_lab });
    }

    if (tutorial.visualizer) {
      list.push({ id: 'visualizer', title: 'Interactive Visualizer', type: 'theory', data: tutorial.visualizer });
    }

    if (tutorial.exam_notes && tutorial.exam_notes.length > 0) {
      list.push({ id: 'summary', title: 'Summary & Cheat Sheet', type: 'summary', data: tutorial.exam_notes, content: tutorial.summary });
    }

    if (practicePack && practicePack.problems.length > 0) {
      list.push({ id: 'mastery', title: 'Deep Mastery Lab', type: 'mastery', data: practicePack.problems });
    }

    return list;
  }, [tutorial, practicePack]);

  const [activeSection, setActiveSection] = useState<UISection>(sections[0] || { id: 'none', title: '', type: 'theory' });

  // Reset active section when tutorial changes (client-side navigation)
  useMemo(() => {
     if (sections.length > 0) {
         setActiveSection(sections[0]);
     }
  }, [tutorial.slug]);

  const currentIndex = sections.findIndex(s => s.id === activeSection.id);
  const hasPreviousSection = currentIndex > 0;
  const hasNextSection = currentIndex < sections.length - 1;

  const goToPrevious = () => {
    if (hasPreviousSection) {
      setActiveSection(sections[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (prevTutorial) {
       router.push(`/subjects/${prevTutorial.slug}`);
    }
  };

  const goToNext = () => {
    if (hasNextSection) {
      setActiveSection(sections[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (nextTutorial) {
       router.push(`/subjects/${nextTutorial.slug}`);
    }
  };

  if (!tutorial) return null;

  return (
    <div className="min-h-screen bg-ui-dark flex flex-col">
      <Head>
        <title>{`${tutorial.title} - Student Resource Hub`}</title>
        <meta name="description" content={tutorial.theory?.substring(0, 160)} />
      </Head>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 flex items-start gap-8 relative">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-24 right-6 z-50 bg-rose-500 text-primary p-4 rounded-2xl shadow-glow-rose hover:scale-110 active:scale-95 transition-all duration-300"
        >
          {isSidebarOpen ? <X size={24} /> : <BookOpen size={24} />}
        </button>

        <aside className={`
          fixed lg:sticky left-0 h-screen lg:h-[calc(100vh-160px)]
          w-80 bg-ui-card border-r border-ui-border overflow-y-auto
          transition-transform duration-300 z-40 lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:top-36 lg:rounded-3xl lg:shadow-2xl
        `}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
              <BookOpen className="text-accent" size={24} />
              {tutorial.category.toUpperCase()}
            </h2>
            <p className="text-sm text-text-secondary mb-6 line-clamp-2">{tutorial.title}</p>

            <div className="space-y-2">
              {courseTutorials.map((t, idx) => (
                <Link
                  key={t.slug}
                  href={`/subjects/${t.slug}`}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between group transition-all duration-200 ${
                    t.slug === tutorial.slug
                      ? 'bg-accent/10 text-accent font-semibold border-l-4 border-accent'
                      : 'hover:bg-ui-dark text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span className="line-clamp-1 text-sm">{idx + 1}. {t.title}</span>
                  {t.slug === tutorial.slug && <ChevronRight size={16} />}
                </Link>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link href="/subjects" className="text-sm text-text-muted hover:text-accent flex items-center gap-1">
                ← Back to All Subjects
              </Link>
            </div>
          </div>
        </aside>

        <div className="flex-1 w-full lg:max-w-4xl bg-ui-card rounded-[2rem] shadow-2xl border border-ui-border overflow-hidden min-h-[600px]">
          <div className="p-8 lg:p-12 bg-gradient-to-b from-primary/30 to-transparent">
            
            {/* Header & Mode Toggle */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-ui-border pb-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-secondary/30 text-highlight border border-secondary/50 rounded-full text-[10px] font-black uppercase tracking-widest">{tutorial.level}</span>
                  <span className="px-3 py-1 bg-accent/20 text-accent border border-accent/40 rounded-full text-[10px] font-black uppercase tracking-widest">{tutorial.estimated_read_time}</span>
                </div>
                <h1 className="text-3xl lg:text-5xl font-black text-text-primary tracking-tighter mb-2">{tutorial.title}</h1>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{tutorial.category} • Knowledge Pillar</p>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center p-1 bg-primary rounded-2xl border border-ui-border">
                <button 
                  onClick={() => setViewMode('deep')}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'deep' ? 'bg-accent text-primary shadow-glow' : 'text-text-muted hover:text-text-primary'}`}
                >
                  Deep Dive
                </button>
                <button 
                  onClick={() => setViewMode('cram')}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'cram' ? 'bg-highlight text-primary shadow-glow-blue' : 'text-text-muted hover:text-text-primary'}`}
                >
                  Exam Cram
                </button>
              </div>
            </div>

            {viewMode === 'cram' ? (
              <div className="animate-in fade-in zoom-in duration-500 space-y-10">
                <div className="bg-gradient-to-br from-highlight/20 to-indigo-500/10 border border-highlight/30 rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-5">
                       <GraduationCap className="w-64 h-64" />
                   </div>
                   <div className="relative">
                      <h2 className="text-3xl font-black mb-6">High-Density <span className="text-highlight">Cheatsheet</span></h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4 border-b border-ui-border pb-2">Internal Framework</h3>
                            <p className="text-sm text-text-secondary leading-relaxed bg-ui-dark/30 p-6 rounded-2xl border border-ui-border font-medium">
                               {tutorial.summary}
                            </p>
                         </div>
                         <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4 border-b border-ui-border pb-2">Critical Notes</h3>
                            <ul className="space-y-3">
                               {tutorial.exam_notes.map((note, i) => (
                                  <li key={i} className="text-[13px] text-text-secondary flex gap-3 font-medium">
                                     <div className="w-1.5 h-1.5 bg-highlight rounded-full mt-1.5 shadow-glow-blue"></div> {note}
                                  </li>
                               ))}
                            </ul>
                         </div>
                      </div>

                      {tutorial.syntax && (
                         <div className="mt-10">
                             <h3 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4 border-b border-ui-border pb-2">Syntax Fast-Ref</h3>
                             <pre className="bg-ui-dark/50 p-8 rounded-3xl border border-ui-border font-mono text-sm text-emerald-400 overflow-x-auto shadow-inner">
                                {tutorial.syntax}
                             </pre>
                         </div>
                      )}
                      
                      {tutorial.common_mistakes.length > 0 && (
                         <div className="mt-10">
                            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4 border-b border-ui-border pb-2">Trap Prevention</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               {tutorial.common_mistakes.slice(0, 2).map((m, i) => (
                                  <div key={i} className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                                     <p className="text-[10px] font-black text-rose-500 uppercase mb-2 tracking-widest">Potential Mistake</p>
                                     <p className="text-[13px] font-bold text-text-primary mb-1">{m.mistake}</p>
                                     <p className="text-xs text-text-muted leading-relaxed">{m.correction}</p>
                                  </div>
                               ))}
                            </div>
                         </div>
                      )}
                   </div>
                </div>
                
                <div className="bg-ui-card border border-ui-border rounded-[2.5rem] p-10">
                   <h3 className="text-2xl font-black mb-8 flex items-center gap-4">
                      <HelpCircle className="w-8 h-8 text-highlight" /> High-Probability <span className="text-highlight">Interview Prompts</span>
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {tutorial.interview_questions.slice(0, 4).map((q, i) => (
                         <div key={i} className="p-6 bg-primary/40 border border-ui-border rounded-3xl group hover:border-highlight/30 transition-all">
                            <p className="text-sm font-bold text-text-primary mb-3 leading-snug">{q.question}</p>
                            <span className="px-2 py-0.5 bg-highlight/10 text-highlight text-[9px] font-black rounded uppercase tracking-widest">{q.difficulty}</span>
                         </div>
                      ))}
                   </div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-black text-accent mb-8 flex items-center gap-3">
                   <ChevronRight className="w-6 h-6" /> {activeSection.title}
                </h2>

            <div className="prose prose-lg prose-invert max-w-none text-text-secondary space-y-8">
              
              {/* Theory & Syntax */}
              {(activeSection.type === 'theory' && activeSection.id !== 'lab' && activeSection.id !== 'visualizer') && (
                <ReactMarkdown>{activeSection.content || ''}</ReactMarkdown>
              )}

              {/* Practice Lab */}
              {activeSection.id === 'lab' && activeSection.data && (
                <InteractiveEditor 
                  {...activeSection.data}
                  initialCode={activeSection.data.initial_code}
                  expectedOutput={activeSection.data.expected_output}
                  challengeMode={activeSection.data.challenge_mode}
                  title={`${tutorial.title} Practice`}
                />
              )}

              {/* Interactive Visualizer */}
              {activeSection.id === 'visualizer' && activeSection.data && (
                <div className="space-y-6">
                  {activeSection.data.type === 'searching' && <SearchingLab />}
                  {activeSection.data.type === 'sorting' && <SortingLab />}
                  {activeSection.data.type === 'graph' && <GraphLab />}
                  <div className="bg-primary/40 p-4 rounded-xl text-sm border border-ui-border italic">
                    <p>Tip: Use the controls to adjust speed and observe how nodes are visited and data structures are updated.</p>
                  </div>
                </div>
              )}

              {/* Examples */}
              {activeSection.type === 'example' && activeSection.data?.map((ex: TutorialExample, i: number) => (
                <div key={i} className="bg-ui-dark rounded-xl p-6 border border-ui-border">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-text-primary">
                        <Code className="text-accent" size={20}/> Example {i + 1}
                    </h3>
                    <div className="bg-[#050B14] text-gray-300 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4 border border-ui-border">
                        <pre>{ex.code}</pre>
                    </div>
                    <div className="bg-ui-dark border-l-4 border-accent p-4 rounded-r-lg shadow-sm">
                        <p className="font-mono text-xs text-text-muted mb-1">OUTPUT:</p>
                        <pre className="text-sm whitespace-pre-wrap text-text-secondary">{ex.output}</pre>
                    </div>
                    <p className="mt-4 text-text-muted italic border-l-2 border-ui-border pl-4">{ex.explanation}</p>
                </div>
              ))}

              {/* Mistakes */}
              {activeSection.type === 'mistake' && activeSection.data?.map((m: CommonMistake, i: number) => (
                <div key={i} className="mb-8 border-l-4 border-red-500 pl-6 py-2">
                    <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle size={20}/> ❌ {m.mistake}
                    </h3>
                    <div className="bg-red-900/20 p-4 rounded-lg text-red-200 mb-4 border border-red-900/30">
                        {m.correction}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-ui-dark p-3 rounded border border-ui-border">
                            <p className="text-xs text-red-400 font-bold mb-1">WRONG:</p>
                            <code className="text-sm block whitespace-pre-wrap text-text-muted">{m.example.split('# ✅')[0]}</code>
                        </div>
                         <div className="bg-ui-dark p-3 rounded border border-ui-border">
                            <p className="text-xs text-accent font-bold mb-1">CORRECT:</p>
                            <code className="text-sm block whitespace-pre-wrap text-text-primary">{'# ✅' + m.example.split('# ✅')[1] || ''}</code>
                        </div>
                    </div>
                </div>
              ))}

              {/* Interview Questions */}
              {activeSection.type === 'interview' && activeSection.data?.map((q: InterviewQuestion, i: number) => (
                <div key={i} className="bg-ui-dark border border-ui-border rounded-xl p-6 shadow-sm hover:shadow-glow transition duration-300">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-text-primary pr-4">Q{i+1}: {q.question}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            q.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : 
                            q.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                            'bg-red-500/20 text-red-400'
                        }`}>{q.difficulty}</span>
                    </div>
                    <div className="bg-secondary/10 p-4 rounded-lg text-text-secondary text-sm leading-relaxed border border-secondary/20">
                        {q.answer}
                    </div>
                </div>
              ))}

               {/* Practice Problems */}
              {activeSection.type === 'practice' && activeSection.data?.map((p: PracticeProblem, i: number) => (
                <div key={i} className="bg-ui-dark rounded-xl p-6 border border-ui-border">
                    <div className="flex items-center gap-2 mb-3">
                        <HelpCircle className="text-highlight" size={20}/>
                        <h3 className="font-bold text-text-primary">Problem {i+1}</h3>
                        <span className="text-xs bg-ui-card px-2 py-0.5 rounded border border-highlight/30 text-highlight ml-auto">{p.difficulty}</span>
                    </div>
                    <p className="mb-4 text-text-secondary font-medium">{p.problem}</p>
                    <details className="group">
                        <summary className="cursor-pointer text-sm text-highlight hover:text-white font-medium mb-2 transition-colors">Show Hint</summary>
                        <p className="text-sm text-text-muted pl-4 border-l-2 border-highlight/30 italic mb-4">{p.hint}</p>
                    </details>
                     <details className="group">
                        <summary className="cursor-pointer text-sm text-accent hover:text-white font-medium transition-colors">Show Solution</summary>
                        <div className="mt-2 bg-[#050B14] text-gray-300 p-3 rounded text-sm font-mono overflow-x-auto border border-ui-border">
                            <pre>{p.solution}</pre>
                        </div>
                    </details>
                </div>
              ))}

              {/* Real World Use Cases */}
              {activeSection.type === 'usecase' && activeSection.data?.map((u: RealWorldUseCase, i: number) => (
                 <div key={i} className="flex gap-4 items-start">
                     <div className="bg-secondary/20 p-3 rounded-lg text-secondary border border-secondary/30">
                         <Briefcase size={24} className="text-white" />
                     </div>
                     <div>
                         <h3 className="text-xl font-bold text-text-primary mb-1">{u.scenario}</h3>
                         <p className="text-text-secondary mb-3">{u.description}</p>
                         <div className="bg-[#050B14] text-gray-300 p-4 rounded-lg font-mono text-sm border border-ui-border">
                             <pre className="whitespace-pre-wrap">{u.code}</pre>
                         </div>
                     </div>
                 </div>
              ))}

              {/* Deep Mastery Lab */}
              {activeSection.type === 'mastery' && (
                <div className="space-y-12">
                   <div className="bg-gradient-to-r from-accent/20 to-highlight/10 p-8 rounded-[2rem] border border-accent/30 mb-12">
                      <div className="flex items-center gap-4 mb-4">
                         <Target className="w-10 h-10 text-accent" />
                         <h3 className="text-3xl font-black text-text-primary tracking-tighter">Topic Mastery Challenge</h3>
                      </div>
                      <p className="text-text-secondary font-medium leading-relaxed">
                         You are entering <b>Deep Practice Mode</b>. This collection contains {activeSection.data.length} curated problems designed to take you from foundational understanding to production-grade execution.
                      </p>
                      <div className="flex gap-4 mt-8">
                         <div className="px-4 py-2 bg-primary/40 rounded-xl border border-ui-border text-[10px] font-black uppercase text-text-muted">
                            Beginner: {activeSection.data.filter((p: any) => p.difficulty === 'Beginner').length}
                         </div>
                         <div className="px-4 py-2 bg-primary/40 rounded-xl border border-ui-border text-[10px] font-black uppercase text-text-muted">
                            Intermediate: {activeSection.data.filter((p: any) => p.difficulty === 'Intermediate').length}
                         </div>
                         <div className="px-4 py-2 bg-primary/40 rounded-xl border border-ui-border text-[10px] font-black uppercase text-text-muted">
                            Advanced: {activeSection.data.filter((p: any) => p.difficulty === 'Advanced').length}
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 gap-6">
                      {activeSection.data.map((p: any, i: number) => (
                         <div key={i} className="group bg-ui-dark rounded-3xl p-8 border border-ui-border hover:border-accent/30 transition-all shadow-xl">
                            <div className="flex justify-between items-start mb-6">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-[10px] font-black text-accent border border-accent/20">
                                     #{i+1}
                                  </div>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                     p.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                     p.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                                     'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  }`}>{p.difficulty}</span>
                               </div>
                               <Zap className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                            </div>
                            <h4 className="text-lg font-bold text-text-primary mb-4 leading-relaxed">{p.problem}</h4>
                            
                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                               <details className="flex-1 group/item">
                                  <summary className="list-none cursor-pointer px-6 py-3 bg-primary/30 border border-ui-border rounded-xl text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors flex items-center justify-center gap-2">
                                     <Shield className="w-3 h-3" /> Get Hint
                                  </summary>
                                  <div className="mt-4 p-6 bg-primary/20 border-l-4 border-accent rounded-r-xl text-sm italic text-text-secondary">
                                     {p.hint}
                                  </div>
                               </details>
                               <details className="flex-1 group/item">
                                  <summary className="list-none cursor-pointer px-6 py-3 bg-accent text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-highlight hover:shadow-glow transition-all flex items-center justify-center gap-2">
                                     <Swords className="w-3 h-3" /> View Solution
                                  </summary>
                                  <div className="mt-4 p-6 bg-[#050B14] border border-ui-border rounded-2xl font-mono text-sm text-emerald-400 overflow-x-auto whitespace-pre-wrap shadow-inner">
                                     {p.solution}
                                  </div>
                               </details>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
              )}

              {/* Summary & Exam Notes */}
              {activeSection.type === 'summary' && (
                  <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-text-primary">
                          <GraduationCap size={24} className="text-highlight"/> Key Exam Takeaways
                      </h3>
                      <ul className="space-y-2 mb-8">
                          {activeSection.data?.map((note: string, i: number) => (
                              <li key={i} className="flex gap-2 items-start bg-yellow-500/10 p-3 rounded border border-yellow-500/20">
                                  <span className="text-yellow-400 font-bold">•</span>
                                  <span className="text-text-secondary text-sm">{note}</span>
                              </li>
                          ))}
                      </ul>
                      <div className="bg-secondary/10 p-6 rounded-xl border border-secondary/20">
                          <h3 className="font-bold text-highlight mb-2">Topic Summary</h3>
                          <div className="text-text-secondary prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{activeSection.content || ''}</ReactMarkdown>
                          </div>
                      </div>
                  </div>
              )}

            </div>

            <div className="mt-16 pt-8 border-t border-ui-border flex justify-between items-center">
              <button
                onClick={goToPrevious}
                disabled={!hasPreviousSection && !prevTutorial}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                  hasPreviousSection || prevTutorial
                    ? 'bg-ui-dark text-text-primary hover:bg-ui-border border border-ui-border'
                    : 'bg-ui-dark text-text-muted cursor-not-allowed opacity-50'
                }`}
              >
                <ArrowLeft size={20} />
                {hasPreviousSection ? 'Previous Section' : (prevTutorial ? `Prev: ${prevTutorial.title.substring(0, 15)}...` : 'Previous')}
              </button>

              <div className="text-sm text-text-muted hidden sm:block">
                {activeSection.title} ({currentIndex + 1}/{sections.length})
              </div>

              <button
                onClick={goToNext}
                disabled={!hasNextSection && !nextTutorial}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                  hasNextSection || nextTutorial
                    ? 'bg-accent text-primary hover:bg-highlight hover:shadow-glow'
                    : 'bg-ui-dark text-text-muted cursor-not-allowed opacity-50'
                }`}
              >
                {hasNextSection ? 'Next Section' : (nextTutorial ? `Next: ${nextTutorial.title.substring(0, 15)}...` : 'Next')}
                <ArrowRight size={20} />
              </button>
              </div>
            </div>
           )}
          </div>
        </div>
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const slugs = getAllTutorialSlugs();
    return {
      paths: slugs.map(slug => ({ params: { subject: slug } })),
      fallback: false, 
    };
  } catch (error) {
    console.error('[Static Paths Error]:', error);
    return { paths: [], fallback: false };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { subject } = params as { subject: string };
  const tutorial = getTutorialBySlug(subject);
  if (!tutorial) return { notFound: true };

  const allTutorials = getAllTutorials();
  const courseTutorials = allTutorials.filter(t => t.subject === tutorial.subject);
  courseTutorials.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));

  const currentIndex = courseTutorials.findIndex(t => t.slug === tutorial.slug);
  const prevTutorial = currentIndex > 0 ? courseTutorials[currentIndex - 1] : null;
  const nextTutorial = currentIndex < courseTutorials.length - 1 ? courseTutorials[currentIndex + 1] : null;

  return {
    props: { 
      tutorial,
      courseTutorials,
      practicePack: getPracticePack(subject),
      prevTutorial: prevTutorial ? { slug: prevTutorial.slug, title: prevTutorial.title } : null,
      nextTutorial: nextTutorial ? { slug: nextTutorial.slug, title: nextTutorial.title } : null,
    },
  };
};
