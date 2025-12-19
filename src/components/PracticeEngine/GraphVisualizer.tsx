
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, RotateCcw, Share2, Info, Zap, 
  Network, ArrowRight, Settings 
} from 'lucide-react';
import Layout from '../Layout';

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

export default function GraphVisualizer() {
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
      { id: 0, x: 100, y: 100 },
      { id: 1, x: 300, y: 50 },
      { id: 2, x: 500, y: 100 },
      { id: 3, x: 100, y: 300 },
      { id: 4, x: 300, y: 350 },
      { id: 5, x: 500, y: 300 },
      { id: 6, x: 300, y: 200 },
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
          visited: [...visited], 
          current: u, 
          queue: [...queue], 
          stack: [],
          edges_active: [], 
          message: `Visiting Node ${u}. Exploring neighbors...` 
        });

        for (const v of adj[u]) {
          if (!discovered.has(v)) {
            discovered.add(v);
            queue.push(v);
            recorded.push({ 
              visited: [...visited], 
              current: u, 
              queue: [...queue], 
              stack: [],
              edges_active: [{ from: u, to: v }], 
              message: `Found neighbor ${v}. Adding to Queue.` 
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
           visited: [...visited], 
           current: u, 
           queue: [], 
           stack: [...stack],
           edges_active: [], 
           message: `Visiting Node ${u} (DFS Stack Pop).` 
         });

         for(const v of adj[u]) {
           if(!seen.has(v)) {
             seen.add(v);
             stack.push(v);
             recorded.push({ 
              visited: [...visited], 
              current: u, 
              queue: [], 
              stack: [...stack],
              edges_active: [{ from: u, to: v }], 
              message: `Neighbor ${v} found. Pushing to Stack.` 
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
    <Layout title="Graph Visualizer | Student Resource Hub">
      <div className="bg-primary min-h-screen text-text-primary p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Network className="w-8 h-8 text-highlight" /> Graph Traversal
              </h1>
              <p className="text-text-secondary mt-2">Explore Breadth-First and Depth-First Search on a dynamic graph.</p>
            </div>

            <div className="flex bg-ui-card p-1.5 rounded-2xl border border-ui-border">
              <button 
                onClick={() => setAlgorithm('bfs')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${algorithm === 'bfs' ? 'bg-highlight text-primary shadow-glow-blue' : 'text-text-muted'}`}
              >
                BFS (Queue)
              </button>
              <button 
                onClick={() => setAlgorithm('dfs')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${algorithm === 'dfs' ? 'bg-highlight text-primary shadow-glow-blue' : 'text-text-muted'}`}
              >
                DFS (Stack)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* SVG Canvas */}
            <div className="lg:col-span-3 bg-ui-dark rounded-3xl border border-ui-border p-4 relative overflow-hidden shadow-inner h-[500px]">
               <svg width="100%" height="100%" viewBox="0 0 600 400">
                  {/* Edges */}
                  {edges.map((edge, i) => {
                    const from = nodes.find(n => n.id === edge.from)!;
                    const to = nodes.find(n => n.id === edge.to)!;
                    const isActive = currentData.edges_active.some(e => 
                        (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from)
                    );
                    return (
                      <line 
                        key={i} 
                        x1={from.x} y1={from.y} x2={to.x} y2={to.y} 
                        stroke={isActive ? '#1FD1C1' : '#233A5E'} 
                        strokeWidth={isActive ? 4 : 2}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                  {/* Nodes */}
                  {nodes.map((node) => {
                    const isVisited = currentData.visited.includes(node.id);
                    const isCurrent = currentData.current === node.id;
                    const isQueued = currentData.queue.includes(node.id) || currentData.stack.includes(node.id);
                    
                    let fill = '#0F1E33';
                    let stroke = '#233A5E';
                    if (isCurrent) { fill = '#1FD1C1'; stroke = '#1FD1C1'; }
                    else if (isVisited) { fill = '#1F3C88'; stroke = '#4DA3FF'; }
                    else if (isQueued) { fill = '#4DA3FF22'; stroke = '#4DA3FF'; }

                    return (
                      <g key={node.id} className="cursor-pointer group">
                        <circle 
                          cx={node.x} cy={node.y} r="18" 
                          fill={fill} 
                          stroke={stroke} 
                          strokeWidth="3"
                          className="transition-all duration-500"
                        />
                        <text 
                          x={node.x} y={node.y} 
                          textAnchor="middle" dy=".3em" 
                          fill={isCurrent ? '#0A1A2F' : '#EAF1FF'} 
                          fontSize="12" fontWeight="bold"
                        >
                          {node.id}
                        </text>
                        {isCurrent && (
                          <circle cx={node.x} cy={node.y} r="22" fill="none" stroke="#1FD1C1" strokeWidth="2" className="animate-ping" />
                        )}
                      </g>
                    );
                  })}
               </svg>

               <div className="absolute bottom-6 left-6 right-6 bg-primary/80 backdrop-blur-md p-4 rounded-2xl border border-ui-border">
                  <p className="text-sm font-mono text-highlight text-center">{currentData.message}</p>
               </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
               <div className="bg-ui-card rounded-2xl border border-ui-border p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2"><Share2 className="w-4 h-4 text-accent" /> Data Structure</h3>
                  <div className="flex flex-col gap-3">
                     <div className="p-3 bg-primary/40 rounded-xl border border-ui-border">
                        <p className="text-[10px] text-text-muted uppercase font-bold mb-2">{algorithm === 'bfs' ? 'Queue (FIFO)' : 'Stack (LIFO)'}</p>
                        <div className="flex gap-2 min-h-[40px] items-center">
                           {(algorithm === 'bfs' ? currentData.queue : currentData.stack).map((id, i) => (
                             <div key={i} className="w-8 h-8 bg-highlight text-primary rounded-lg flex items-center justify-center font-bold text-xs">
                               {id}
                             </div>
                           ))}
                           {(algorithm === 'bfs' ? currentData.queue : currentData.stack).length === 0 && <span className="text-[10px] text-text-muted italic">Empty</span>}
                        </div>
                     </div>
                     <div className="p-3 bg-primary/40 rounded-xl border border-ui-border">
                        <p className="text-[10px] text-text-muted uppercase font-bold mb-2">Visited Set</p>
                        <div className="flex flex-wrap gap-1">
                           {currentData.visited.map(id => (
                             <span key={id} className="px-2 py-0.5 bg-accent/20 text-accent text-[10px] font-bold rounded">{id}</span>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-ui-card rounded-2xl border border-ui-border p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2"><Settings className="w-4 h-4 text-accent" /> Settings</h3>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-text-muted mb-2">
                       <span>Speed</span>
                       <span className="text-highlight">{speed}%</span>
                    </div>
                    <input type="range" min="1" max="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-highlight" />
                 </div>
               </div>

               <button 
                onClick={start}
                disabled={isVisualizing}
                className="w-full py-4 bg-highlight text-primary rounded-2xl font-bold shadow-glow-blue hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
               >
                 <Play className="w-5 h-5 fill-current" /> Start Traversal
               </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
