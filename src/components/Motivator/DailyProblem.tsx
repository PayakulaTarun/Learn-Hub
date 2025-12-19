
import React from 'react';
import { Zap, Trophy, Timer, ChevronRight, Target } from 'lucide-react';
import Link from 'next/link';

export default function DailyProblem() {
  // Mock data for Problem of the Day
  const problem = {
    title: "Invert a Binary Tree",
    difficulty: "Medium",
    rewardXP: 150,
    solvedBy: 1240,
    tags: ["Data Structures", "Trees"],
    slug: "invert-binary-tree"
  };

  return (
    <div className="bg-ui-card border border-ui-border rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Target className="w-32 h-32" />
      </div>

      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-500/20 text-orange-500 rounded-lg">
            <Timer className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Problem of the Day</span>
        </div>

        <h3 className="text-2xl font-black mb-2 group-hover:text-orange-400 transition-colors">{problem.title}</h3>
        
        <div className="flex items-center gap-4 mb-8">
           <span className="text-[10px] font-black uppercase text-text-muted">{problem.difficulty}</span>
           <span className="text-[10px] font-black uppercase text-emerald-400">+{problem.rewardXP} XP Bonus</span>
        </div>

        <div className="space-y-4 mb-8">
           <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted font-bold">Solved by</span>
              <span className="text-text-primary font-black">{problem.solvedBy} Learners</span>
           </div>
           <div className="w-full bg-primary h-1 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full w-2/3 shadow-glow-orange"></div>
           </div>
        </div>

        <Link 
          href={`/practice?id=${problem.slug}`}
          className="w-full py-4 bg-ui-dark border border-ui-border rounded-2xl flex items-center justify-center gap-3 font-black text-sm group-hover:bg-orange-500 group-hover:text-primary transition-all shadow-glow-orange"
        >
          Solve Challenge <Zap className="w-4 h-4 fill-current" />
        </Link>
      </div>
    </div>
  );
}
