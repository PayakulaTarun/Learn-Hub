
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, RotateCcw, Share2, Network, Settings 
} from 'lucide-react';

type Node = { id: number; x: number; y: number; };
type Edge = { from: number; to: number; };
type GraphState = {
  visited: number[];
  current?: number;
  queue: number[];
  stack: number[];
  edges_active: Edge[];
  message: string;
};

export default function GraphLab() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [algorithm, setAlgorithm] = useState<'bfs' | 'dfs'>('bfs');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [steps, setSteps] = useState<GraphState[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(50);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateGraph = () => {
    stop();
    const newNodes = [
      { id: 0, x: 80, y: 80 },
      { id: 1, x: 220, y: 40 },
      { id: 2, x: 360, y: 80 },
      { id: 3, x: 80, y: 220 },
      { id: 4, x: 220, y: 260 },
      { id: 5, x: 360, y: 220 },
      { id: 6, x: 220, y: 150 },
    ];
    const newEdges = [
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 0, to: 3 },
      { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 2, to: 5 },
      { from: 1, to: 6 }, { from: 6, to: 4 }, { from: 3, to: 6 }
    ];
    setNodes(newNodes);
    setEdges(newEdges);
    setSteps([{ visited: [], queue: [], stack: [], edges_active: [], message: 'Ready to traverse' }]);
    setCurrentStep(0);
  };

  useEffect(() => {
    generateGraph();
  }, []);

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsVisualizing(false);
  };

  const recordTraversal = () => {
    const recorded: GraphState[] = [];
    const adj: Record<number, number[]> = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
        adj[e.from].push(e.to);
        adj[e.to].push(e.from);
    });

    if (algorithm === 'bfs') {
      const visited: number[] = [];
      const queue: number[] = [0];
      const discovered = new Set([0]);
      
      while (queue.length > 0) {
        const u = queue.shift()!;
        visited.push(u);
        recorded.push({ 
          visited: [...visited], current: u, queue: [...queue], stack: [],
          edges_active: [], message: `Exploring neighbors of Node ${u}...` 
        });

        for (const v of adj[u]) {
          if (!discovered.has(v)) {
            discovered.add(v);
            queue.push(v);
            recorded.push({ 
              visited: [...visited], current: u, queue: [...queue], stack: [],
              edges_active: [{ from: u, to: v }], message: `Adding neighbor ${v} to Queue.` 
            });
          }
        }
      }
    } else {
       const visited: number[] = [];
       const stack: number[] = [0];
       const seen = new Set([0]);

       while(stack.length > 0) {
         const u = stack.pop()!;
         visited.push(u);
         recorded.push({ 
           visited: [...visited], current: u, queue: [], stack: [...stack],
           edges_active: [], message: `Visiting Node ${u}. Exploring deep...` 
         });

         for(const v of adj[u]) {
           if(!seen.has(v)) {
             seen.add(v);
             stack.push(v);
             recorded.push({ 
              visited: [...visited], current: u, queue: [], stack: [...stack],
              edges_active: [{ from: u, to: v }], message: `Pushing neighbor ${v} onto Stack.` 
            });
           }
         }
       }
    }
    setSteps(recorded);
    return recorded;
  };

  const start = () => {
    const newSteps = recordTraversal();
    setIsVisualizing(true);
    let i = 0;
    const interval = Math.max(50, 1000 - speed * 10);
    timerRef.current = setInterval(() => {
      if (i >= newSteps.length) {
        stop();
        return;
      }
      setCurrentStep(i);
      i++;
    }, interval);
  };

  const currentData = steps[currentStep] || { visited: [], queue: [], stack: [], edges_active: [], message: '' };

  return (
    <div className="bg-ui-dark rounded-2xl border border-ui-border overflow-hidden">
      <div className="p-4 border-b border-ui-border flex justify-between items-center bg-ui-card">
         <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-highlight" />
            <span className="text-xs font-bold uppercase tracking-widest text-text-primary">Graph Traversal</span>
         </div>
         <div className="flex gap-2">
            <select 
              value={algorithm} 
              onChange={(e) => setAlgorithm(e.target.value as any)}
              className="bg-primary text-xs font-bold px-2 py-1 rounded border border-ui-border text-text-secondary"
            >
               <option value="bfs">BFS</option>
               <option value="dfs">DFS</option>
            </select>
            <button onClick={generateGraph} className="p-1 text-text-muted hover:text-text-primary"><RotateCcw className="w-4 h-4" /></button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 min-h-[400px]">
         <div className="md:col-span-2 p-6 relative bg-primary/20 border-r border-ui-border">
            <svg width="100%" height="300" viewBox="0 0 440 300">
               {edges.map((edge, i) => {
                  const from = nodes.find(n => n.id === edge.from)!;
                  const to = nodes.find(n => n.id === edge.to)!;
                  const isActive = currentData.edges_active.some(e => 
                      (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from)
                  );
                  return (
                    <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={isActive ? '#1FD1C1' : '#233A5E'} strokeWidth={isActive ? 3 : 1} className="transition-all duration-300" />
                  );
               })}
               {nodes.map(node => {
                  const isCurrent = currentData.current === node.id;
                  const isVisited = currentData.visited.includes(node.id);
                  const isQueued = currentData.queue.includes(node.id) || currentData.stack.includes(node.id);
                  let fill = '#0F1E33';
                  if (isCurrent) fill = '#1FD1C1';
                  else if (isVisited) fill = '#1F3C88';
                  else if (isQueued) fill = '#4DA3FF22';

                  return (
                    <g key={node.id}>
                       <circle cx={node.x} cy={node.y} r="15" fill={fill} stroke={isCurrent ? '#1FD1C1' : '#233A5E'} strokeWidth="2" />
                       <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fill={isCurrent ? '#0A1A2F' : '#EAF1FF'} fontSize="10" fontWeight="bold">{node.id}</text>
                    </g>
                  );
               })}
            </svg>
            <div className="absolute bottom-4 left-4 right-4 bg-ui-card/80 p-3 rounded-xl border border-ui-border text-center">
               <p className="text-[10px] font-mono text-highlight uppercase tracking-widest">{currentData.message}</p>
            </div>
         </div>

         <div className="p-6 bg-ui-dark space-y-6">
            <div className="space-y-2">
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{algorithm.toUpperCase()} {algorithm === 'bfs' ? 'Queue' : 'Stack'}</p>
               <div className="flex flex-wrap gap-1.5 min-h-[30px]">
                  {(algorithm === 'bfs' ? currentData.queue : currentData.stack).map(id => (
                    <div key={id} className="w-6 h-6 bg-highlight text-primary text-[10px] font-bold flex items-center justify-center rounded shadow-sm">{id}</div>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-[10px] font-bold text-text-muted mb-2 uppercase"><span>Speed</span><span>{speed}%</span></div>
                  <input type="range" min="1" max="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full h-1 accent-highlight" />
               </div>
               <button onClick={start} disabled={isVisualizing} className="w-full py-3 bg-highlight text-primary font-bold rounded-xl text-xs hover:bg-accent transition-all shadow-glow-blue disabled:opacity-50">TRAVERSE GRAPH</button>
            </div>
         </div>
      </div>
    </div>
  );
}
