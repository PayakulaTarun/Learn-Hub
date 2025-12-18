
import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, BarChart, Maximize2 } from 'lucide-react';

export default function SortingLab() {
  const [array, setArray] = useState<number[]>([]);
  const [speed, setSpeed] = useState(50);
  const [isSorting, setIsSorting] = useState(false);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);

  const generateArray = () => {
    const newArray = [];
    for (let i = 0; i < 20; i++) {
      newArray.push(Math.floor(Math.random() * 90) + 10);
    }
    setArray(newArray);
    setActiveIndices([]);
    setSortedIndices([]);
  };

  useEffect(() => {
    generateArray();
  }, []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    setIsSorting(true);
    let arr = [...array];
    let n = arr.length;
    let delay = Math.max(5, 200 - speed * 2);

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            setActiveIndices([j, j + 1]);
            await sleep(delay);
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                setArray([...arr]);
            }
        }
        setSortedIndices(prev => [...prev, n - i - 1]);
    }
    setSortedIndices(arr.map((_, i) => i));
    setActiveIndices([]);
    setIsSorting(false);
  };

  return (
    <div className="bg-ui-dark rounded-2xl border border-ui-border overflow-hidden">
      <div className="p-4 border-b border-ui-border flex justify-between items-center bg-ui-card">
         <div className="flex items-center gap-2">
            <BarChart className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-text-primary">Sorting Visualizer</span>
         </div>
         <button onClick={generateArray} className="p-1 text-text-muted hover:text-text-primary"><RotateCcw className="w-4 h-4" /></button>
      </div>

      <div className="p-6">
         <div className="flex items-end justify-center gap-1 h-40 mb-8 border-b border-ui-border/50 pb-2">
            {array.map((val, idx) => {
               let color = 'bg-highlight/40';
               if (activeIndices.includes(idx)) color = 'bg-accent shadow-glow';
               if (sortedIndices.includes(idx)) color = 'bg-emerald-500';

               return (
                 <div 
                  key={idx}
                  style={{ height: `${val}%`, width: '12px' }}
                  className={`${color} rounded-t-sm transition-all duration-100`}
                 />
               );
            })}
         </div>

         <div className="flex gap-4 items-center">
            <div className="flex-1">
               <input type="range" min="1" max="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-accent h-1.5" />
            </div>
            <button 
              onClick={bubbleSort}
              disabled={isSorting}
              className="px-6 py-2 bg-accent text-primary font-bold rounded-xl text-xs hover:bg-highlight hover:text-white transition-all shadow-glow disabled:opacity-50"
            >
               Run Bubble Sort
            </button>
         </div>
      </div>
    </div>
  );
}
