import React from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { 
  Wrench, FileText, Code2, Image, 
  Cpu, Terminal, Zap, Lock
} from 'lucide-react';

export default function ToolkitHub() {
  const tools = [
    {
      id: 'resume-builder',
      title: 'ATS Resume Builder',
      description: 'Create industry-standard, ATS-friendly resumes optimized for tech roles.',
      icon: FileText,
      href: '/toolkit/resume-builder',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      status: 'active'
    },
    {
      id: 'code-formatter',
      title: 'Code Formatter',
      description: 'Clean and standardize your snippets before sharing.',
      icon: Code2,
      href: '/toolkit/formatter',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      status: 'coming-soon'
    },
    {
      id: 'asset-optimizer',
      title: 'Asset Optimizer',
      description: 'Compress images and SVGs for maximum web performance.',
      icon: Image,
      href: '/toolkit/optimizer',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      status: 'coming-soon'
    },
    {
      id: 'regex-tester',
      title: 'Regex Lab',
      description: 'Test and debug complex regular expressions in real-time.',
      icon: Terminal,
      href: '/toolkit/regex',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      status: 'coming-soon'
    }
  ];

  return (
    <Layout title="Toolkit | Developer Utilities">
      <div className="bg-ui-dark min-h-screen text-text-primary">
        
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden border-b border-ui-border bg-gradient-to-b from-primary/50 to-ui-dark">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 tracking-widest uppercase mb-8">
              Pillar Five: The Toolkit
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
              Essential <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Developer Utilities.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-text-secondary leading-relaxed">
              A curated collection of tools to accelerate your workflow and professional presentation.
            </p>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <div key={tool.id} className="relative group">
                {tool.status === 'active' ? (
                  <Link 
                    href={tool.href}
                    className="block h-full p-8 bg-ui-card border border-ui-border rounded-[2rem] hover:border-indigo-500/30 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                  >
                    <div className={`w-14 h-14 ${tool.bg} ${tool.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      <tool.icon size={28} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{tool.title}</h3>
                    <p className="text-text-secondary leading-relaxed mb-8">
                      {tool.description}
                    </p>
                    <div className="flex items-center text-xs font-black uppercase tracking-widest text-text-muted group-hover:text-indigo-400 transition-colors">
                      Launch Tool <Zap className="w-4 h-4 ml-2" />
                    </div>
                  </Link>
                ) : (
                  <div className="block h-full p-8 bg-ui-card/50 border border-ui-border rounded-[2rem] relative overflow-hidden opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <div className="absolute top-4 right-4 px-3 py-1 bg-ui-dark border border-ui-border rounded-lg text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                       <Lock size={12} /> Coming Soon
                    </div>
                    <div className={`w-14 h-14 ${tool.bg} ${tool.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                      <tool.icon size={28} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{tool.title}</h3>
                    <p className="text-text-secondary leading-relaxed mb-8">
                      {tool.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </Layout>
  );
}
