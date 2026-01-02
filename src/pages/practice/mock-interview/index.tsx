import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { Mic, MicOff, Send, Trophy, BookOpen, AlertCircle, CheckCircle, ChevronRight, Download, Brain, Star, Clock } from 'lucide-react';
import { auth } from '@/lib/firebase';

const SUBJECTS = [
    { id: 'java', title: 'Java Programming', icon: '☕' },
    { id: 'react', title: 'React & Frontend', icon: '⚛️' },
    { id: 'javascript', title: 'JavaScript (ES6+)', icon: '📜' },
    { id: 'python', title: 'Python Development', icon: '🐍' },
    { id: 'cpp-programming', title: 'C++ Programming', icon: '⚙️' },
    { id: 'dbms', title: 'Database Systems', icon: '🗄️' },
    { id: 'operating-systems', title: 'Operating Systems', icon: '💻' },
    { id: 'computer-networks', title: 'Computer Networks', icon: '🌐' },
    { id: 'machine-learning', title: 'Machine Learning', icon: '🤖' },
    { id: 'next-js', title: 'Next.js Framework', icon: '▲' }
];

export default function MockInterviewPage() {
    const [step, setStep] = useState<'select' | 'interview' | 'report'>('select');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [questionNumber, setQuestionNumber] = useState(1);
    const [userAnswer, setUserAnswer] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<any>(null);
    const [error, setError] = useState('');

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                setUserAnswer(transcript);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
        setIsListening(!isListening);
    };

    const startInterview = async (subject: string) => {
        setIsLoading(true);
        setError('');
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Please login to start mock interview');
            const token = await user.getIdToken();

            const res = await fetch('/api/ai/mock/start', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ subject })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setSessionId(data.sessionId);
            setCurrentQuestion(data.firstQuestion);
            setSelectedSubject(subject);
            setStep('interview');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const submitAnswer = async () => {
        if (!userAnswer.trim()) return;
        setIsLoading(true);
        try {
            const user = auth.currentUser;
            const token = await user?.getIdToken();

            const res = await fetch('/api/ai/mock/submit', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ sessionId, answer: userAnswer })
            });
            const data = await res.json();
            
            if (data.isFinished) {
                finalizeInterview();
            } else {
                setCurrentQuestion(data.nextQuestion);
                setQuestionNumber(prev => prev + 1);
                setUserAnswer('');
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const finalizeInterview = async () => {
        setIsLoading(true);
        try {
            const user = auth.currentUser;
            const token = await user?.getIdToken();

            const res = await fetch('/api/ai/mock/finalize', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ sessionId })
            });
            const data = await res.json();
            setReport(data);
            setStep('report');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                        Subject-Based Mock Interview
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Sharpen your technical skills with our AI-powered mock coach. 
                        Grounded in real static subject content and expert QA data.
                    </p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl flex items-center border border-red-100 animate-shake">
                        <AlertCircle className="mr-3 h-5 w-5" />
                        {error}
                    </div>
                )}

                {/* Step 1: Selection */}
                {step === 'select' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SUBJECTS.map((sub) => (
                            <button
                                key={sub.id}
                                onClick={() => startInterview(sub.id)}
                                disabled={isLoading}
                                className="group p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 text-left relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <span className="text-6xl">{sub.icon}</span>
                                </div>
                                <div className="text-3xl mb-4">{sub.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{sub.title}</h3>
                                <p className="text-sm text-gray-500 mb-6">50 Questions • Evaluation Matrix • Readiness Score</p>
                                <div className="flex items-center text-blue-600 font-medium text-sm">
                                    Start Mock Interview <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Step 2: Interview */}
                {step === 'interview' && (
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                            {/* Progress Header */}
                            <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">QUESTION {questionNumber}/50</span>
                                    <span className="text-gray-400 text-xs">Subject: {selectedSubject.toUpperCase()}</span>
                                </div>
                                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-600 transition-all duration-500" 
                                        style={{ width: `${(questionNumber / 50) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Question Area */}
                            <div className="p-10">
                                <div className="flex items-start mb-8">
                                    <div className="bg-blue-600 p-3 rounded-2xl mr-4 shadow-lg shadow-blue-200">
                                        <Brain className="text-white h-6 w-6" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900 leading-tight">
                                        {currentQuestion}
                                    </h2>
                                </div>

                                {/* Answer Input */}
                                <div className="relative mb-6">
                                    <textarea
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        placeholder="Type or speak your answer here..."
                                        rows={6}
                                        className="w-full p-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all duration-300 resize-none outline-none text-gray-800 text-lg leading-relaxed"
                                    />
                                    
                                    <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                                        <button
                                            onClick={toggleListening}
                                            className={`p-3 rounded-xl transition-all duration-300 ${
                                                isListening 
                                                ? 'bg-red-100 text-red-600 animate-pulse' 
                                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                            }`}
                                            title={isListening ? 'Stop Listening' : 'Voice Input'}
                                        >
                                            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={submitAnswer}
                                    disabled={isLoading || !userAnswer.trim()}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:shadow-2xl hover:translate-y-[-2px] active:translate-y-[0] transition-all disabled:opacity-50 flex items-center justify-center text-lg"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center italic">
                                            Analyzing Answer... <div className="ml-2 animate-bounce">⚡</div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            Submit Answer <Send className="ml-2 h-5 w-5" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-center space-x-6 text-gray-400 text-sm italic">
                            <div className="flex items-center"><CheckCircle className="h-4 w-4 mr-1 text-green-500" /> Grounded Evaluation</div>
                            <div className="flex items-center"><CheckCircle className="h-4 w-4 mr-1 text-green-500" /> Syllabus Bound</div>
                            <div className="flex items-center"><CheckCircle className="h-4 w-4 mr-1 text-green-500" /> No Grammar Judgment</div>
                        </div>
                    </div>
                )}

                {/* Step 3: Report */}
                {step === 'report' && report && (
                    <div className="max-w-4xl mx-auto animate-fadeIn">
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                            {/* Report Header */}
                            <div className="bg-gradient-to-br from-indigo-900 to-blue-800 p-12 text-white text-center">
                                <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-6 drop-shadow-lg" />
                                <h2 className="text-4xl font-black mb-2 tracking-tight">{report.title}</h2>
                                <p className="text-blue-200 mb-8 font-medium">Subject: {report.subject.toUpperCase()} • {report.date}</p>
                                
                                <div className="grid grid-cols-3 gap-8">
                                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                                        <div className="text-3xl font-bold text-white mb-1">{report.overallScore}%</div>
                                        <div className="text-xs text-blue-200 uppercase tracking-widest font-black">Overall Score</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                                        <div className="text-3xl font-bold text-white mb-1">{report.readinessLevel}</div>
                                        <div className="text-xs text-blue-200 uppercase tracking-widest font-black">Readiness Level</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                                        <div className="text-3xl font-bold text-white mb-1">{report.totalAttempted}</div>
                                        <div className="text-xs text-blue-200 uppercase tracking-widest font-black">Questions</div>
                                    </div>
                                </div>
                            </div>

                            {/* Report Body */}
                            <div className="p-10 space-y-12">
                                {/* Topic Strength */}
                                <div>
                                    <div className="flex items-center mb-6">
                                        <Star className="text-yellow-500 h-6 w-6 mr-3" />
                                        <h3 className="text-2xl font-bold text-gray-900">Topic-wise Readiness</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-5 bg-green-50 border border-green-100 rounded-2xl">
                                            <div className="text-green-700 font-bold mb-2 flex items-center"><div className="h-2 w-2 rounded-full bg-green-500 mr-2" /> STRONG</div>
                                            <div className="space-y-1">
                                                {report.readinessSummary.strong.map((t: any) => (
                                                    <div key={t} className="text-sm text-green-600 font-medium">• {t}</div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-5 bg-yellow-50 border border-yellow-100 rounded-2xl">
                                            <div className="text-yellow-700 font-bold mb-2 flex items-center"><div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" /> MEDIUM</div>
                                            <div className="space-y-1">
                                                {report.readinessSummary.medium.map((t: any) => (
                                                    <div key={t} className="text-sm text-yellow-600 font-medium">• {t}</div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-5 bg-red-50 border border-red-100 rounded-2xl">
                                            <div className="text-red-700 font-bold mb-2 flex items-center"><div className="h-2 w-2 rounded-full bg-red-500 mr-2" /> WEAK</div>
                                            <div className="space-y-1">
                                                {report.readinessSummary.weak.map((t: any) => (
                                                    <div key={t} className="text-sm text-red-600 font-medium">• {t}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Improvement Plan */}
                                <div>
                                    <div className="flex items-center mb-6">
                                        <BookOpen className="text-indigo-600 h-6 w-6 mr-3" />
                                        <h3 className="text-2xl font-bold text-gray-900">Personalized Improvement Plan</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {report.improvementPlan.map((plan: any) => (
                                            <div key={plan.topic} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className="text-lg font-bold text-gray-900">{plan.topic}</h4>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${plan.status === 'Weak' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                        {plan.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-500 text-sm mb-4">{plan.reason}</p>
                                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Recommended Actions</div>
                                                    <ul className="space-y-2">
                                                        {plan.actions.map((action: string, i: number) => (
                                                            <li key={i} className="text-sm text-gray-700 flex items-center italic">
                                                                <ChevronRight className="h-3 w-3 mr-2 text-indigo-500" /> {action}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Final Feedback */}
                                <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 text-center">
                                    <div className="text-blue-700 font-black uppercase tracking-widest text-xs mb-4">Coach Guidance</div>
                                    <p className="text-xl text-blue-900 font-medium leading-relaxed italic">"{report.feedback}"</p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                                    <button 
                                        onClick={() => window.print()}
                                        className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-2xl flex items-center justify-center hover:bg-black transition-all"
                                    >
                                        <Download className="mr-2 h-5 w-5" /> Export as Report
                                    </button>
                                    <button 
                                        onClick={() => setStep('select')}
                                        className="flex-1 py-4 bg-white border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:border-blue-500 hover:text-blue-600 transition-all"
                                    >
                                        Retake Another Subject
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

const styles = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
.animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.animate-shake { animation: shake 0.5s ease-in-out; }
`;
