
import React from 'react';
import { 
  CheckCircle2, AlertTriangle, Info, Zap, 
  ChevronRight, BarChart, Layout, MessageSquare,
  ShieldCheck, AlertCircle
} from 'lucide-react';
import { CodeReviewResult } from '../../types/evaluator';

interface CodeReviewPanelProps {
    result: CodeReviewResult;
    onClose: () => void;
}

export default function CodeReviewPanel({ result, onClose }: CodeReviewPanelProps) {
    return (
        <div className="bg-ui-card border border-ui-border rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-right duration-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500/20 to-orange-500/10 p-8 border-b border-ui-border">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-black text-rose-400 mb-1">AI Performance Review</h3>
                        <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Industry Readiness Analysis</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-primary/40 p-4 rounded-2xl border border-ui-border text-center">
                        <p className="text-[9px] font-black text-text-muted uppercase mb-1">Overall</p>
                        <p className={`text-2xl font-black ${result.score > 80 ? 'text-emerald-400' : 'text-orange-400'}`}>{result.score}</p>
                    </div>
                    <div className="bg-primary/40 p-4 rounded-2xl border border-ui-border text-center">
                        <p className="text-[9px] font-black text-text-muted uppercase mb-1">Clean Code</p>
                        <p className="text-2xl font-black text-highlight">{result.cleanCodeScore}</p>
                    </div>
                    <div className="bg-primary/40 p-4 rounded-2xl border border-ui-border text-center">
                        <p className="text-[9px] font-black text-text-muted uppercase mb-1">Readability</p>
                        <p className="text-2xl font-black text-emerald-400">{result.readabilityScore}</p>
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                {/* Complexity Analysis */}
                <div>
                   <h4 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-text-muted mb-4">
                      <BarChart className="w-4 h-4 text-rose-400" /> Complexity Analysis
                   </h4>
                   <div className="flex gap-4">
                      <div className="flex-1 p-4 bg-primary/20 rounded-2xl border border-ui-border">
                         <span className="text-[9px] font-bold text-text-muted uppercase block mb-1">Time Complexity</span>
                         <code className="text-rose-400 font-bold">{result.complexityAnalysis.time}</code>
                      </div>
                      <div className="flex-1 p-4 bg-primary/20 rounded-2xl border border-ui-border">
                         <span className="text-[9px] font-bold text-text-muted uppercase block mb-1">Space Complexity</span>
                         <code className="text-orange-400 font-bold">{result.complexityAnalysis.space}</code>
                      </div>
                   </div>
                </div>

                {/* Detailed Findings */}
                <div>
                    <h4 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-text-muted mb-4">
                      <MessageSquare className="w-4 h-4 text-highlight" /> Core Findings
                    </h4>
                    <div className="space-y-4">
                        {result.findings.length === 0 ? (
                            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                <p className="text-sm font-medium text-emerald-400">Industry Standard Code. No major issues found.</p>
                            </div>
                        ) : (
                            result.findings.map((f, i) => (
                                <div key={i} className={`p-6 rounded-2xl border flex gap-4 ${
                                    f.type === 'optimization' ? 'bg-rose-500/10 border-rose-500/20' : 
                                    f.type === 'style' ? 'bg-highlight/10 border-highlight/20' : 'bg-orange-500/10 border-orange-500/20'
                                }`}>
                                    <div className="mt-1">
                                        {f.type === 'optimization' ? <Zap className="w-5 h-5 text-rose-500" /> : 
                                         f.type === 'style' ? <Layout className="w-5 h-5 text-highlight" /> : 
                                         <AlertCircle className="w-5 h-5 text-orange-400" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-primary mb-1">{f.message}</p>
                                        <p className="text-xs text-text-secondary leading-relaxed">{f.suggestion}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="p-8 pt-0">
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-primary border border-ui-border rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-ui-border transition-colors"
                >
                  Continue Coding
                </button>
            </div>
        </div>
    );
}
