
import React, { useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '../../../components/Layout';
import { 
  Building2, Users, Target, Info, 
  Search, Code, Brain, ChevronRight,
  ArrowLeft, Clock, Zap, BookOpen,
  Swords, ShieldCheck
} from 'lucide-react';
import { companies } from '../../../lib/evaluatorData';
import { CompanyBattleground } from '../../../types/evaluator';
import Link from 'next/link';

interface BattlegroundPageProps {
  company: CompanyBattleground;
}

export default function BattlegroundPage({ company }: BattlegroundPageProps) {
    const [mode, setMode] = useState<'practice' | 'interview'>('practice');

    return (
        <Layout title={`${company.name} Battleground | LearnHub`}>
            <div className="bg-ui-dark min-h-screen">
                
                {/* Company Header */}
                <section className="py-16 border-b border-ui-border bg-gradient-to-r from-ui-card to-ui-dark overflow-hidden relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex flex-col md:flex-row items-center gap-10">
                        <div className="w-24 h-24 bg-rose-500/20 rounded-3xl flex items-center justify-center text-rose-400 font-black text-4xl shadow-glow-rose">
                            {company.name[0]}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">{company.name} <span className="text-rose-400">Battleground</span></h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                {company.hiringPattern.questionTypes.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-primary border border-ui-border rounded-lg text-[10px] font-bold uppercase tracking-widest text-text-muted">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setMode('practice')}
                                className={`px-8 py-3 rounded-2xl font-bold transition-all border ${mode === 'practice' ? 'bg-rose-500 text-primary border-rose-500 shadow-glow-rose' : 'bg-primary border-ui-border text-text-muted'}`}
                            >
                                Practice Mode
                            </button>
                            <button 
                                onClick={() => setMode('interview')}
                                className={`px-8 py-3 rounded-2xl font-bold transition-all border ${mode === 'interview' ? 'bg-orange-500 text-primary border-orange-500 shadow-glow-orange' : 'bg-primary border-ui-border text-text-muted'}`}
                            >
                                Interview Mode
                            </button>
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Sidebar Pattern Analysis */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-ui-card border border-ui-border rounded-3xl p-8 shadow-xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Info className="w-5 h-5 text-rose-400" /> Hiring Insights
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">The Pattern</p>
                                    <p className="text-sm text-text-secondary leading-relaxed italic border-l-2 border-rose-500/30 pl-4">
                                        "{company.hiringPattern.pattern}"
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Difficulty Spread</p>
                                    <div className="space-y-3">
                                        {Object.entries(company.hiringPattern.difficultyDistribution).map(([diff, percent]) => (
                                            <div key={diff} className="flex items-center gap-4">
                                                <span className="text-xs font-bold w-12">{diff}</span>
                                                <div className="flex-1 h-2 bg-primary rounded-full overflow-hidden">
                                                    <div className={`h-full ${diff === 'Hard' ? 'bg-rose-500' : diff === 'Medium' ? 'bg-orange-400' : 'bg-emerald-400'}`} style={{ width: percent }}></div>
                                                </div>
                                                <span className="text-[10px] font-black text-text-muted">{percent}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Repeated Topics</p>
                                    <div className="flex flex-wrap gap-2">
                                        {company.hiringPattern.hotTopics.map(topic => (
                                            <span key={topic} className="px-2 py-1 bg-highlight/10 text-highlight text-[10px] font-bold rounded border border-highlight/20">{topic}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden group">
                           <ShieldCheck className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20 group-hover:scale-110 transition-transform" />
                           <h4 className="text-xl font-bold mb-3 relative font-black">Performance Benchmark</h4>
                           <p className="text-sm text-indigo-100 mb-6 relative">
                              To be considered "Interview Ready" for {company.name}, aim for an 85% accuracy rate on Medium/Hard topics.
                           </p>
                           <Link href="/navigator" className="text-xs font-bold underline relative">View Prep Roadmap</Link>
                        </div>
                    </div>

                    {/* Question List */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black">Curated <span className="text-rose-400">Question Sets</span></h2>
                            <div className="flex gap-4">
                                <span className="flex items-center gap-2 text-[10px] font-bold text-text-muted">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div> Solved: 0
                                </span>
                                <span className="flex items-center gap-2 text-[10px] font-bold text-text-muted">
                                    <div className="w-2 h-2 rounded-full bg-ui-border"></div> Total: {company.questions.length}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {company.questions.map((q, idx) => (
                                <div key={q.id} className="group bg-ui-card border border-ui-border p-6 rounded-[2rem] hover:border-rose-500/30 transition-all flex flex-col md:flex-row items-start md:items-center gap-6 shadow-lg">
                                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-black text-text-muted group-hover:text-rose-400 transition-colors">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-bold">{q.title}</h3>
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                                q.difficulty === 'Hard' ? 'bg-rose-500/20 text-rose-500' :
                                                q.difficulty === 'Medium' ? 'bg-orange-500/20 text-orange-500' : 'bg-emerald-500/20 text-emerald-500'
                                            }`}>{q.difficulty}</span>
                                        </div>
                                        <p className="text-text-muted text-xs font-bold mb-3 uppercase tracking-tighter">{q.type} • {q.category}</p>
                                        <p className="text-sm text-text-secondary line-clamp-1">{q.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {q.solutionSlug && (
                                            <Link href={`/subjects/${q.solutionSlug}`} className="p-3 bg-primary rounded-xl text-text-muted hover:text-highlight transition-colors" title="Learn Theory">
                                                <BookOpen className="w-5 h-5" />
                                            </Link>
                                        )}
                                        <Link 
                                            href={`/evaluator/battlegrounds/solve/${q.id}`}
                                            className="px-6 py-3 bg-rose-500 text-primary font-black rounded-xl hover:scale-105 transition-all text-xs flex items-center gap-2 shadow-glow-rose"
                                        >
                                            Solve <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const companyId = params?.id as string;
    const company = companies.find(c => c.id === companyId);

    if (!company) return { notFound: true };

    return {
        props: { company }
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: companies.map(c => ({ params: { id: c.id } })),
        fallback: false
    };
};
