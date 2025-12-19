
import React, { useState, useMemo } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../../../components/Header';
import { Tutorial, TutorialExample, CommonMistake, InterviewQuestion, PracticeProblem, RealWorldUseCase } from '../../../../types/content';
import { getTutorialBySlug } from '../../../../lib/contentLoader';
import { roadmaps, RoadmapTopic } from '../../../../lib/roadmaps';
import { useLearningState } from '../../../../hooks/useLearningState';
import { 
  BookOpen, ChevronRight, Menu, X, ArrowLeft, ArrowRight, Code, 
  AlertTriangle, HelpCircle, GraduationCap, Briefcase, Sparkles,
  Rocket, Terminal, Layers, Search, CheckCircle2, Lock
} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import InteractiveEditor from '../../../../components/PracticeEngine/InteractiveEditor';
import SearchingLab from '../../../../components/PracticeEngine/SearchingLab';
import SortingLab from '../../../../components/PracticeEngine/SortingLab';
import GraphLab from '../../../../components/PracticeEngine/GraphLab';

interface LearnPageProps {
  tutorial: Tutorial | null;
  role: string;
  domain: string;
  topicId: string;
  roadmapTitle?: string;
  stageTopics: RoadmapTopic[];
  topicTitle?: string;
}

interface UISection {
  id: string;
  title: string;
  type: 'theory' | 'example' | 'mistake' | 'interview' | 'practice' | 'usecase' | 'summary' | 'coming_soon';
  content?: string;
  data?: any;
}

export default function LearnPage({ tutorial, role, domain, topicId, roadmapTitle, stageTopics, topicTitle }: LearnPageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isCompleted, toggleComplete } = useLearningState();
  const router = useRouter();

  // Transform raw tutorial data into navigable sections
  const sections: UISection[] = useMemo(() => {
    if (!tutorial) {
      return [{ id: 'coming_soon', title: 'Content Coming Soon', type: 'coming_soon' }];
    }

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

    return list;
  }, [tutorial]);

  const [activeSection, setActiveSection] = useState<UISection>(sections[0]);

  // Handle navigation between sections or topics
  const currentIndex = sections.findIndex(s => s.id === activeSection.id);
  const hasPreviousSection = currentIndex > 0;
  const hasNextSection = currentIndex < sections.length - 1;

  const currentTopicIndex = stageTopics.findIndex(t => t.id === topicId);
  const nextTopic = stageTopics[currentTopicIndex + 1];

  const goToNext = () => {
    if (hasNextSection) {
      setActiveSection(sections[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (nextTopic) {
        // Mark current as complete before moving
        if (topicId) toggleComplete(topicId);
        router.push(`/learn/${role}/${domain}/${nextTopic.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-ui-dark flex flex-col">
      <Head>
        <title>{tutorial ? `${tutorial.title} - Student Resource Hub` : `${topicTitle} - Student Resource Hub`}</title>
      </Head>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col lg:flex-row items-start gap-8 relative">
        {/* Mobile Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-accent text-primary p-4 rounded-3xl shadow-glow hover:bg-highlight transition-all"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Roadmap Sidebar (GPS Style) */}
        <aside className={`
          fixed lg:sticky left-0 h-screen lg:h-[calc(100vh-160px)]
          w-full lg:w-80 bg-ui-card border-r border-ui-border overflow-y-auto
          transition-transform duration-300 z-40 lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:top-36 lg:rounded-3xl lg:shadow-2xl
        `}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                  <Rocket className="w-5 h-5" />
               </div>
               <div>
                  <h2 className="text-sm font-black text-text-primary uppercase tracking-tight">Stage Progress</h2>
                  <p className="text-[10px] text-text-muted font-bold uppercase">{domain}</p>
               </div>
            </div>

            <div className="space-y-3">
              {stageTopics.map((topic, idx) => {
                const isActive = topic.id === topicId;
                const completed = isCompleted(topic.id);
                
                return (
                  <Link 
                    key={topic.id}
                    href={`/learn/${role}/${domain}/${topic.id}`}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`group w-full text-left px-5 py-4 rounded-2xl flex items-center justify-between transition-all duration-300 border ${
                      isActive 
                        ? 'bg-accent/10 border-accent/40 text-accent font-bold shadow-glow-sm' 
                        : 'bg-primary/20 border-ui-border text-text-secondary hover:border-text-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                       <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                          completed ? 'bg-emerald-500 border-emerald-500 text-primary' : 'border-ui-border'
                       }`}>
                          {completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="text-[9px]">{idx + 1}</span>}
                       </div>
                       <span className="text-xs line-clamp-1">{topic.title}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </Link>
                );
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-ui-border">
               <div className="p-4 bg-ui-dark border border-ui-border rounded-2xl mb-6">
                  <p className="text-[10px] font-bold text-text-muted uppercase mb-3 flex items-center gap-2">
                     <Layers className="w-3 h-3 text-accent" /> Section Content
                  </p>
                  <div className="space-y-1">
                     {sections.map(s => (
                       <button 
                        key={s.id}
                        onClick={() => setActiveSection(s)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${
                          activeSection.id === s.id ? 'bg-accent/20 text-accent' : 'text-text-muted hover:text-text-primary'
                        }`}
                       >
                         {s.title}
                       </button>
                     ))}
                  </div>
               </div>
               <Link href={`/navigator/roadmaps/${role}`} className="text-xs font-bold text-text-muted hover:text-accent flex items-center gap-2 px-2">
                 <ArrowLeft className="w-4 h-4" /> Final Roadmap
               </Link>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <div className="flex-1 w-full bg-ui-card rounded-[2.5rem] shadow-2xl border border-ui-border overflow-hidden min-h-[600px] relative">
          
          {tutorial ? (
            <div className="p-8 lg:p-14">
               <div className="mb-10 border-b border-ui-border pb-10">
                  <div className="flex items-center gap-2 mb-4">
                     <span className="px-3 py-1 bg-secondary/30 text-highlight border border-secondary/50 rounded-full text-[10px] font-black uppercase tracking-widest">{tutorial.level}</span>
                     <span className="px-3 py-1 bg-accent/20 text-accent border border-accent/40 rounded-full text-[10px] font-black uppercase tracking-widest">{tutorial.estimated_read_time}</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-extrabold text-text-primary mb-3 leading-tight tracking-tight">{tutorial.title}</h1>
                  <h2 className="text-xl text-accent font-bold flex items-center gap-2">
                     <Sparkles className="w-5 h-5" /> {activeSection.title}
                  </h2>
               </div>

               <div className="prose prose-lg prose-invert max-w-none text-text-secondary space-y-10">
                  {/* Theory */}
                  {(activeSection.type === 'theory' && activeSection.id !== 'lab' && activeSection.id !== 'visualizer') && (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                        <ReactMarkdown>{activeSection.content || ''}</ReactMarkdown>
                    </div>
                  )}

                  {/* Practice Lab */}
                  {activeSection.id === 'lab' && activeSection.data && (
                    <div className="mt-4">
                        <InteractiveEditor 
                          {...activeSection.data}
                          initialCode={activeSection.data.initial_code}
                          title={`${tutorial.title} Lab`}
                        />
                    </div>
                  )}

                  {/* Visualizer */}
                  {activeSection.id === 'visualizer' && activeSection.data && (
                    <div className="space-y-8">
                       {activeSection.data.type === 'searching' && <SearchingLab />}
                       {activeSection.data.type === 'sorting' && <SortingLab />}
                       {activeSection.data.type === 'graph' && <GraphLab />}
                    </div>
                  )}

                  {/* Examples */}
                  {activeSection.type === 'example' && activeSection.data?.map((ex: TutorialExample, i: number) => (
                    <div key={i} className="bg-ui-dark rounded-3xl p-8 border border-ui-border shadow-inner">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-text-primary">
                           <Code className="text-accent" /> Example {i + 1}
                        </h3>
                        <div className="bg-[#050B14] rounded-2xl p-6 font-mono text-sm overflow-x-auto mb-6 border border-ui-border relative">
                           <div className="absolute top-4 right-4 text-[10px] text-text-muted font-bold tracking-widest uppercase">Source Code</div>
                           <pre>{ex.code}</pre>
                        </div>
                        <div className="bg-ui-dark/50 border-l-4 border-accent p-6 rounded-r-2xl bg-gradient-to-r from-accent/5 to-transparent">
                           <p className="text-[10px] font-black text-text-muted mb-3 uppercase tracking-tighter">Compiled Output</p>
                           <pre className="text-sm font-semibold text-text-primary">{ex.output}</pre>
                        </div>
                    </div>
                  ))}

                  {/* Interview Questions */}
                  {activeSection.type === 'interview' && activeSection.data?.map((q: InterviewQuestion, i: number) => (
                    <div key={i} className="bg-ui-dark border border-ui-border rounded-3xl p-8 hover:border-accent/30 transition-all">
                        <div className="flex justify-between items-start mb-6">
                           <h3 className="text-xl font-bold text-text-primary pr-6">Q{i+1}: {q.question}</h3>
                           <span className="px-2.5 py-1 bg-accent/20 text-accent text-[10px] font-black rounded-lg border border-accent/20 uppercase tracking-widest">{q.difficulty}</span>
                        </div>
                        <div className="bg-secondary/10 p-6 rounded-2xl text-text-secondary leading-relaxed border border-secondary/20 shadow-inner italic">
                           {q.answer}
                        </div>
                    </div>
                  ))}
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center p-12">
               <div className="w-32 h-32 bg-accent/20 rounded-[2.5rem] flex items-center justify-center text-accent mb-10 shadow-glow animate-pulse">
                  <Sparkles className="w-16 h-16" />
               </div>
               <h1 className="text-4xl lg:text-5xl font-black text-text-primary mb-6 tracking-tighter">Course <span className="text-accent">Architecting</span></h1>
               <p className="text-xl text-text-secondary max-w-lg mb-12 leading-relaxed font-medium">
                 Our engineers are curating the interactive labs and theory for <b>{topicTitle}</b>. We only publish production-ready content.
               </p>
               <div className="flex flex-wrap gap-4 justify-center">
                  <Link href={`/navigator/roadmaps/${role}`} className="px-8 py-4 bg-ui-dark border border-ui-border rounded-2xl font-bold flex items-center gap-3 hover:bg-ui-border transition-all">
                    <ArrowLeft className="w-5 h-5" /> Roadmap Progress
                  </Link>
                  <Link href="/practice" className="px-8 py-4 bg-accent text-primary rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all shadow-glow">
                    <Terminal className="w-5 h-5" /> Try Practice Engine
                  </Link>
               </div>
            </div>
          )}

          {/* Navigation Bottom */}
          <div className="mt-auto p-8 lg:p-14 pt-0 border-t border-ui-border bg-ui-dark/30">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
               <button 
                onClick={() => router.push(`/navigator/roadmaps/${role}`)} 
                className="flex items-center gap-2 text-sm font-bold text-text-muted hover:text-text-primary"
               >
                 <ArrowLeft className="w-4 h-4" /> Stage Overview
               </button>
               
               <button 
                onClick={goToNext}
                className="group px-10 py-4 bg-highlight text-primary font-black rounded-2xl shadow-glow-blue hover:scale-105 transition-all flex items-center gap-4"
               >
                 {hasNextSection ? 'Next Section' : (nextTopic ? `Continute to ${nextTopic.title.split(' ')[0]}` : 'Finish Stage')}
                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { role, domain, topic } = params as { role: string; domain: string; topic: string };
  
  const roadmap = roadmaps.find(r => r.id === role);
  if (!roadmap) return { notFound: true };

  const stage = roadmap.stages.find(s => s.domain === domain);
  if (!stage) return { notFound: true };

  const topicMeta = stage.topics.find(t => t.id === topic);
  if (!topicMeta) return { notFound: true };

  let tutorial = null;
  if (topicMeta.slug) {
    tutorial = getTutorialBySlug(topicMeta.slug);
  }

  return {
    props: {
      tutorial,
      role,
      domain,
      topicId: topic,
      roadmapTitle: roadmap.title,
      stageTopics: stage.topics,
      topicTitle: topicMeta.title
    }
  };
};

export const getStaticPaths: any = async () => {
  const paths: any[] = [];

  roadmaps.forEach(roadmap => {
    roadmap.stages.forEach(stage => {
      stage.topics.forEach(topic => {
        paths.push({
          params: {
            role: roadmap.id,
            domain: stage.domain,
            topic: topic.id
          }
        });
      });
    });
  });

  return {
    paths,
    fallback: false
  };
};
