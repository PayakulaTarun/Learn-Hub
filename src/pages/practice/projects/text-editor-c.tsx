
import React, { useState } from 'react';
import Layout from '../../../components/Layout';
import InteractiveEditor from '../../../components/PracticeEngine/InteractiveEditor';
import { 
  Terminal, Layers, Code, Book, 
  ChevronRight, CheckCircle, Play, AlertCircle 
} from 'lucide-react';

const steps = [
  {
    title: "Step 1: The Raw Buffer",
    theory: "A text editor starts with a way to store characters. We'll use a fixed-size array (buffer) for simplicity in this mini-engine.",
    initialCode: "#include <stdio.h>\n\nint main() {\n  char buffer[1024];\n  printf(\"Enter text: \");\n  // BUG: scanf only reads until first space. Fix it to read whole line.\n  scanf(\"%s\", buffer);\n  printf(\"Buffered: %s\\n\", buffer);\n  return 0;\n}",
    fix: 'fgets(buffer, 1024, stdin);',
    expectedOutput: "Buffered: Hello World",
    hints: ["Try using fgets(buffer, size, stdin) to read a whole line."]
  },
  {
    title: "Step 2: String Length",
    theory: "We need to track how much text we have. Use strlen from string.h.",
    initialCode: "#include <stdio.h>\n#include <string.h>\n\nint main() {\n  char text[] = \"LearnHub IDE\";\n  // Calculate length\n  int len = 0; \n  printf(\"Length: %d\", len);\n  return 0;\n}",
    expectedOutput: "Length: 12",
    hints: ["The strlen() function returns the length of a string."]
  }
];

export default function TextEditorProject() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  return (
    <Layout title="Project: Build a Text Editor in C | LearnHub">
      <div className="bg-primary min-h-screen text-text-primary p-8">
        <div className="max-w-6xl mx-auto">
          {/* Project Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-[10px] font-bold tracking-widest uppercase border border-accent/20">Project Module</span>
              <span className="text-text-muted">•</span>
              <span className="text-text-secondary text-sm font-medium">C Programming</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Build a <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-highlight">Text Editor</span> from Scratch</h1>
            <p className="text-xl text-text-secondary max-w-3xl">Master memory management and buffer operations by building a functional CLI text editor engine in C.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Steps Navigation */}
            <div className="lg:col-span-1 space-y-4">
               <h3 className="text-sm font-bold uppercase tracking-tight text-text-muted mb-6">Course Outline</h3>
               {steps.map((s, i) => (
                 <button 
                  key={i}
                  disabled={i > currentStep + 1}
                  onClick={() => setCurrentStep(i)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                    currentStep === i 
                      ? 'bg-accent/10 border-accent/40 text-accent shadow-glow' 
                      : i < currentStep 
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                        : 'bg-ui-card border-ui-border text-text-muted opacity-50 grayscale'
                  }`}
                 >
                   <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                         currentStep === i ? 'bg-accent text-primary border-accent' : i < currentStep ? 'bg-emerald-500 text-primary border-emerald-500' : 'border-ui-border'
                      }`}>
                         {i < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className="text-xs font-bold leading-tight">{s.title}</span>
                   </div>
                   {currentStep === i && <ChevronRight className="w-4 h-4 animate-bounce-x" />}
                 </button>
               ))}
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-8">
               <div className="bg-ui-card border border-ui-border rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-highlight/20 text-highlight rounded-lg">
                        <Book className="w-5 h-5" />
                     </div>
                     <h2 className="text-2xl font-bold">{step.title}</h2>
                  </div>
                  <p className="text-text-secondary leading-relaxed mb-8">
                     {step.theory}
                  </p>
                  
                  {/* Embedded IDE */}
                  <InteractiveEditor 
                    initialCode={step.initialCode}
                    language="c"
                    challengeMode={true}
                    expectedOutput={step.expectedOutput}
                    hints={step.hints}
                    title="Editor Buffer Implementation"
                  />

                  <div className="mt-12 flex justify-between items-center">
                     <button 
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                      className="px-6 py-2 text-text-muted font-bold hover:text-text-primary disabled:opacity-0"
                     >
                       Previous Step
                     </button>
                     <button 
                      onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                      className="px-8 py-3 bg-highlight text-primary font-bold rounded-2xl hover:scale-105 transition-all shadow-glow-blue"
                     >
                       Next: {steps[currentStep + 1]?.title || 'Finish Project'}
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
