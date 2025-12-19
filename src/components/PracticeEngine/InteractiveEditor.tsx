import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Play, RotateCcw, Zap, CheckCircle2, XCircle, Info, ChevronDown } from 'lucide-react';
import { executeCode, ExecutionResult } from '../../lib/codeRunner';
import { useAnalytics } from '../../hooks/useAnalytics';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface InteractiveEditorProps {
  initialCode: string;
  language: string;
  expectedOutput?: string;
  challengeMode?: boolean;
  hints?: string[];
  title?: string;
  onSubmit?: (code: string) => void;
  submitLabel?: string;
}

export default function InteractiveEditor({ 
  initialCode, 
  language, 
  expectedOutput, 
  challengeMode = false,
  hints = [],
  title = "Code Laboratory",
  onSubmit,
  submitLabel = "Submit for Review"
}: InteractiveEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [showHints, setShowHints] = useState(false);
  const { trackEvent } = useAnalytics();

  const resetCode = () => {
    setCode(initialCode);
    setResult(null);
    setIsSuccess(null);
  };

  const run = async () => {
    setIsRunning(true);
    const res = await executeCode(code, language);
    setResult(res);
    setIsRunning(false);

    // Track standard code run
    trackEvent('run', 'problem', title, { language, success: !!res.output });

    if (expectedOutput && res.output.trim() === expectedOutput.trim()) {
      setIsSuccess(true);
      // Track successful solution
      trackEvent('solve', 'problem', title, { language, challengeMode });
    } else if (expectedOutput) {
      setIsSuccess(false);
    }
  };

  return (
    <div className="my-8 rounded-2xl border border-ui-border bg-ui-dark overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-ui-border bg-ui-card flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${challengeMode ? 'bg-rose-500/20 text-rose-400' : 'bg-accent/20 text-accent'}`}>
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary tracking-tight">{title}</h3>
            <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">
              {language} · {challengeMode ? 'CHALLENGE MODE' : 'FREE PRACTICE'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {hints.length > 0 && (
            <button 
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-text-muted hover:text-text-primary transition-colors"
            >
              <Info className="w-4 h-4" /> Hint
            </button>
          )}
          <button 
            onClick={resetCode}
            className="p-2 text-text-muted hover:text-text-primary transition-colors"
            title="Reset Code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={run}
            disabled={isRunning}
            className={`flex items-center gap-2 px-6 py-1.5 rounded-xl text-xs font-bold transition-all shadow-glow ${
              isRunning ? 'bg-ui-border opacity-50' : 'bg-accent text-primary hover:bg-highlight hover:text-white'
            }`}
          >
            {isRunning ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            {isRunning ? 'Compiling...' : 'Run Code'}
          </button>
          {onSubmit && (
            <button 
              onClick={() => onSubmit(code)}
              className="flex items-center gap-2 px-6 py-1.5 rounded-xl text-xs font-black transition-all bg-rose-500 text-primary hover:bg-rose-400 shadow-glow-rose"
            >
              <Zap className="w-4 h-4 fill-current" />
              {submitLabel}
            </button>
          )}
        </div>
      </div>

      {/* Hints */}
      {showHints && hints.length > 0 && (
        <div className="bg-primary/40 border-b border-ui-border p-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
             <ChevronDown className="w-4 h-4 text-accent mt-0.5" />
             <div className="flex-1 space-y-2">
                {hints.map((hint, i) => (
                  <p key={i} className="text-xs text-text-secondary leading-relaxed">
                    <span className="font-bold text-accent mr-2">Hint {i+1}:</span> {hint}
                  </p>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[400px]">
        {/* Editor */}
        <div className="lg:col-span-3 border-r border-ui-border relative min-h-[300px]">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(val) => setCode(val || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              scrollBeyondLastLine: false,
              padding: { top: 16 },
              automaticLayout: true,
            }}
          />
        </div>

        {/* Console / Result */}
        <div className="lg:col-span-2 bg-primary/20 flex flex-col">
          <div className="px-4 py-2 border-b border-ui-border flex justify-between items-center">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest font-bold">Console Output</span>
            {isSuccess !== null && (
              <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isSuccess ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {isSuccess ? 'Verified' : 'Mismatch'}
              </span>
            )}
          </div>
          
          <div className="flex-1 p-4 font-mono text-sm overflow-auto max-h-[400px]">
            {!result && !isRunning && (
              <p className="text-text-muted italic opacity-50">Press run to see output...</p>
            )}
            {isRunning && (
              <div className="flex items-center gap-3 text-accent animate-pulse">
                <div className="w-1 h-4 bg-accent animate-ping" />
                Executing on remote server...
              </div>
            )}
            {result && (
              <div className="space-y-4">
                {result.stdout && (
                  <pre className="text-emerald-400 whitespace-pre-wrap">{result.stdout}</pre>
                )}
                {result.stderr && (
                  <pre className="text-rose-400 whitespace-pre-wrap">{result.stderr}</pre>
                )}
                {!result.stdout && !result.stderr && result.output && (
                  <pre className="text-text-secondary whitespace-pre-wrap">{result.output}</pre>
                )}
              </div>
            )}
          </div>

          {challengeMode && isSuccess === false && (
            <div className="p-4 bg-rose-500/10 border-t border-rose-500/20">
               <p className="text-xs text-rose-400">
                 <strong>Expected:</strong> <code className="bg-rose-500/20 px-1 rounded">{expectedOutput}</code>
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
