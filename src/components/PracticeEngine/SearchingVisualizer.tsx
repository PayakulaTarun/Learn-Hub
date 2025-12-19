
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, ChevronRight, ChevronLeft, 
  Search, Info, Zap, Settings 
} from 'lucide-react';
import Layout from '../Layout';

type SearchState = {
  array: number[];
  checkingIndices: number[];
  foundIndex?: number;
  low?: number;
  high?: number;
  mid?: number;
  message: string;
};

export default function SearchingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [algorithm, setAlgorithm] = useState<'linear' | 'binary'>('linear');
  const [size, setSize] = useState(20);
  const [speed, setSpeed] = useState(50);
  const [isSearching, setIsSearching] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<SearchState[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateArray = () => {
    stopSearching();
    let newArray = [];
    for (let i = 0; i < size; i++) {
      newArray.push(Math.floor(Math.random() * 90) + 10);
    }
    if (algorithm === 'binary') newArray.sort((a, b) => a - b);
    
    setArray(newArray);
    const randomTarget = newArray[Math.floor(Math.random() * size)];
    setTarget(randomTarget);
    setSteps([{ array: [...newArray], checkingIndices: [], message: 'Ready to search' }]);
    setCurrentStep(0);
  };

  useEffect(() => {
    generateArray();
  }, [size, algorithm]);

  const stopSearching = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSearching(false);
  };

  const recordSearch = () => {
    const recorded: SearchState[] = [];
    const arr = [...array];
    
    if (algorithm === 'linear') {
      for (let i = 0; i < arr.length; i++) {
        recorded.push({ array: arr, checkingIndices: [i], message: `Checking index ${i} (Value: ${arr[i]})` });
        if (arr[i] === target) {
          recorded.push({ array: arr, checkingIndices: [], foundIndex: i, message: `Target ${target} found at index ${i}!` });
          break;
        }
      }
      if (recorded[recorded.length-1].foundIndex === undefined) {
          recorded.push({ array: arr, checkingIndices: [], message: `Target ${target} not found in array.` });
      }
    } else {
      let low = 0, high = arr.length - 1;
      while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        recorded.push({ array: arr, checkingIndices: [mid], low, high, mid, message: `Checking mid point ${mid} (Value: ${arr[mid]})` });
        if (arr[mid] === target) {
          recorded.push({ array: arr, checkingIndices: [], low, high, mid, foundIndex: mid, message: `Target ${target} found at index ${mid}!` });
          break;
        }
        if (arr[mid] < target) {
          low = mid + 1;
          recorded.push({ array: arr, checkingIndices: [], low, high, message: `${arr[mid]} < ${target}. Searching right half.` });
        } else {
          high = mid - 1;
          recorded.push({ array: arr, checkingIndices: [], low, high, message: `${arr[mid]} > ${target}. Searching left half.` });
        }
      }
      if (recorded[recorded.length-1].foundIndex === undefined) {
          recorded.push({ array: arr, checkingIndices: [], message: `Target ${target} not found in range.` });
      }
    }
    setSteps(recorded);
    return recorded;
  };

  const startSearch = () => {
    const newSteps = recordSearch();
    setIsSearching(true);
    let i = 0;
    const interval = Math.max(10, 500 - speed * 4);
    timerRef.current = setInterval(() => {
      if (i >= newSteps.length) {
        stopSearching();
        return;
      }
      setCurrentStep(i);
      i++;
    }, interval);
  };

  const currentData = steps[currentStep] || { checkingIndices: [], message: '' };

  return (
    <Layout title="Search Visualizer | Student Resource Hub">
      <div className="bg-primary min-h-screen text-text-primary p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Search className="w-8 h-8 text-accent" /> Searching Visualizer
              </h1>
              <p className="text-text-secondary mt-2">Visualize Linear and Binary Search step-by-step.</p>
            </div>

            <div className="flex bg-ui-card p-1.5 rounded-2xl border border-ui-border">
              <button 
                onClick={() => setAlgorithm('linear')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${algorithm === 'linear' ? 'bg-accent text-primary shadow-glow' : 'text-text-muted'}`}
              >
                Linear Search
              </button>
              <button 
                onClick={() => setAlgorithm('binary')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${algorithm === 'binary' ? 'bg-accent text-primary shadow-glow' : 'text-text-muted'}`}
              >
                Binary Search
              </button>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 bg-ui-dark rounded-3xl border border-ui-border p-8 min-h-[400px] flex flex-col justify-between">
               
               <div className="text-center mb-12">
                  <span className="text-xs font-mono text-text-muted uppercase tracking-widest border border-ui-border px-4 py-1 rounded-full">
                    Target: <span className="text-accent font-bold">{target}</span>
                  </span>
               </div>

               <div className="flex flex-wrap items-center justify-center gap-2">
                  {array.map((val, idx) => {
                    let color = 'bg-ui-card border-ui-border text-text-muted';
                    let glow = '';
                    
                    if (currentData.checkingIndices.includes(idx)) {
                      color = 'bg-yellow-400 border-yellow-400 text-primary';
                      glow = 'scale-110 shadow-glow';
                    } else if (currentData.foundIndex === idx) {
                      color = 'bg-emerald-500 border-emerald-500 text-primary';
                      glow = 'scale-125 shadow-glow';
                    } else if (algorithm === 'binary' && currentData.low !== undefined && currentData.high !== undefined) {
                      if (idx < currentData.low || idx > currentData.high) {
                        color = 'opacity-20 bg-ui-card border-ui-border text-text-muted';
                      } else if (idx === currentData.mid) {
                        color = 'bg-highlight border-highlight text-primary';
                      } else {
                        color = 'bg-accent/10 border-accent/30 text-text-primary';
                      }
                    }

                    return (
                      <div 
                        key={idx}
                        className={`w-12 h-12 flex items-center justify-center border-2 rounded-xl font-bold transition-all duration-300 ${color} ${glow} text-sm`}
                      >
                        {val}
                      </div>
                    );
                  })}
               </div>

               <div className="mt-12 bg-primary/40 p-4 rounded-2xl border border-ui-border text-center">
                  <p className="text-sm font-mono text-accent">{currentData.message}</p>
               </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
               <div className="bg-ui-card rounded-2xl border border-ui-border p-6 shadow-xl">
                  <h3 className="font-bold mb-4 flex items-center gap-2"><Settings className="w-4 h-4 text-accent" /> Parameters</h3>
                  <div className="space-y-4">
                     <div>
                        <div className="flex justify-between text-[10px] uppercase font-bold text-text-muted mb-2">
                           <span>Array Size</span>
                           <span className="text-accent">{size}</span>
                        </div>
                        <input type="range" min="5" max="40" value={size} onChange={(e) => setSize(Number(e.target.value))} disabled={isSearching} className="w-full accent-accent" />
                     </div>
                     <div>
                        <div className="flex justify-between text-[10px] uppercase font-bold text-text-muted mb-2">
                           <span>Animation Speed</span>
                           <span className="text-accent">{speed}%</span>
                        </div>
                        <input type="range" min="1" max="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-highlight" />
                     </div>
                     <button 
                        onClick={generateArray}
                        disabled={isSearching}
                        className="w-full py-2 bg-primary/50 text-text-primary rounded-xl text-xs font-bold border border-ui-border hover:bg-ui-card transition-all"
                     >
                        Reset Array
                     </button>
                  </div>
               </div>

               <button 
                onClick={startSearch}
                disabled={isSearching}
                className="w-full py-4 bg-accent text-primary rounded-2xl font-bold shadow-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
               >
                 <Play className="w-5 h-5 fill-current" /> Start Search
               </button>

               <div className="bg-ui-card rounded-2xl border border-ui-border p-6 shadow-xl">
                  <h3 className="font-bold mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-highlight" /> Complexity</h3>
                  <div className="space-y-2">
                     <p className="text-xs text-text-secondary">Best Case: <span className="text-emerald-400 font-mono">O(1)</span></p>
                     <p className="text-xs text-text-secondary">Worst Case: <span className="text-rose-400 font-mono">{algorithm === 'linear' ? 'O(n)' : 'O(log n)'}</span></p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


