
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { 
  Play, Pause, RotateCcw, ChevronRight, ChevronLeft, 
  Settings, Info, Code, BarChart, Maximize2, Zap 
} from 'lucide-react';
import { ALGORITHM_DATA, AlgorithmType } from '../../lib/algorithms';

// --- Types ---
type SortState = {
  array: number[];
  activeIndices: number[];
  comparingIndices: number[];
  sortedIndices: number[];
  pivotIndex?: number;
  message?: string;
};

export default function SortingVisualizer() {
  // --- State ---
  const [array, setArray] = useState<number[]>([]);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('bubble');
  const [arraySize, setArraySize] = useState(30);
  const [speed, setSpeed] = useState(50);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<SortState[]>([]);
  const [viewMode, setViewMode] = useState<'bars' | 'dots' | 'color'>('bars');
  const [distribution, setDistribution] = useState<'random' | 'sorted' | 'reverse' | 'partial'>('random');
  const [showMetadata, setShowMetadata] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Initialization ---
  const generateArray = () => {
    stopSorting();
    let newArray = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push(Math.floor(Math.random() * 90) + 10);
    }
    
    if (distribution === 'sorted') newArray.sort((a, b) => a - b);
    if (distribution === 'reverse') newArray.sort((a, b) => b - a);
    if (distribution === 'partial') {
        newArray.sort((a, b) => a - b);
        for(let i=0; i<3; i++) {
            const idx1 = Math.floor(Math.random() * arraySize);
            const idx2 = Math.floor(Math.random() * arraySize);
            [newArray[idx1], newArray[idx2]] = [newArray[idx2], newArray[idx1]];
        }
    }

    setArray(newArray);
    setSteps([{ array: [...newArray], activeIndices: [], comparingIndices: [], sortedIndices: [] }]);
    setCurrentStep(0);
  };

  useEffect(() => {
    generateArray();
  }, [arraySize, distribution]);

  // --- Algorithm Recorder (Pre-calculates all steps) ---
  const recordSorting = () => {
    const recordedSteps: SortState[] = [];
    const currentArray = [...array];

    const addStep = (state: Partial<SortState>) => {
      recordedSteps.push({
        array: [...(state.array || recordedSteps[recordedSteps.length - 1]?.array || currentArray)],
        activeIndices: state.activeIndices || [],
        comparingIndices: state.comparingIndices || [],
        sortedIndices: state.sortedIndices || recordedSteps[recordedSteps.length - 1]?.sortedIndices || [],
        pivotIndex: state.pivotIndex,
        message: state.message
      });
    };

    // --- Bubble Sort ---
    if (algorithm === 'bubble') {
        const arr = [...currentArray];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                addStep({ comparingIndices: [j, j + 1] });
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    addStep({ array: [...arr], activeIndices: [j, j + 1] });
                }
            }
            const sorted = [];
            for(let k=arr.length-1; k>=arr.length-i-1; k--) sorted.push(k);
            addStep({ sortedIndices: sorted });
        }
    }

    // --- Selection Sort ---
    if (algorithm === 'selection') {
        const arr = [...currentArray];
        const sorted = [];
        for (let i = 0; i < arr.length; i++) {
            let minIdx = i;
            for (let j = i + 1; j < arr.length; j++) {
                addStep({ comparingIndices: [minIdx, j], sortedIndices: [...sorted] });
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            sorted.push(i);
            addStep({ array: [...arr], activeIndices: [i, minIdx], sortedIndices: [...sorted] });
        }
    }

    // --- Insertion Sort ---
    if (algorithm === 'insertion') {
        const arr = [...currentArray];
        const sorted = [0];
        addStep({ sortedIndices: [0] });
        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;
            addStep({ activeIndices: [i] });
            while (j >= 0 && arr[j] > key) {
                addStep({ comparingIndices: [j, j + 1] });
                arr[j + 1] = arr[j];
                j--;
                addStep({ array: [...arr], activeIndices: [j + 1] });
            }
            arr[j + 1] = key;
            const newSorted = [];
            for(let k=0; k<=i; k++) newSorted.push(k);
            addStep({ array: [...arr], activeIndices: [j + 1], sortedIndices: newSorted });
        }
    }

    // --- Quick Sort ---
    if (algorithm === 'quick') {
        const arr = [...currentArray];
        const sort = (l: number, h: number) => {
            if (l >= h) {
                if(l === h) addStep({ sortedIndices: [...(recordedSteps[recordedSteps.length-1]?.sortedIndices || []), l] });
                return;
            }
            let pivot = arr[h];
            let i = l - 1;
            addStep({ pivotIndex: h });
            for (let j = l; j < h; j++) {
                addStep({ comparingIndices: [j, h], pivotIndex: h });
                if (arr[j] < pivot) {
                    i++;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    addStep({ array: [...arr], activeIndices: [i, j], pivotIndex: h });
                }
            }
            [arr[i + 1], arr[h]] = [arr[h], arr[i + 1]];
            const pivotPos = i + 1;
            addStep({ array: [...arr], activeIndices: [pivotPos, h], sortedIndices: [...(recordedSteps[recordedSteps.length-1]?.sortedIndices || []), pivotPos] });
            sort(l, pivotPos - 1);
            sort(pivotPos + 1, h);
        };
        sort(0, arr.length - 1);
        addStep({ sortedIndices: arr.map((_, idx) => idx) });
    }

    // --- Counting Sort ---
    if (algorithm === 'counting') {
        const arr = [...currentArray];
        const max = Math.max(...arr);
        const count = new Array(max + 1).fill(0);
        
        for (let x of arr) {
            count[x]++;
            // In a real visualizer we'd show the count array separately, 
            // here we highlight the element being counted.
            addStep({ activeIndices: [arr.indexOf(x)], message: `Counting ${x}` });
        }
        
        let k = 0;
        for (let i = 0; i < count.length; i++) {
            while (count[i] > 0) {
                arr[k] = i;
                addStep({ array: [...arr], activeIndices: [k], message: `Placing ${i} at index ${k}` });
                count[i]--;
                k++;
            }
        }
        addStep({ sortedIndices: arr.map((_, idx) => idx) });
    }

    // --- Radix Sort ---
    if (algorithm === 'radix') {
        const arr = [...currentArray];
        const getMax = (a: number[]) => Math.max(...a);
        const countSort = (exp: number) => {
            let output = new Array(arr.length).fill(0);
            let count = new Array(10).fill(0);
            for (let i = 0; i < arr.length; i++) {
                count[Math.floor(arr[i] / exp) % 10]++;
            }
            for (let i = 1; i < 10; i++) count[i] += count[i - 1];
            for (let i = arr.length - 1; i >= 0; i--) {
                const digit = Math.floor(arr[i] / exp) % 10;
                output[count[digit] - 1] = arr[i];
                count[digit]--;
            }
            for (let i = 0; i < arr.length; i++) {
                arr[i] = output[i];
                addStep({ array: [...arr], activeIndices: [i], message: `Sorting by digit ${exp}` });
            }
        };
        const m = getMax(arr);
        for (let exp = 1; Math.floor(m / exp) > 0; exp *= 10) {
            countSort(exp);
        }
        addStep({ sortedIndices: arr.map((_, idx) => idx) });
    }

    // --- Bucket Sort ---
    if (algorithm === 'bucket') {
        const arr = [...currentArray];
        const n = arr.length;
        if (n <= 0) return [];
        let buckets: number[][] = Array.from({ length: n }, () => []);
        const max = Math.max(...arr);
        for (let i = 0; i < n; i++) {
            let bi = Math.floor((n * arr[i]) / (max + 1));
            buckets[bi].push(arr[i]);
            addStep({ activeIndices: [i], message: `Adding ${arr[i]} to bucket ${bi}` });
        }
        for (let i = 0; i < n; i++) {
            buckets[i].sort((a, b) => a - b);
        }
        let index = 0;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < buckets[i].length; j++) {
                arr[index++] = buckets[i][j];
                addStep({ array: [...arr], activeIndices: [index - 1], message: `Extracting from bucket ${i}` });
            }
        }
        addStep({ sortedIndices: arr.map((_, idx) => idx) });
    }

    // --- Merge Sort ---
    if (algorithm === 'merge') {
        const arr = [...currentArray];
        const merge = (start: number, mid: number, end: number) => {
            let left = arr.slice(start, mid + 1);
            let right = arr.slice(mid + 1, end + 1);
            let i = 0, j = 0, k = start;
            while (i < left.length && j < right.length) {
                addStep({ comparingIndices: [start + i, mid + 1 + j] });
                if (left[i] <= right[j]) {
                    arr[k] = left[i];
                    i++;
                } else {
                    arr[k] = right[j];
                    j++;
                }
                addStep({ array: [...arr], activeIndices: [k] });
                k++;
            }
            while (i < left.length) {
                arr[k] = left[i];
                addStep({ array: [...arr], activeIndices: [k] });
                i++; k++;
            }
            while (j < right.length) {
                arr[k] = right[j];
                addStep({ array: [...arr], activeIndices: [k] });
                j++; k++;
            }
        };
        const sort = (l: number, r: number) => {
            if (l >= r) return;
            let m = Math.floor((l + r) / 2);
            sort(l, m);
            sort(m + 1, r);
            merge(l, m, r);
            if(l ===0 && r === arr.length-1) {
                addStep({ sortedIndices: arr.map((_, idx) => idx) });
            }
        };
        sort(0, arr.length - 1);
    }

    // (Remaining algorithms Heap, Counting, Radix, Bucket will be added/simplified for space)
    // For now, let's provide a "Coming soon" notice if they select them, or implement Heap at least.
    
    // --- Heap Sort ---
    if (algorithm === 'heap') {
        const arr = [...currentArray];
        const heapify = (n: number, i: number) => {
            let largest = i;
            let l = 2 * i + 1;
            let r = 2 * i + 2;
            addStep({ comparingIndices: [i, l, r].filter(idx => idx < n) });
            if (l < n && arr[l] > arr[largest]) largest = l;
            if (r < n && arr[r] > arr[largest]) largest = r;
            if (largest !== i) {
                [arr[i], arr[largest]] = [arr[largest], arr[i]];
                addStep({ array: [...arr], activeIndices: [i, largest] });
                heapify(n, largest);
            }
        };
        for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) heapify(arr.length, i);
        for (let i = arr.length - 1; i > 0; i--) {
            [arr[0], arr[i]] = [arr[i], arr[0]];
            addStep({ array: [...arr], activeIndices: [0, i], sortedIndices: [...(recordedSteps[recordedSteps.length-1]?.sortedIndices || []), i] });
            heapify(i, 0);
        }
        addStep({ sortedIndices: arr.map((_, idx) => idx) });
    }

    setSteps(recordedSteps);
    return recordedSteps;
  };

  // --- Controls ---
  const startSorting = () => {
    if (isSorting && isPaused) {
      setIsPaused(false);
      return;
    }
    
    const newSteps = recordSorting();
    setIsSorting(true);
    setIsPaused(false);
    playSteps(0, newSteps);
  };

  const playSteps = (index: number, currentSteps: SortState[]) => {
    let i = index;
    const interval = Math.max(5, 200 - speed * 2);
    
    timerRef.current = setInterval(() => {
      if (i >= currentSteps.length) {
        stopSorting();
        return;
      }
      setCurrentStep(i);
      setArray(currentSteps[i].array);
      i++;
    }, interval);
  };

  const stopSorting = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSorting(false);
    setIsPaused(false);
    setActiveStep(currentStep);
  };

  const togglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      playSteps(currentStep, steps);
    } else {
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const reset = () => {
    generateArray();
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setActiveStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setActiveStep(currentStep - 1);
    }
  };

  const setActiveStep = (idx: number) => {
    setCurrentStep(idx);
    if (steps[idx]) setArray(steps[idx].array);
  };

  const currentStepData = steps[currentStep] || { activeIndices: [], comparingIndices: [], sortedIndices: [] };
  const algoInfo = ALGORITHM_DATA[algorithm];

  return (
    <Layout title={`${algoInfo.title} | LearnHub Visualizer`}>
      <div className="bg-primary min-h-screen text-text-primary flex flex-col pt-4">
        
        {/* Top Control Bar */}
        <div className="bg-ui-card mx-4 rounded-2xl border border-ui-border p-4 mb-4 shadow-xl">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
            
            {/* Algorithm Select */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg text-accent">
                <BarChart className="w-6 h-6" />
              </div>
              <select 
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
                disabled={isSorting}
                className="bg-primary border border-ui-border rounded-xl px-4 py-2 text-text-primary focus:ring-2 focus:ring-accent outline-none font-semibold transition-all"
              >
                {Object.entries(ALGORITHM_DATA).map(([key, data]) => (
                  <option key={key} value={key}>{data.title}</option>
                ))}
              </select>
            </div>

            {/* Simulation Controls */}
            <div className="flex items-center gap-4 bg-primary/50 p-1.5 rounded-2xl border border-ui-border">
              <button 
                onClick={reset}
                className="p-3 hover:bg-ui-card rounded-xl text-text-muted hover:text-text-primary transition-all"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              <div className="w-[1px] h-6 bg-ui-border" />

              <button 
                onClick={prevStep}
                disabled={isSorting && !isPaused}
                className="p-3 hover:bg-ui-card disabled:opacity-30 rounded-xl text-text-muted hover:text-text-primary transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button 
                onClick={isSorting && !isPaused ? togglePause : startSorting}
                className="w-14 h-14 bg-accent text-primary rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-glow"
              >
                {isSorting && !isPaused ? <Pause className="fill-current w-6 h-6" /> : <Play className="fill-current w-6 h-6 ml-1" />}
              </button>

              <button 
                onClick={nextStep}
                disabled={isSorting && !isPaused}
                className="p-3 hover:bg-ui-card disabled:opacity-30 rounded-xl text-text-muted hover:text-text-primary transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="w-[1px] h-6 bg-ui-border" />

              <div className="flex items-center gap-4 px-4">
                <div className="flex flex-col gap-1 min-w-[100px]">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-text-muted tracking-widest">
                    <span>Speed</span>
                    <span className="text-accent">{speed}%</span>
                  </div>
                  <input 
                    type="range" min="1" max="100" value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="accent-accent h-1.5"
                  />
                </div>
                <div className="flex flex-col gap-1 min-w-[100px]">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-text-muted tracking-widest">
                    <span>Size</span>
                    <span className="text-accent">{arraySize}</span>
                  </div>
                  <input 
                    type="range" min="5" max="150" value={arraySize}
                    onChange={(e) => setArraySize(Number(e.target.value))}
                    disabled={isSorting}
                    className="accent-highlight h-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Extra Settings */}
            <div className="flex items-center gap-2">
               <button 
                onClick={() => setDistribution(prev => prev === 'random' ? 'reverse' : prev === 'reverse' ? 'sorted' : 'random')}
                className="px-4 py-2 bg-primary/40 hover:bg-primary border border-ui-border rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
               >
                 {distribution}
               </button>
               <button 
                onClick={() => setShowMetadata(!showMetadata)}
                className={`p-3 rounded-xl border border-ui-border transition-all ${showMetadata ? 'bg-accent/10 border-accent/30 text-accent' : 'text-text-muted'}`}
               >
                 <Info className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 px-4 pb-4">
          
          {/* Visualizer Canvas */}
          <div className="flex-1 bg-ui-dark rounded-3xl border border-ui-border flex flex-col relative overflow-hidden shadow-inner">
            <div className="absolute top-6 left-8 flex items-center gap-2 z-10">
               <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
               <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Execution View</span>
               {currentStepData.message && (
                 <span className="ml-4 px-3 py-1 bg-white/5 rounded-full text-[10px] text-accent border border-accent/20 font-bold uppercase tracking-widest">
                   {currentStepData.message}
                 </span>
               )}
            </div>

            <div className="flex-1 flex items-end justify-center p-12 gap-1 overflow-hidden">
               {array.map((val, idx) => {
                 let color = 'bg-highlight/40';
                 let glow = '';
                 
                 if (currentStepData.activeIndices.includes(idx)) {
                   color = 'bg-accent';
                   glow = 'shadow-glow';
                 } else if (currentStepData.comparingIndices.includes(idx)) {
                   color = 'bg-yellow-400';
                 } else if (currentStepData.sortedIndices.includes(idx)) {
                   color = 'bg-emerald-500';
                 } else if (currentStepData.pivotIndex === idx) {
                   color = 'bg-rose-500';
                   glow = 'shadow-lg';
                 }

                 return (
                   <div 
                    key={idx}
                    style={{ 
                      height: `${val}%`, 
                      width: `${Math.max(2, 100/arraySize)}%`,
                      transition: 'height 0.1s ease-in-out, background-color 0.1s ease'
                    }}
                    className={`${color} ${glow} rounded-t-lg relative group`}
                   >
                     {arraySize < 25 && (
                       <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                         {val}
                       </span>
                     )}
                   </div>
                 );
               })}
            </div>

            {/* Bottom Progress Bar */}
            <div className="h-1 bg-ui-border w-full relative">
               <div 
                className="h-full bg-accent transition-all duration-100 shadow-glow"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
               />
            </div>
            <div className="p-4 bg-primary/20 flex justify-between items-center text-xs font-mono text-text-muted">
               <span>Step {currentStep} / {steps.length - 1}</span>
               <div className="flex gap-4">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-accent" /> Active</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400" /> Comparing</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Sorted</span>
               </div>
            </div>
          </div>

          {/* Info Sidebar */}
          {showMetadata && (
            <div className="w-full md:w-96 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
              
              {/* Complexity Card */}
              <div className="bg-ui-card rounded-2xl border border-ui-border p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                   <Zap className="w-5 h-5 text-accent" />
                   <h2 className="text-xl font-bold">Complexity</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-primary/40 rounded-xl border border-ui-border">
                    <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Best Case</p>
                    <p className="text-emerald-400 font-mono text-sm">{algoInfo.bestCase}</p>
                  </div>
                  <div className="p-3 bg-primary/40 rounded-xl border border-ui-border">
                    <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Worst Case</p>
                    <p className="text-rose-400 font-mono text-sm">{algoInfo.worstCase}</p>
                  </div>
                  <div className="p-3 bg-primary/40 rounded-xl border border-ui-border col-span-2">
                    <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Space Complexity</p>
                    <p className="text-highlight font-mono text-sm">{algoInfo.spaceComplexity}</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-ui-border flex justify-between">
                   <span className="text-xs text-text-muted">Stable: <span className={algoInfo.stable ? 'text-emerald-400' : 'text-rose-400'}>{algoInfo.stable ? 'Yes' : 'No'}</span></span>
                   <span className="text-xs text-text-muted">In-place: <span className={algoInfo.inPlace ? 'text-emerald-400' : 'text-rose-400'}>{algoInfo.inPlace ? 'Yes' : 'No'}</span></span>
                </div>
              </div>

              {/* Pseudocode Card */}
              <div className="bg-ui-card rounded-2xl border border-ui-border p-6 shadow-xl flex-1 max-h-[500px] overflow-hidden flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                   <Code className="w-5 h-5 text-highlight" />
                   <h2 className="text-xl font-bold">Pseudocode</h2>
                </div>
                <div className="bg-primary/60 rounded-xl p-4 overflow-auto font-mono text-xs leading-relaxed text-text-secondary border border-ui-border whitespace-pre-wrap">
                  {algoInfo.pseudocode}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
