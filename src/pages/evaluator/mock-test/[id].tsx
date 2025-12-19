
import React, { useState, useEffect } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '../../../components/Layout';
import { 
  Clock, AlertCircle, ChevronLeft, ChevronRight, 
  Target, BarChart, Rocket, ShieldAlert,
  ClipboardCheck, Timer, Zap, Layout as LayoutIcon
} from 'lucide-react';
import { mockExams } from '../../../lib/evaluatorData';
import { MockExam } from '../../../types/evaluator';
import Link from 'next/link';

interface MockTestPageProps {
  exam: MockExam;
}

export default function MockTestPage({ exam }: MockTestPageProps) {
    const [gameState, setGameState] = useState<'prep' | 'live' | 'result'>('prep');
    const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Timer logic
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === 'live' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'live') {
            handleAutoSubmit();
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    const handleAutoSubmit = () => {
        setHasSubmitted(true);
        setGameState('result');
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    };

    const currentQuestion = exam.questions[currentQuestionIdx] || exam.questions[0];

    const calculateScore = () => {
        let score = 0;
        exam.questions.forEach(q => {
            if (answers[q.id]) {
                if (answers[q.id] === q.correctAnswer) {
                    score += q.marks;
                } else if (exam.negativeMarking) {
                    score -= (q.marks * Math.abs(exam.negativeMarking));
                }
            }
        });
        return Math.max(0, parseFloat(score.toFixed(2)));
    };

    return (
        <Layout title={`${exam.title} | Exam Reality Engine`}>
            <div className="bg-ui-dark min-h-screen">
                
                {/* Prep State */}
                {gameState === 'prep' && (
                    <div className="max-w-4xl mx-auto px-4 py-20">
                        <div className="bg-ui-card border border-ui-border rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-5">
                                <ShieldAlert className="w-64 h-64 text-orange-400" />
                            </div>
                            <div className="relative">
                                <Link href="/evaluator" className="text-xs font-bold text-text-muted hover:text-orange-400 mb-8 flex items-center gap-2">
                                    <ChevronLeft className="w-4 h-4" /> Cancel & Return
                                </Link>
                                <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Ready for the <br /> <span className="text-orange-400">Pressure?</span></h1>
                                <p className="text-xl text-text-secondary mb-10 leading-relaxed italic border-l-4 border-orange-500/20 pl-6">
                                    "Success in {exam.title.split(' ')[0]} is 50% knowledge and 50% time management."
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                    <div className="bg-primary/40 border border-ui-border p-6 rounded-3xl">
                                        <Clock className="w-6 h-6 text-orange-400 mb-3" />
                                        <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Duration</p>
                                        <p className="text-xl font-black">{exam.durationMinutes} Minutes</p>
                                    </div>
                                    <div className="bg-primary/40 border border-ui-border p-6 rounded-3xl">
                                        <Target className="w-6 h-6 text-emerald-400 mb-3" />
                                        <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Total Marks</p>
                                        <p className="text-xl font-black">100</p>
                                    </div>
                                    <div className="bg-primary/40 border border-ui-border p-6 rounded-3xl">
                                        <AlertCircle className="w-6 h-6 text-rose-400 mb-3" />
                                        <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Lock Mode</p>
                                        <p className="text-xl font-black">Active</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-12">
                                    <h4 className="font-bold text-text-primary uppercase tracking-widest text-xs flex items-center gap-2">
                                        <ClipboardCheck className="w-4 h-4 text-orange-400" /> Exam Instructions
                                    </h4>
                                    <ul className="space-y-3">
                                        {['Strict timer will start once you click begin.', 'No backtracking between sections (GATE Mode).', 'Auto-submits when time expires.', 'Predicted results based on past 10 years of trends.'].map((instr, i) => (
                                            <li key={i} className="text-sm text-text-secondary flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shadow-glow-orange"></div>
                                                {instr}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button 
                                    onClick={() => setGameState('live')}
                                    className="w-full py-5 bg-orange-500 text-primary font-black rounded-3xl shadow-glow-orange hover:scale-[1.02] transition-all flex items-center justify-center gap-4 text-xl"
                                >
                                    Start Locked Session <Rocket className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Live State */}
                {gameState === 'live' && (
                    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
                        {/* Status Bar */}
                        <div className="bg-ui-card border-b border-ui-border px-8 py-4 flex justify-between items-center bg-gradient-to-r from-ui-card to-ui-dark">
                            <div className="flex items-center gap-8">
                                <div>
                                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Time Remaining</p>
                                    <p className={`text-2xl font-black flex items-center gap-2 ${timeLeft < 300 ? 'text-rose-500 animate-pulse' : 'text-orange-400'}`}>
                                        <Timer className="w-5 h-5" /> {formatTime(timeLeft)}
                                    </p>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Current Section</p>
                                    <p className="text-lg font-bold text-text-primary">{exam.sections[0].title}</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleAutoSubmit}
                                className="px-8 py-3 bg-rose-500/10 text-rose-500 border border-rose-500/30 rounded-2xl font-black text-xs hover:bg-rose-500 hover:text-primary transition-all uppercase tracking-widest"
                            >
                                Submit Exam
                            </button>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Question Navigator Sidebar */}
                            <aside className="w-80 bg-ui-card border-r border-ui-border p-8 hidden lg:block overflow-y-auto">
                                <h3 className="text-xs font-black text-text-muted uppercase tracking-widest mb-6">Question Palette</h3>
                                <div className="grid grid-cols-5 gap-3">
                                    {exam.questions.map((_, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => setCurrentQuestionIdx(i)}
                                            className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all border ${
                                                currentQuestionIdx === i ? 'bg-orange-500 border-orange-500 text-primary shadow-glow-orange' : 
                                                answers[exam.questions[i].id] ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 
                                                'bg-primary border-ui-border text-text-muted hover:border-text-muted'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </aside>

                            {/* Main Question Area */}
                            <main className="flex-1 p-12 overflow-y-auto bg-ui-dark">
                                <div className="max-w-3xl mx-auto">
                                    <div className="flex items-center justify-between mb-8">
                                        <span className="px-4 py-1.5 bg-primary border border-ui-border rounded-xl text-xs font-bold text-text-muted">Problem {currentQuestionIdx + 1}</span>
                                        <span className="text-sm font-bold text-orange-400">{currentQuestion.marks} Marks</span>
                                    </div>
                                    
                                    <div className="mb-12">
                                        <p className="text-2xl font-bold text-text-primary leading-relaxed whitespace-pre-wrap">
                                            {currentQuestion.text}
                                        </p>
                                    </div>

                                    <div className="space-y-4 mb-12">
                                        {currentQuestion.options?.map((option, i) => (
                                            <button 
                                                key={i}
                                                onClick={() => setAnswers({...answers, [currentQuestion.id]: option})}
                                                className={`w-full text-left p-6 rounded-2xl border transition-all flex items-center gap-4 group ${
                                                    answers[currentQuestion.id] === option ? 'bg-orange-500/10 border-orange-500 shadow-glow-orange-sm' : 'bg-ui-card border-ui-border hover:border-text-muted'
                                                }`}
                                            >
                                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm ${
                                                    answers[currentQuestion.id] === option ? 'bg-orange-500 border-orange-500 text-primary' : 'border-ui-border text-text-muted group-hover:text-text-primary'
                                                }`}>
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                                <span className={`text-lg transition-colors ${answers[currentQuestion.id] === option ? 'text-text-primary font-bold' : 'text-text-secondary'}`}>
                                                    {option}
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center pt-8 border-t border-ui-border">
                                        <button 
                                            disabled={currentQuestionIdx === 0}
                                            onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                                            className="px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 text-text-muted hover:text-text-primary disabled:opacity-0"
                                        >
                                            <ChevronLeft className="w-5 h-5" /> Previous
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if (currentQuestionIdx < exam.questions.length - 1) {
                                                    setCurrentQuestionIdx(prev => prev + 1);
                                                } else {
                                                    handleAutoSubmit();
                                                }
                                            }}
                                            className="px-10 py-4 bg-orange-500 text-primary font-black rounded-2xl shadow-glow-orange hover:scale-105 transition-all text-xs flex items-center gap-3"
                                        >
                                            {currentQuestionIdx === exam.questions.length - 1 ? 'Finish Exam' : 'Save & Next'} <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                )}

                {/* Result State */}
                {gameState === 'result' && (
                    <div className="max-w-5xl mx-auto px-4 py-20">
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-black text-rose-400 uppercase tracking-[0.3em] mb-4">Post-Exam Transcript</h2>
                            <h1 className="text-5xl md:text-7xl font-black text-text-primary tracking-tighter mb-4">You're <span className="text-emerald-400">Battle-Tested.</span></h1>
                            <p className="text-xl text-text-secondary">Analysis of your performance in {exam.title}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="bg-ui-card border border-ui-border p-10 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden group">
                                <BarChart className="absolute -top-4 -left-4 w-32 h-32 opacity-5 text-emerald-400" />
                                <p className="text-[10px] font-black text-text-muted uppercase mb-2 tracking-widest">Final Score</p>
                                <p className="text-6xl font-black text-emerald-400 mb-2">{calculateScore()}</p>
                                <p className="text-xs font-bold text-text-muted uppercase">Rank Estimation: ~540</p>
                            </div>
                            <div className="bg-ui-card border border-ui-border p-10 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden group">
                                <Zap className="absolute -top-4 -right-4 w-32 h-32 opacity-5 text-orange-400" />
                                <p className="text-[10px] font-black text-text-muted uppercase mb-2 tracking-widest">Accuracy</p>
                                <p className="text-6xl font-black text-orange-400 mb-2">{Math.round((Object.keys(answers).length / exam.questions.length) * 100)}%</p>
                                <p className="text-xs font-bold text-text-muted uppercase">Speed: Balanced</p>
                            </div>
                            <div className="bg-ui-card border border-ui-border p-10 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden group">
                                <Target className="absolute -bottom-4 -right-4 w-32 h-32 opacity-5 text-rose-400" />
                                <p className="text-[10px] font-black text-text-muted uppercase mb-2 tracking-widest">Percentile</p>
                                <p className="text-6xl font-black text-rose-400 mb-2">91.4</p>
                                <p className="text-xs font-bold text-text-muted uppercase">Recommended Revision: Algorithms</p>
                            </div>
                        </div>

                        {/* Weakness Analysis heatmap placeholder */}
                        <div className="bg-ui-card border border-ui-border rounded-[2.5rem] p-12 shadow-2xl">
                           <h3 className="text-2xl font-black mb-8">Concept <span className="text-rose-400">Weakness Heatmap</span></h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                              <div className="space-y-6">
                                 {Object.entries(exam.predictedWeightage || {}).map(([topic, weight]) => (
                                    <div key={topic}>
                                       <div className="flex justify-between mb-2">
                                          <span className="text-sm font-bold">{topic}</span>
                                          <span className="text-xs font-black text-text-muted">{weight}% Weight</span>
                                       </div>
                                       <div className="h-2.5 bg-primary rounded-full overflow-hidden">
                                          <div className={`h-full ${weight > 12 ? 'bg-rose-500' : 'bg-highlight'}`} style={{ width: `${weight * 5}%` }}></div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                              <div className="bg-primary/30 rounded-3xl p-8 border border-ui-border relative border-dashed">
                                 <h4 className="font-black text-lg mb-4 flex items-center gap-2">
                                    <Rocket className="w-5 h-5 text-highlight" /> Adaptive Action Plan
                                 </h4>
                                 <ul className="space-y-4">
                                    <li className="text-sm text-text-secondary flex gap-3">
                                       <div className="w-1 h-1 bg-highlight rounded-full mt-2"></div>
                                       Revise <b>Master Theorem</b> and <b>Heap Complexity</b>.
                                    </li>
                                    <li className="text-sm text-text-secondary flex gap-3">
                                       <div className="w-1 h-1 bg-highlight rounded-full mt-2"></div>
                                       Solve 10+ Dynamic Programming problems in the Practice Engine.
                                    </li>
                                    <li className="text-sm text-text-secondary flex gap-3">
                                       <div className="w-1 h-1 bg-highlight rounded-full mt-2"></div>
                                       Retake Mock in 7 days after revision.
                                    </li>
                                 </ul>
                                 <Link href="/navigator" className="mt-8 block w-full py-4 bg-highlight text-primary font-black text-center rounded-2xl shadow-glow-blue">
                                    Go to Navigator
                                 </Link>
                              </div>
                           </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const examId = params?.id as string;
    const exam = mockExams.find(e => e.id === examId);

    if (!exam) return { notFound: true };

    return {
        props: { exam }
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: mockExams.map(e => ({ params: { id: e.id } })),
        fallback: false
    };
};
