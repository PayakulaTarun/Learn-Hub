
import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { 
  Swords, Timer, Trophy, User, 
  Zap, MessageSquare, AlertCircle,
  Play, CheckCircle2, XCircle
} from 'lucide-react';
import InteractiveEditor from '../../../components/PracticeEngine/InteractiveEditor';

export default function PeerChallenge() {
  const [gameState, setGameState] = useState<'searching' | 'countdown' | 'playing' | 'result'>('searching');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [opponentStatus, setOpponentStatus] = useState('coding');

  useEffect(() => {
    if (gameState === 'searching') {
      const timer = setTimeout(() => setGameState('countdown'), 3000);
      return () => clearTimeout(timer);
    }
    if (gameState === 'countdown') {
       const timer = setTimeout(() => setGameState('playing'), 3000);
       return () => clearTimeout(timer);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
         setTimeLeft(prev => prev - 1);
         // Simulate opponent progress
         if (Math.random() > 0.8) setOpponentProgress(prev => Math.min(95, prev + 5));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft]);

  const problem = {
    title: "Array Rotation Duel",
    description: "Rotate an array of n elements to the right by k steps. For example, with n = 7 and k = 3, the array [1,2,3,4,5,6,7] is rotated to [5,6,7,1,2,3,4].",
    constraints: ["n <= 10^5", "k <= n", "Time Complexity: O(n)", "Space Complexity: O(1)"]
  };

  return (
    <Layout title="Peer Challenge | Coding Duel">
      <div className="bg-ui-dark min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {gameState === 'searching' && (
            <div className="h-[70vh] flex flex-col items-center justify-center text-center animate-pulse">
               <div className="p-8 bg-highlight/20 text-highlight rounded-[2.5rem] mb-12 relative">
                  <Swords className="w-20 h-20" />
                  <div className="absolute inset-0 border-4 border-highlight rounded-[2.5rem] animate-ping opacity-20"></div>
               </div>
               <h2 className="text-4xl font-black mb-4">Finding Opponent...</h2>
               <p className="text-text-secondary">Matching you with a developer of similar skill level (Lvl 5-8)</p>
            </div>
          )}

          {gameState === 'countdown' && (
            <div className="h-[70vh] flex flex-col items-center justify-center text-center">
               <h2 className="text-9xl font-black text-rose-500 animate-bounce">3</h2>
               <p className="text-2xl font-black text-text-primary mt-12">PREPARE FOR BATTLE</p>
            </div>
          )}

          {gameState === 'playing' && (
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
               
               {/* Left Sidebar: Problem & Opponent Status */}
               <div className="lg:col-span-1 space-y-6 sticky top-24">
                  <div className="bg-ui-card border border-rose-500/30 rounded-3xl p-6 shadow-glow-rose">
                      <div className="flex items-center gap-3 mb-6">
                        <Timer className="w-5 h-5 text-rose-500" />
                        <span className="text-xl font-black text-rose-500">
                           {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-accent" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">You</span>
                           </div>
                           <span className="text-[10px] font-black text-accent">Coding...</span>
                        </div>
                        <div className="w-full bg-primary h-2 rounded-full overflow-hidden">
                           <div className="bg-accent h-full w-[40%] transition-all"></div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-ui-border">
                           <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-rose-400" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">Player_423</span>
                           </div>
                           <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest animate-pulse">Thinking...</span>
                        </div>
                        <div className="w-full bg-primary h-2 rounded-full overflow-hidden">
                           <div className="bg-rose-500 h-full transition-all" style={{ width: `${opponentProgress}%` }}></div>
                        </div>
                      </div>
                  </div>

                  <div className="bg-ui-card border border-ui-border rounded-3xl p-6">
                     <h3 className="text-sm font-black uppercase tracking-widest text-text-muted mb-4">Problem</h3>
                     <h4 className="text-lg font-bold mb-3">{problem.title}</h4>
                     <p className="text-xs text-text-secondary leading-relaxed mb-6">
                        {problem.description}
                     </p>
                     <div className="space-y-2">
                        {problem.constraints.map((c, i) => (
                           <div key={i} className="text-[10px] text-text-muted flex gap-2">
                              <span className="text-rose-500">•</span> {c}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Editor Area */}
               <div className="lg:col-span-3">
                  <InteractiveEditor 
                    title="Duel Lab"
                    initialCode={`function rotate(nums, k) {\n  // Fastest O(n) implementation wins\n\n}`}
                    language="javascript"
                    onSubmit={() => setGameState('result')}
                    submitLabel="Final Submit (Fast Race)"
                    challengeMode={true}
                  />
                  
                  <div className="mt-8 bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl flex items-center gap-4">
                     <AlertCircle className="w-6 h-6 text-blue-400 shrink-0" />
                     <p className="text-xs text-blue-200">
                        <b>Pro Tip:</b> In a duel, your first submission that passes all test cases is final. Efficiency and speed both matter for the win.
                     </p>
                  </div>
               </div>

             </div>
          )}

          {gameState === 'result' && (
            <div className="max-w-2xl mx-auto py-12">
               <div className="bg-ui-card border border-accent/30 rounded-[3rem] p-12 text-center shadow-glow">
                  <div className="w-24 h-24 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                     <Trophy className="w-12 h-12" />
                  </div>
                  <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter">Victory!</h2>
                  <p className="text-text-secondary text-lg mb-12">You solved the Array Rotation challenge 42 seconds faster than Player_423.</p>
                  
                  <div className="grid grid-cols-2 gap-6 mb-12">
                     <div className="p-6 bg-primary/40 border border-ui-border rounded-2xl">
                        <p className="text-[10px] font-black text-text-muted uppercase mb-1">XP Earned</p>
                        <p className="text-2xl font-black text-emerald-400">+250 XP</p>
                     </div>
                     <div className="p-6 bg-primary/40 border border-ui-border rounded-2xl">
                        <p className="text-[10px] font-black text-text-muted uppercase mb-1">Impact</p>
                        <p className="text-2xl font-black text-accent">+5 Rank Points</p>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                     <button className="flex-1 py-4 bg-accent text-primary font-black rounded-2xl hover:shadow-glow transition-all uppercase tracking-widest text-xs">
                        Compare Solutions
                     </button>
                     <button onClick={() => setGameState('searching')} className="flex-1 py-4 bg-ui-dark border border-ui-border text-text-primary font-black rounded-2xl hover:bg-ui-border transition-all uppercase tracking-widest text-xs">
                        Find Next Duel
                     </button>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
