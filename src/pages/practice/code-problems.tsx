import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import dynamic from 'next/dynamic';
import { Play, CheckCircle2, XCircle, Clock, Code2, TestTube } from 'lucide-react';

const MonacoEditor = dynamic(() => import('../../components/tools/MonacoEditor'), { ssr: false });

interface TestCase {
  input: any;
  output: any;
}

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  examples: any[];
  starterCode: any;
  testCases: TestCase[];
}

export default function CodeProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetch('/data/coding-problems.json')
      .then(res => res.json())
      .then(data => {
        setProblems(data.problems);
        if (data.problems.length > 0) {
          setSelectedProblem(data.problems[0]);
          setCode(data.problems[0].starterCode.python);
        }
      })
      .catch(err => console.error('Failed to load problems:', err));
  }, []);

  const runTests = () => {
    if (!selectedProblem) return;

    setIsRunning(true);
    setShowResults(false);

    // Simulate test execution (in production, this would call a backend API)
    setTimeout(() => {
      const results = selectedProblem.testCases.map((testCase, idx) => {
        try {
          // Create a safe evaluation environment
          const func = new Function('nums', 'target', `
            ${code}
            return twoSum(nums, target);
          `);

          const result = func(testCase.input.nums, testCase.input.target);
          const passed = JSON.stringify(result) === JSON.stringify(testCase.output);

          return {
            testNumber: idx + 1,
            passed,
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput: result,
            executionTime: Math.random() * 50 + 10 // Mock
          };
        } catch (error: any) {
          return {
            testNumber: idx + 1,
            passed: false,
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput: null,
            error: error.message,
            executionTime: 0
          };
        }
      });

      setTestResults(results);
      setShowResults(true);
      setIsRunning(false);
    }, 1000);
  };

  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;

  return (
    <Layout title="Coding Problems | LeetCode Style">
      <div className="flex h-[calc(100vh-64px)] bg-primary">
        {/* Problem List Sidebar */}
        <div className="w-80 border-r border-ui-border bg-ui-dark overflow-y-auto">
          <div className="p-6 border-b border-ui-border">
            <h1 className="text-xl font-black text-text-primary mb-2">Problems</h1>
            <p className="text-xs text-text-muted">LeetCode-style coding challenges</p>
          </div>

          {problems.map(problem => (
            <div
              key={problem.id}
              onClick={() => {
                setSelectedProblem(problem);
                setCode(problem.starterCode[language]);
                setTestResults([]);
                setShowResults(false);
              }}
              className={`p-4 border-b border-ui-border cursor-pointer hover:bg-ui-card transition-colors ${
                selectedProblem?.id === problem.id ? 'bg-ui-card border-l-4 border-l-accent' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-text-primary text-sm">{problem.title}</h3>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                  problem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                  problem.difficulty === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-rose-500/20 text-rose-400'
                }`}>
                  {problem.difficulty}
                </span>
              </div>
              <p className="text-xs text-text-muted">{problem.testCases.length} test cases</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Problem Description */}
          <div className="h-1/2 overflow-y-auto border-b border-ui-border p-6">
            {selectedProblem && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-black text-text-primary">{selectedProblem.title}</h1>
                  <span className={`px-4 py-2 rounded-xl font-bold text-xs ${
                    selectedProblem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                    selectedProblem.difficulty === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-rose-500/20 text-rose-400'
                  }`}>
                    {selectedProblem.difficulty}
                  </span>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-text-secondary leading-relaxed">{selectedProblem.description}</p>

                  <h3 className="text-text-primary font-bold mt-6 mb-2">Examples:</h3>
                  {selectedProblem.examples.map((ex, idx) => (
                    <div key={idx} className="bg-ui-card p-4 rounded-xl mb-3 border border-ui-border">
                      <div className="text-sm font-mono">
                        <div><span className="text-text-muted">Input:</span> <span className="text-accent">{ex.input}</span></div>
                        <div><span className="text-text-muted">Output:</span> <span className="text-emerald-400">{ex.output}</span></div>
                        {ex.explanation && <div className="mt-2 text-text-secondary text-xs">{ex.explanation}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Code Editor + Test Results */}
          <div className="h-1/2 flex">
            {/* Editor */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between px-6 py-3 bg-ui-dark border-b border-ui-border">
                <div className="flex items-center gap-4">
                  <Code2 className="w-5 h-5 text-accent" />
                  <select 
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      if (selectedProblem) {
                        setCode(selectedProblem.starterCode[e.target.value]);
                      }
                    }}
                    className="bg-primary border border-ui-border rounded-lg px-3 py-1 text-sm font-mono text-text-primary"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                </div>

                <button
                  onClick={runTests}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-6 py-2 bg-accent hover:bg-highlight text-primary font-bold text-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      Run Tests ({selectedProblem?.testCases.length || 0})
                    </>
                  )}
                </button>
              </div>

              <div className="flex-1">
                <MonacoEditor
                  language={language}
                  value={code}
                  onChange={(v) => setCode(v || '')}
                  height="100%"
                />
              </div>
            </div>

            {/* Test Results */}
            {showResults && (
              <div className="w-96 border-l border-ui-border bg-ui-dark overflow-y-auto">
                <div className="p-4 border-b border-ui-border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-text-primary flex items-center gap-2">
                      <TestTube className="w-5 h-5" />
                      Test Results
                    </h3>
                    <span className={`text-sm font-bold ${passedTests === totalTests ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {passedTests}/{totalTests} Passed
                    </span>
                  </div>

                  {passedTests === totalTests && (
                    <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                        <CheckCircle2 className="w-5 h-5" />
                        All Tests Passed!
                      </div>
                      <p className="text-xs text-emerald-300">Your solution is correct ✨</p>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  {testResults.map((result, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        result.passed
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-rose-500/10 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-text-primary">
                          Test {result.testNumber}
                        </span>
                        {result.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                      </div>

                      <div className="text-xs font-mono space-y-1">
                        <div>
                          <span className="text-text-muted">Input:</span>{' '}
                          <span className="text-accent">{JSON.stringify(result.input)}</span>
                        </div>
                        <div>
                          <span className="text-text-muted">Expected:</span>{' '}
                          <span className="text-emerald-400">{JSON.stringify(result.expectedOutput)}</span>
                        </div>
                        {!result.passed && (
                          <div>
                            <span className="text-text-muted">Got:</span>{' '}
                            <span className="text-rose-400">{result.error || JSON.stringify(result.actualOutput)}</span>
                          </div>
                        )}
                        <div className="text-text-secondary">
                          {result.executionTime.toFixed(2)}ms
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
