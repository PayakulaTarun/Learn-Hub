
import React, { useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '../../../../components/Layout';
import { 
  ArrowLeft, ChevronRight, Zap, Trophy, 
  Target, Info, Code, ShieldCheck, Clock,
  Layout as LayoutIcon, MessageSquare
} from 'lucide-react';
import { companies } from '../../../../lib/evaluatorData';
import { CompanyQuestion, CodeReviewResult } from '../../../../types/evaluator';
import InteractiveEditor from '../../../../components/PracticeEngine/InteractiveEditor';
import CodeReviewPanel from '../../../../components/Evaluator/CodeReviewPanel';
import { analyzeCode } from '../../../../lib/codeReviewer';
import { getCompanyQuestions } from '../../../../lib/battlegroundLoader';
import { executeCode } from '../../../../lib/codeRunner';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { SUPPORTED_LANGUAGES } from '../../../../lib/languages';

interface SolvePageProps {
  question: CompanyQuestion;
  companyName: string;
}

export default function SolvePage({ question, companyName }: SolvePageProps) {
    const [reviewResult, setReviewResult] = useState<CodeReviewResult | null>(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes default for interview

    const [isExecuting, setIsExecuting] = useState(false);
    const [executionLogs, setExecutionLogs] = useState<string[]>([]);
    const [currentLanguage, setCurrentLanguage] = useState('javascript');

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' + s : s}`;
    };

    
    // Helper to generate driver code based on problem type and language
    const generateDriver = (userCode: string, question: CompanyQuestion, lang: string) => {
        const testCases = question.testCases || [];
        if (testCases.length === 0) return userCode;

        if (lang === 'python') {
            const runner = `
import sys
import json

${userCode}

cases = json.loads('${JSON.stringify(testCases).replace(/'/g, "\\'")}')
passed = 0

def list_to_arr(head):
    arr = []
    while head:
        arr.append(head.val)
        head = head.next
    return arr

def arr_to_list(arr):
    dummy = ListNode(0)
    curr = dummy
    for val in arr:
        curr.next = ListNode(val)
        curr = curr.next
    return dummy.next

# Test Logic
try:
    for i, tc in enumerate(cases):
        args = json.loads(tc['input'])
        expected = json.loads(tc['output'])
        
        # Preprocessing for Linked Lists
        if "${question.id}" == "amz-dsa-1":
            args = [arr_to_list(a) for a in args]
        
        sol = Solution()
        
        # Call based on problem ID
        if "${question.id}" == "amz-dsa-1":
            res = sol.mergeKLists(args)
            if res: res = list_to_arr(res)
            else: res = []
        elif "${question.id}" == "amz-dsa-2":
            res = sol.numIslands(args)
        # Fallback eval for generic
        else:
            # Python dynamic call is harder without specific names
            # Assume Solution class has only one method or fallback
            method_name = [m for m in dir(Solution) if not m.startswith('__')][0]
            method = getattr(sol, method_name)
            if isinstance(args, list):
                res = method(*args)
            else:
                res = method(args)
        
        # Comparison
        original_res = res
        if "${question.id}" == "amz-dsa-1":
             # Already converted
             pass
             
        # Normalize comparison (JSON dump)
        if json.dumps(res) == json.dumps(expected):
            passed += 1
            print(f"✅ Test {i+1}: PASS")
        else:
            print(f"❌ Test {i+1}: FAIL. Expected {expected}, Got {res}")

    print(f"FINAL_SCORE:{int((passed/len(cases))*100)}")
except Exception as e:
    print(f"🚨 Runtime Error: {str(e)}")
    print("FINAL_SCORE:0")
            `;
            return runner;
        }

        // Default: JavaScript Driver
        // Common definition polyfills
        const polyfills = `
        function ListNode(val, next) { this.val = (val===undefined ? 0 : val); this.next = (next===undefined ? null : next); }
        function TreeNode(val, left, right) { this.val = (val===undefined ? 0 : val); this.left = (left===undefined ? null : left); this.right = (right===undefined ? null : right); }
        
        function arrToList(arr) { if(!arr||!arr.length) return null; let head = new ListNode(arr[0]); let cur = head; for(let i=1; i<arr.length; i++) { cur.next = new ListNode(arr[i]); cur = cur.next; } return head; }
        function listToArr(node) { let arr = []; while(node) { arr.push(node.val); node = node.next; } return arr; }
        `;

        let runner = `
        const cases = ${JSON.stringify(testCases)};
        let passed = 0;
        
        // Infer function name from code or question ID
        let fnName = "";
        if ("${question.id}" === "amz-dsa-1") fnName = "mergeKLists";
        else if ("${question.id}" === "amz-dsa-2") fnName = "numIslands";
        else if ("${question.id}" === "amz-dsa-3") fnName = "ladderLength";
        else if ("${question.id}" === "amz-dsa-4") fnName = "optimalUtilization";
        
        try {
            cases.forEach((tc, idx) => {
                let args = JSON.parse(tc.input);
                
                // Pre-processing
                if ("${question.id}" === "amz-dsa-1") {
                    args = args.map(arrToList);
                }

                // Execution
                // dynamically find function if not hardcoded (naive regex)
                if (!fnName) {
                    const match = "${userCode}".match(/var\\s+(\\w+)\\s*=/);
                    if(match) fnName = match[1];
                }

                const fn = eval(fnName);
                if (typeof fn !== 'function') throw new Error("Function " + fnName + " not found");
                
                let result;
                if (Array.isArray(args) && "${question.id}" !== "amz-dsa-1") {
                     // Spread args for multi-arg functions
                     // EXCEPTION: amz-dsa-1 input is ONE array of linked lists, so we don't spread the outer array, we pass the array itself.
                     if ("${question.id}" === "amz-dsa-3") result = fn(...args);
                     else result = fn(args);
                } else {
                     result = fn(args);
                }

                // Post-processing
                if ("${question.id}" === "amz-dsa-1") result = listToArr(result);

                const outStr = JSON.stringify(result);
                const expectedStr = JSON.stringify(JSON.parse(tc.output));
                
                if (outStr === expectedStr) {
                    passed++;
                    console.log("✅ Test " + (idx+1) + ": PASS");
                } else {
                    console.log("❌ Test " + (idx+1) + ": FAIL. Expected " + expectedStr + ", Got " + outStr);
                }
            });
            console.log("FINAL_SCORE:" + Math.floor((passed / cases.length) * 100));
        } catch(e) {
            console.log("🚨 Runtime Error: " + e.message);
            console.log("FINAL_SCORE:0");
        }
        `;
        
        return polyfills + "\n" + userCode + "\n" + runner;
    };

    const handleCodeSubmit = async (code: string) => {
        setIsExecuting(true);
        setExecutionLogs([]);
        
        try {
            // 1. Generate Driver Code
            const executableCode = generateDriver(code, question, currentLanguage);
            
            // 2. Execute on Piston
            const result = await executeCode(executableCode, currentLanguage);
            
            // 3. Parse Output
            const logs = result.stdout.split('\n');
            const scoreLine = logs.find(l => l.startsWith("FINAL_SCORE:"));
            const score = scoreLine ? parseInt(scoreLine.split(':')[1]) : 0;
            const displayLogs = logs.filter(l => !l.startsWith("FINAL_SCORE:"));
            
            if (result.stderr) displayLogs.push("⚠️ Stderr: " + result.stderr);

            setExecutionLogs(displayLogs);

            // 4. Generate Analysis Result
            const review: CodeReviewResult = {
                score: score,
                cleanCodeScore: score > 80 ? 90 : 50, // Mocked secondary stats
                readabilityScore: 85,
                complexityAnalysis: {
                    time: score === 100 ? "O(N log K)" : "N/A",
                    space: "O(1)"
                },
                findings: displayLogs.map((l: string) => ({ // Explicit typing
                    type: (l.includes('FAIL') || l.includes('Error')) ? 'error' : 'optimization',
                    message: l,
                    suggestion: l.includes('FAIL') ? 'Check your logic against the failing case.' : 'Good job!'
                }))
            };

            setReviewResult(review);
            setIsReviewOpen(true);
            
            if (score === 100) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }

        } catch (e) {
             console.error(e);
        } finally {
            setIsExecuting(false);
        }
    };

    // Get boilerplate from template map or fallback
    const getInitialCode = () => {
        if (question.templates && question.templates[currentLanguage]) {
            return question.templates[currentLanguage].initialCode;
        }
        return question.initialCode || `// Write your ${currentLanguage} solution here`;
    };

    return (
        <Layout title={`Solving ${question.title} | ${companyName} Battleground`}>
            <div className="bg-ui-dark min-h-screen py-8">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Panel: Question Description */}
                    <div className="w-full lg:w-1/3 space-y-8 sticky top-24">
                        <div className="bg-ui-card border border-ui-border rounded-[2.5rem] p-8 shadow-xl">
                            <div className="flex justify-between items-center mb-8">
                                <Link href={`/evaluator/battlegrounds/${question.id.split('-')[0]}`} className="text-xs font-bold text-text-muted hover:text-rose-400 flex items-center gap-2">
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </Link>
                                <div className={`flex items-center gap-2 px-3 py-1 bg-primary border border-ui-border rounded-lg text-xs font-black ${timeLeft < 300 ? 'text-rose-500 animate-pulse' : 'text-orange-400'}`}>
                                    <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">{question.difficulty}</span>
                                    <span className="px-3 py-1 bg-primary border border-ui-border rounded-full text-[10px] font-black uppercase tracking-widest text-text-muted">{question.type}</span>
                                </div>
                                <h1 className="text-3xl font-black mb-2">{question.title}</h1>
                                <p className="text-sm text-text-muted font-bold uppercase tracking-tight">{companyName} Interview Series</p>
                            </div>

                            <div className="prose prose-invert max-w-none text-text-secondary mb-10">
                                <p className="leading-relaxed">
                                    {question.description}
                                </p>
                            </div>

                            {question.constraints && (
                                <div className="space-y-4 mb-10">
                                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                                        <ShieldCheck className="w-3.5 h-3.5 text-rose-500" /> Technical Constraints
                                    </h4>
                                    <div className="bg-primary/30 rounded-2xl p-6 border border-ui-border">
                                        <ul className="space-y-2">
                                            {question.constraints.map((c: string, i: number) => (
                                                <li key={i} className="text-xs text-text-secondary flex gap-2">
                                                    <span className="text-rose-500">•</span> {c}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {question.solutionSlug && (
                                <div className="p-6 bg-highlight/5 border border-highlight/20 rounded-2xl flex items-center justify-between group hover:bg-highlight/10 transition-all">
                                   <div className="flex items-center gap-4">
                                      <div className="p-3 bg-highlight/20 text-highlight rounded-xl">
                                         <Info className="w-5 h-5" />
                                      </div>
                                      <div>
                                         <p className="text-xs font-bold">Struggling with logic?</p>
                                         <p className="text-[10px] text-text-muted">Review the relevant tutorial</p>
                                      </div>
                                   </div>
                                   <Link href={`/subjects/${question.solutionSlug}`} className="p-2 text-text-muted hover:text-highlight transition-colors">
                                      <ChevronRight className="w-5 h-5" />
                                   </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Editor & Review */}
                    <div className="flex-1 w-full space-y-8">
                        {/* Language Selector */}
                        <div className="flex items-center gap-4">
                            <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest">Language:</h3>
                            <div className="flex gap-2">
                                {Object.values(SUPPORTED_LANGUAGES).map((lang: any) => (
                                    <button
                                        key={lang.id}
                                        onClick={() => setCurrentLanguage(lang.id)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                            currentLanguage === lang.id
                                            ? 'bg-rose-500 text-white border-rose-500 shadow-glow-rose'
                                            : 'bg-primary/50 text-text-muted border-ui-border hover:border-text-muted'
                                        }`}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <InteractiveEditor 
                                title={`${question.title} Lab`}
                                initialCode={getInitialCode()}
                                language={currentLanguage}
                                onSubmit={handleCodeSubmit}
                                submitLabel={isExecuting ? "Executing..." : "Run Tests"}
                                challengeMode={true}
                            />

                            {/* Review Side Drawer */}
                            {isReviewOpen && reviewResult && (
                                <div className="fixed inset-0 z-50 flex items-center justify-end p-4 md:p-8 pointer-events-none">
                                    <div className="absolute inset-0 bg-ui-dark/60 backdrop-blur-sm pointer-events-auto" onClick={() => setIsReviewOpen(false)}></div>
                                    <div className="w-full max-w-xl pointer-events-auto transform transition-all translate-x-0 animate-in slide-in-from-right duration-500">
                                        <CodeReviewPanel 
                                            result={reviewResult} 
                                            onClose={() => setIsReviewOpen(false)} 
                                        />
                                    </div>
                                </div>
                            )}
                        </div>


                        {/* Tip */}
                        <div className="bg-ui-card border border-ui-border p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 border-dashed">
                           <div className="p-4 bg-orange-500/20 text-orange-400 rounded-2xl">
                              <Target className="w-8 h-8" />
                           </div>
                           <div>
                              <h4 className="font-bold text-lg mb-1">Interview Tip</h4>
                              <p className="text-sm text-text-secondary leading-relaxed">
                                 {companyName} interviewers care as much about your <b>code structure</b> and <b>naming</b> as they do about correctness. Use the "Submit for Review" button to see how your code stacks up against industry standards.
                              </p>
                           </div>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const questionId = params?.id as string;
    let foundQuestion: CompanyQuestion | null = null;
    let foundCompanyName = "";

    for (const c of companies) {
        // Must load questions for each company to search
        const questions = getCompanyQuestions(c.id);
        const q = questions.find(q => q.id === questionId);
        if (q) {
            foundQuestion = q;
            foundCompanyName = c.name;
            break;
        }
    }

    if (!foundQuestion) return { notFound: true };

    return {
        props: { 
          question: foundQuestion,
          companyName: foundCompanyName
        }
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths: any[] = [];
    for (const c of companies) {
        const questions = getCompanyQuestions(c.id);
        questions.forEach(q => {
            paths.push({ params: { id: q.id } });
        });
    }

    return {
        paths,
        fallback: false
    };
};
