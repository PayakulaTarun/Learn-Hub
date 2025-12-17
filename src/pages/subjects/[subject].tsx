import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../../components/Header';
import { Tutorial, TutorialExample, CommonMistake, InterviewQuestion, PracticeProblem, RealWorldUseCase } from '../../types/content';
import { getAllTutorialSlugs, getTutorialBySlug } from '../../lib/contentLoader';
import { useState, useMemo } from 'react';
import { BookOpen, ChevronRight, Menu, X, ArrowLeft, ArrowRight, Code, AlertTriangle, HelpCircle, GraduationCap, Briefcase } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface SubjectPageProps {
  tutorial: Tutorial;
}

interface UISection {
  id: string;
  title: string;
  type: 'theory' | 'example' | 'mistake' | 'interview' | 'practice' | 'usecase' | 'summary';
  content?: string;
  data?: any;
}

export default function SubjectPage({ tutorial }: SubjectPageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    if (tutorial.exam_notes && tutorial.exam_notes.length > 0) {
      list.push({ id: 'summary', title: 'Summary & Cheat Sheet', type: 'summary', data: tutorial.exam_notes, content: tutorial.summary });
    }

    return list;
  }, [tutorial]);

  const [activeSection, setActiveSection] = useState<UISection>(sections[0] || { id: 'none', title: '', type: 'theory' });

  const currentIndex = sections.findIndex(s => s.id === activeSection.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < sections.length - 1;

  const goToPrevious = () => {
    if (hasPrevious) {
      setActiveSection(sections[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNext = () => {
    if (hasNext) {
      setActiveSection(sections[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!tutorial) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>{tutorial.title} - LearnHub</title>
        <meta name="description" content={tutorial.theory?.substring(0, 160)} />
      </Head>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 flex items-start gap-8 relative">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-50 bg-[#4A90E2] text-white p-3 rounded-full shadow-lg hover:bg-[#357ABD] transition"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar Navigation */}
        <aside className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-100px)]
          w-80 bg-white border-r border-gray-200 overflow-y-auto
          transition-transform duration-300 z-40 lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:top-24 lg:rounded-lg lg:shadow-sm
        `}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <BookOpen className="text-[#4A90E2]" size={24} />
              {tutorial.category.toUpperCase()}
            </h2>
            <p className="text-sm text-gray-600 mb-6 line-clamp-2">{tutorial.title}</p>

            <div className="space-y-2">
              {sections.map((section, idx) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section);
                    setIsSidebarOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between group transition-all duration-200 ${
                    activeSection.id === section.id
                      ? 'bg-[#4A90E2]/10 text-[#4A90E2] font-semibold border-l-4 border-[#4A90E2]'
                      : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="line-clamp-1 text-sm">{idx + 1}. {section.title}</span>
                  {activeSection.id === section.id && <ChevronRight size={16} />}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link href="/subjects" className="text-sm text-gray-500 hover:text-[#4A90E2] flex items-center gap-1">
                ← Back to All Subjects
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 w-full lg:max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
          <div className="p-8 lg:p-12">
            
            {/* Header Content */}
            <div className="mb-8 border-b border-gray-100 pb-8">
               <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{tutorial.level}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{tutorial.estimated_read_time}</span>
               </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{tutorial.title}</h1>
              <h2 className="text-xl text-[#4A90E2] font-medium">{activeSection.title}</h2>
            </div>

            {/* Dynamic Content Renderer */}
            <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
              
              {/* Theory & Syntax */}
              {(activeSection.type === 'theory') && (
                <ReactMarkdown>{activeSection.content || ''}</ReactMarkdown>
              )}

              {/* Examples */}
              {activeSection.type === 'example' && activeSection.data?.map((ex: TutorialExample, i: number) => (
                <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <Code className="text-green-600" size={20}/> Example {i + 1}
                    </h3>
                    <div className="bg-[#1e1e1e] text-white rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
                        <pre>{ex.code}</pre>
                    </div>
                    <div className="bg-white border-l-4 border-green-500 p-4 rounded-r-lg shadow-sm">
                        <p className="font-mono text-xs text-gray-400 mb-1">OUTPUT:</p>
                        <pre className="text-sm whitespace-pre-wrap">{ex.output}</pre>
                    </div>
                    <p className="mt-4 text-gray-600 italic border-l-2 border-gray-300 pl-4">{ex.explanation}</p>
                </div>
              ))}

              {/* Mistakes */}
              {activeSection.type === 'mistake' && activeSection.data?.map((m: CommonMistake, i: number) => (
                <div key={i} className="mb-8 border-l-4 border-red-500 pl-6 py-2">
                    <h3 className="text-lg font-bold text-red-600 mb-2 flex items-center gap-2">
                        <AlertTriangle size={20}/> ❌ {m.mistake}
                    </h3>
                    <div className="bg-red-50 p-4 rounded-lg text-red-800 mb-4">
                        {m.correction}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-100 p-3 rounded">
                            <p className="text-xs text-red-500 font-bold mb-1">WRONG:</p>
                            <code className="text-sm block whitespace-pre-wrap">{m.example.split('# ✅')[0]}</code>
                        </div>
                         <div className="bg-green-50 p-3 rounded">
                            <p className="text-xs text-green-500 font-bold mb-1">CORRECT:</p>
                            <code className="text-sm block whitespace-pre-wrap">{'# ✅' + m.example.split('# ✅')[1] || ''}</code>
                        </div>
                    </div>
                </div>
              ))}

              {/* Interview Questions */}
              {activeSection.type === 'interview' && activeSection.data?.map((q: InterviewQuestion, i: number) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-900 pr-4">Q{i+1}: {q.question}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
                            q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'
                        }`}>{q.difficulty}</span>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-blue-900 text-sm leading-relaxed">
                        {q.answer}
                    </div>
                </div>
              ))}

               {/* Practice Problems */}
              {activeSection.type === 'practice' && activeSection.data?.map((p: PracticeProblem, i: number) => (
                <div key={i} className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                    <div className="flex items-center gap-2 mb-3">
                        <HelpCircle className="text-purple-600" size={20}/>
                        <h3 className="font-bold text-gray-900">Problem {i+1}</h3>
                        <span className="text-xs bg-white px-2 py-0.5 rounded border border-purple-200 text-purple-600 ml-auto">{p.difficulty}</span>
                    </div>
                    <p className="mb-4 text-gray-800 font-medium">{p.problem}</p>
                    <details className="group">
                        <summary className="cursor-pointer text-sm text-purple-600 hover:text-purple-800 font-medium mb-2">Show Hint</summary>
                        <p className="text-sm text-gray-600 pl-4 border-l-2 border-purple-200 italic mb-4">{p.hint}</p>
                    </details>
                     <details className="group">
                        <summary className="cursor-pointer text-sm text-green-600 hover:text-green-800 font-medium">Show Solution</summary>
                        <div className="mt-2 bg-[#1e1e1e] text-white p-3 rounded text-sm font-mono overflow-x-auto">
                            <pre>{p.solution}</pre>
                        </div>
                    </details>
                </div>
              ))}

              {/* Real World Use Cases */}
              {activeSection.type === 'usecase' && activeSection.data?.map((u: RealWorldUseCase, i: number) => (
                 <div key={i} className="flex gap-4 items-start">
                     <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
                         <Briefcase size={24} />
                     </div>
                     <div>
                         <h3 className="text-xl font-bold text-gray-900 mb-1">{u.scenario}</h3>
                         <p className="text-gray-600 mb-3">{u.description}</p>
                         <div className="bg-gray-800 text-gray-300 p-4 rounded-lg font-mono text-sm">
                             <pre className="whitespace-pre-wrap">{u.code}</pre>
                         </div>
                     </div>
                 </div>
              ))}

              {/* Summary & Exam Notes */}
              {activeSection.type === 'summary' && (
                  <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <GraduationCap size={24} className="text-blue-600"/> Key Exam Takeaways
                      </h3>
                      <ul className="space-y-2 mb-8">
                          {activeSection.data?.map((note: string, i: number) => (
                              <li key={i} className="flex gap-2 items-start bg-yellow-50 p-3 rounded border border-yellow-100">
                                  <span className="text-yellow-500 font-bold">•</span>
                                  <span className="text-gray-800 text-sm">{note}</span>
                              </li>
                          ))}
                      </ul>
                      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                          <h3 className="font-bold text-blue-900 mb-2">Topic Summary</h3>
                          <div className="text-blue-800 prose prose-sm max-w-none">
                            <ReactMarkdown>{activeSection.content || ''}</ReactMarkdown>
                          </div>
                      </div>
                  </div>
              )}

            </div>

            {/* Navigation Footer */}
            <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center">
              <button
                onClick={goToPrevious}
                disabled={!hasPrevious}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                  hasPrevious
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ArrowLeft size={20} />
                Previous
              </button>

              <div className="text-sm text-gray-500 hidden sm:block">
                {activeSection.title} ({currentIndex + 1}/{sections.length})
              </div>

              <button
                onClick={goToNext}
                disabled={!hasNext}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                  hasNext
                    ? 'bg-[#4A90E2] text-white hover:bg-[#357ABD]'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
                <ArrowRight size={20} />
              </button>
            </div>
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
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { subject } = params as { subject: string };
  const tutorial = getTutorialBySlug(subject);

  if (!tutorial) {
    return { notFound: true };
  }

  return {
    props: { tutorial },
  };
};
