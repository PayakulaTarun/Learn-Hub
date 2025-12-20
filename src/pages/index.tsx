import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { ArrowRight, Code, Palette, Zap, Users, BookOpen, Star, Database, GitBranch, BarChart, Trophy, Swords, FileText, Target } from 'lucide-react';
import DailyProblem from '../components/Motivator/DailyProblem';
import { useGamification } from '../hooks/useGamification';

export default function Home() {
  const { stats } = useGamification();

  return (
    <Layout title="Student Resource Hub - Master Engineering">
      <section className="relative w-full h-[50vh] overflow-hidden border-b border-ui-border/20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
        {/* Subtle overlay for video integration */}
        <div className="absolute inset-0 bg-ui-dark/20"></div>
      </section>
      
      {/* Hero Content Section */}
      <section className="py-16 md:py-24 bg-ui-dark text-center border-b border-ui-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center text-left">
          
          <div className="lg:col-span-2">
            {stats.xp > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full mb-6">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-accent">Welcome back, Level {stats.level} Developer</span>
              </div>
            )}
            <h1 className="text-5xl md:text-8xl font-black mb-8 text-text-primary tracking-tighter leading-none">
              Master Engineering <br />
              <span className="text-accent">Build the Future</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-text-secondary max-w-2xl leading-relaxed font-medium">
              Transform your coding journey into a structured career path with industry roadmaps, interactive labs, and automated quality reviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/subjects" className="px-10 py-5 bg-accent text-primary rounded-2xl font-black shadow-glow hover:bg-highlight hover:scale-105 transition-all text-sm uppercase tracking-widest">
                Start Learning
              </Link>
              <Link href="/evaluator" className="px-10 py-5 bg-transparent border-2 border-accent text-accent rounded-2xl font-black hover:bg-accent/10 transition-all text-sm uppercase tracking-widest">
                Job Ready Check
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
             <DailyProblem />
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-ui-dark text-text-primary border-b border-ui-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">Why Choose Student Resource Hub?</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Master 60+ technologies with structured masterclasses, interactive code examples, and portfolio-ready projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-ui-card rounded-xl shadow-lg border border-ui-border hover:border-accent transition-colors duration-300">
              <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-lg border border-ui-border/50">
                <img src="/books.jpg" alt="Live Code Editor" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Live Code Editor</h3>
              <p className="text-text-secondary">
                Write and run code directly in your browser with Prism.js syntax highlighting. Test each lesson's code examples instantly.
              </p>
            </div>

            <Link href="/navigator" className="text-center p-6 bg-ui-card rounded-xl shadow-lg border border-ui-border hover:border-accent transition-all duration-300 group">
              <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-lg border border-ui-border/50 group-hover:scale-105 transition-transform">
                <img src="/brain.jpg" alt="AI Navigator" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary group-hover:text-accent">Career Navigator</h3>
              <p className="text-text-secondary">
                Our new AI-driven Roadmap system. Track your progress, unlock topics sequentially, and follow industrial paths for roles like Full Stack Dev & System Architect.
              </p>
            </Link>

            <div className="text-center p-6 bg-ui-card rounded-xl shadow-lg border border-ui-border hover:border-accent transition-colors duration-300">
              <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-lg border border-ui-border/50">
                <img src="/studying.png" alt="Real Projects" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Real Projects</h3>
              <p className="text-text-secondary">
                Build portfolio sites, REST APIs, Django web apps, and database-driven applications to showcase to employers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Lab Teaser */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5 radial-gradient opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-accent font-bold tracking-widest uppercase text-xs mb-4 block">New Feature</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-6 leading-tight">
                Don't just read about code. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-highlight">Experience it.</span>
              </h2>
              <p className="text-xl text-text-secondary mb-10 leading-relaxed">
                Step into our <strong>Interactive Practice Lab</strong>. From visualizing complex algorithms to building frontend components in our live studio, we provide the tools to master engineering by actually <em>doing</em> it.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/practice/web-playground" className="px-8 py-3 bg-accent text-primary font-bold rounded-xl hover:bg-highlight hover:text-white transition-all shadow-glow">
                  Open Web Studio
                </Link>
                <Link href="/practice/sorting-visualizer" className="px-8 py-3 bg-transparent border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/10 transition-all">
                  Explore Visualizers
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-accent/20 blur-3xl rounded-full opacity-30"></div>
              <div className="bg-ui-card border border-ui-border rounded-3xl p-4 shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800" 
                  alt="Code Visualization" 
                  className="rounded-2xl opacity-80"
                />
                <div className="absolute -bottom-8 -right-8 bg-accent p-6 rounded-2xl shadow-glow hidden md:block">
                  <BarChart className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motivator & Toolkit Section */}
      <section className="py-24 bg-ui-dark border-b border-ui-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <span className="text-[10px] font-black tracking-[0.3em] uppercase text-text-muted mb-4 block">The Career Engine</span>
             <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Tools to <span className="text-highlight">Accelerate</span> Growth</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <Link href="/evaluator/challenges/duel" className="group bg-ui-card border border-ui-border p-8 rounded-[2rem] hover:border-rose-500/50 transition-all shadow-xl">
               <div className="w-12 h-12 bg-rose-500/20 text-rose-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Swords className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold mb-3">Coding Duels</h3>
               <p className="text-xs text-text-secondary leading-relaxed mb-6">Challenge peers to real-time coding battles. Fastest solution wins XP & Rank.</p>
               <span className="text-[10px] font-black uppercase text-rose-500 flex items-center gap-2">Enter Arena <ArrowRight className="w-3 h-3" /></span>
            </Link>

            <Link href="/toolkit/resume-builder" className="group bg-ui-card border border-ui-border p-8 rounded-[2rem] hover:border-indigo-500/50 transition-all shadow-xl">
               <div className="w-12 h-12 bg-indigo-500/20 text-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold mb-3">Resume AI</h3>
               <p className="text-xs text-text-secondary leading-relaxed mb-6">Create ATS-optimized resumes auto-filled with your verified platform progress.</p>
               <span className="text-[10px] font-black uppercase text-indigo-400 flex items-center gap-2">Generate Now <ArrowRight className="w-3 h-3" /></span>
            </Link>

            <div className="group bg-ui-card border border-ui-border p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
               <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-xl flex items-center justify-center mb-6">
                  <Trophy className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold mb-3">Global Leaderboard</h3>
               <p className="text-xs text-text-secondary leading-relaxed mb-6">Compete globally and earn badges that reflect your true technical depth.</p>
               <span className="text-[10px] font-black uppercase text-emerald-500">Coming Season 1</span>
            </div>

             <div className="group bg-ui-card border border-ui-border p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
               <div className="w-12 h-12 bg-yellow-500/20 text-yellow-500 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold mb-3">Skill Analytics</h3>
               <p className="text-xs text-text-secondary leading-relaxed mb-6">Deep insights into your conceptual gaps and interview readiness scores.</p>
               <span className="text-[10px] font-black uppercase text-yellow-500">View Pro Stats</span>
            </div>

          </div>
        </div>
      </section>
      <section className="bg-ui-dark py-20 border-t border-ui-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">Available Courses</h2>
            <p className="text-xl text-text-secondary">
              Start your journey with our comprehensive curriculum
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Python Card */}
            <div className="bg-ui-card rounded-xl shadow-lg overflow-hidden hover:shadow-glow-blue transition-shadow border border-ui-border">
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <BookOpen className="h-6 w-6 text-accent mr-2" />
                  <h3 className="text-lg font-bold text-text-primary">Python Masterclass</h3>
                </div>
                <p className="text-text-secondary text-sm mb-3">
                  Complete Python curriculum from zero to hero.
                </p>
                <div className="text-xs text-text-muted mb-4">
                  <strong>Includes:</strong> Variables, OOP, Data Science, Web Dev
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">21 Topics • Comprehensive</span>
                  <Link href="/subjects/python-introduction" className="text-xs bg-accent text-primary font-bold px-3 py-1 rounded hover:bg-highlight hover:text-white transition">
                    Start Learning
                  </Link>
                </div>
              </div>
            </div>

            {/* JavaScript Card */}
            <div className="bg-ui-card rounded-xl shadow-lg overflow-hidden hover:shadow-glow-blue transition-shadow border border-ui-border">
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <Code className="h-6 w-6 text-accent mr-2" />
                  <h3 className="text-lg font-bold text-text-primary">JavaScript Ultimate</h3>
                </div>
                <p className="text-text-secondary text-sm mb-3">
                  Master the language of the web from basics to advanced.
                </p>
                <div className="text-xs text-text-muted mb-4">
                  <strong>Includes:</strong> ES6+, Async/Await, DOM, APIs
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">50 Topics • In-Depth</span>
                  <Link href="/subjects/js-introduction" className="text-xs bg-accent text-primary font-bold px-3 py-1 rounded hover:bg-highlight hover:text-white transition">
                    Start Learning
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-ui-dark rounded-xl border-2 border-dashed border-ui-border p-6 flex flex-col items-center justify-center text-center opacity-70">
              <Database className="h-8 w-8 text-text-muted mb-2" />
              <h3 className="font-bold text-text-secondary">MySQL & SQL</h3>
              <span className="px-3 py-1 bg-ui-border rounded-full text-[10px] font-bold text-text-muted uppercase tracking-widest mt-2">Coming Soon</span>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/subjects" className="btn-primary inline-flex items-center bg-accent text-primary hover:bg-highlight hover:shadow-[0_0_20px_rgba(31,209,193,0.4)]">
              View All Topics <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
