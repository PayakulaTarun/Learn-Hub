
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, RotateCcw, Search, Settings, Zap 
} from 'lucide-react';

type SearchState = {
  array: number[];
  checkingIndices: number[];
  foundIndex?: number;
  low?: number;
  high?: number;
  mid?: number;
  message: string;
};

export default function SearchingLab() {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [algorithm, setAlgorithm] = useState<'linear' | 'binary'>('linear');
  const [size, setSize] = useState(15);
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
            recorded.push({ array: arr, checkingIndices: [], low, high, message: `${arr[mid]} < ${target}. Searching right.` });
        } else {
            high = mid - 1;
            recorded.push({ array: arr, checkingIndices: [], low, high, message: `${arr[mid]} > ${target}. Searching left.` });
        }
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
    <div className="bg-ui-dark rounded-2xl border border-ui-border overflow-hidden">
      <div className="p-4 border-b border-ui-border flex justify-between items-center bg-ui-card">
         <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-text-primary">Search Visualizer</span>
         </div>
         <div className="flex gap-2">
            <select 
              value={algorithm} 
              onChange={(e) => setAlgorithm(e.target.value as any)}
              className="bg-primary text-xs font-bold px-2 py-1 rounded border border-ui-border text-text-secondary"
            >
               <option value="linear">Linear</option>
               <option value="binary">Binary</option>
            </select>
            <button onClick={generateArray} className="p-1 text-text-muted hover:text-text-primary"><RotateCcw className="w-4 h-4" /></button>
         </div>
      </div>

      <div className="p-6">
         <div className="flex justify-center mb-6">
            <div className="px-4 py-1 bg-accent/20 border border-accent/20 rounded-full text-[10px] font-bold text-accent">
               TARGET: {target}
            </div>
         </div>

         <div className="flex flex-wrap justify-center gap-1.5 min-h-[60px]">
            {array.map((val, idx) => {
               let color = 'bg-ui-card text-text-muted border-ui-border';
               if (currentData.checkingIndices.includes(idx)) color = 'bg-yellow-400 text-primary border-yellow-400 scale-110';
               if (currentData.foundIndex === idx) color = 'bg-emerald-500 text-primary border-emerald-500 scale-110';
               if (algorithm === 'binary' && currentData.low !== undefined && currentData.high !== undefined) {
                   if (idx < currentData.low || idx > currentData.high) color = 'opacity-20 bg-ui-card';
               }

               return (
                 <div key={idx} className={`w-10 h-10 border flex items-center justify-center rounded-lg font-bold text-xs transition-all duration-300 ${color}`}>
                    {val}
                 </div>
               );
            })}
         </div>

         <div className="mt-8 p-3 bg-primary/40 border border-ui-border rounded-xl text-center">
            <p className="text-[10px] font-mono text-accent uppercase tracking-widest">{currentData.message}</p>
         </div>

         <div className="mt-6 flex gap-4 items-center">
            <div className="flex-1">
               <input type="range" min="1" max="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-accent h-1.5" />
            </div>
            <button 
              onClick={startSearch}
              className="px-6 py-2 bg-accent text-primary font-bold rounded-xl text-xs hover:bg-highlight hover:text-white transition-all shadow-glow"
            >
               Start Search
            </button>
         </div>
      </div>
    </div>
  );
}
