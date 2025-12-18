
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { 
  Code2, BarChart3, MonitorPlay, Zap, 
  Terminal, Database, Cpu, Layout as LayoutIcon, Search, Network 
} from 'lucide-react';

const tools = [
  {
    title: 'Algorithm Visualizer',
    description: 'Master data structures and algorithms with interactive, step-by-step visualizations. Includes Bubble, Quick, Merge, and Heap sorts.',
    icon: BarChart3,
    color: 'from-accent to-highlight',
    href: '/practice/sorting-visualizer',
    status: 'Live',
    features: ['9+ Algorithms', 'Step-by-Step', 'Complexity Analysis']
  },
  {
    title: 'Searching Visualizer',
    description: 'Understand Linear and Binary search with high-speed step-by-step animations and complexity breakdown.',
    icon: Search,
    color: 'from-blue-500 to-indigo-600',
    href: '/practice/searching-visualizer',
    status: 'Live',
    features: ['Linear Search', 'Binary Search', 'Dynamic Targets']
  },
  {
    title: 'Graph Traversal',
    description: 'Explore BFS and DFS with interactive graph networks. Track stacks, queues, and visited sets in real-time.',
    icon: Network,
    color: 'from-highlight to-accent',
    href: '/practice/graph-visualizer',
    status: 'Live',
    features: ['BFS / DFS', 'Stack/Queue Tracking', 'SVG Graph Canvas']
  },
  {
    title: 'Web Playground',
    description: 'An industrial-grade editor for HTML, CSS, and JavaScript. Test your frontend skills with real-time preview.',
    icon: MonitorPlay,
    color: 'from-blue-400 to-cyan-500',
    href: '/practice/web-playground',
    status: 'Live',
    features: ['Live Preview', 'Monaco Editor', 'IDE Experience']
  },
  {
    title: 'Building Blocks',
    description: 'Learn to build professional projects from scratch. Step-by-step guides for Text Editors, Weather Apps, and more.',
    icon: LayoutIcon,
    color: 'from-emerald-500 to-teal-600',
    href: '/practice/projects/text-editor-c',
    status: 'Live',
    features: ['C Editor', 'React Apps', 'Backend Engines']
  },
  {
    title: 'SQL Sandbox',
    description: 'Practice complex queries on a variety of relational databases. Perfect for mastering joins and data analysis.',
    icon: Database,
    color: 'from-orange-500 to-red-600',
    href: '#',
    status: 'Coming Soon',
    features: ['Schema Design', 'Data Analysis', 'Query Export']
  },
];

export default function PracticeHub() {
  return (
    <Layout title="Practice Lab | Master by Doing">
      <div className="bg-primary min-h-screen">
        
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden border-b border-ui-border">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(10,26,47,0))] opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-accent/20 text-accent border border-accent/20 tracking-widest uppercase mb-6 animate-pulse">
                Pillar One: Practice Engine
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-text-primary mb-6 tracking-tight">
                Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-highlight">Practice Lab</span>
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-text-secondary leading-relaxed">
                The bridge between theory and industry. Our interactive tools help you visualize complex logic and build real muscle memory.
              </p>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {tools.map((tool) => (
              <Link 
                key={tool.title} 
                href={tool.status === 'Live' ? tool.href : '#'}
                className={`group relative flex flex-col md:flex-row bg-ui-card rounded-3xl border border-ui-border overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-glow-blue ${tool.status !== 'Live' ? 'pointer-events-none' : ''}`}
              >
                {/* Visual Accent */}
                <div className={`w-full md:w-48 bg-gradient-to-br ${tool.color} flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-105`}>
                   <tool.icon className="w-16 h-16 text-primary drop-shadow-lg" />
                </div>

                {/* Content */}
                <div className="flex-1 p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-text-primary group-hover:text-accent transition-colors">
                      {tool.title}
                    </h2>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${tool.status === 'Live' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-ui-border text-text-muted border border-ui-border'}`}>
                      {tool.status}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed mb-6">
                    {tool.description}
                  </p>
                  
                  {/* Features Mini-List */}
                  <div className="flex flex-wrap gap-2">
                    {tool.features.map(f => (
                      <span key={f} className="flex items-center gap-1 text-[10px] font-semibold text-text-muted bg-primary/40 px-2 py-1 rounded-md border border-ui-border">
                         <Zap className="w-2.5 h-2.5 text-accent" /> {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status Overlay for Coming Soon */}
                {tool.status !== 'Live' && (
                  <div className="absolute inset-0 bg-primary/60 backdrop-blur-[1px] flex items-center justify-center z-10 transition-opacity">
                     <span className="bg-ui-card border border-ui-border px-4 py-2 rounded-xl text-xs font-bold text-text-muted uppercase tracking-widest shadow-2xl">
                       In Development
                     </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Motivation Section */}
        <section className="py-20 bg-ui-dark border-t border-ui-border">
           <div className="max-w-4xl mx-auto px-4 text-center">
              <h3 className="text-2xl font-bold mb-4">Why interactive practice?</h3>
              <p className="text-text-secondary leading-relaxed">
                Passive reading results in 10% retention. Active practice increases that to 75%. 
                LearnHub's Practice Lab ensures you don't just "watch" code—you understand the flow, the memory usage, and the complexity firsthand.
              </p>
           </div>
        </section>
      </div>
    </Layout>
  );
}
