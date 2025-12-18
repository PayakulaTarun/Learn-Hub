import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { ArrowRight, Code, Palette, Zap, Users, BookOpen, Star, Database, GitBranch, BarChart } from 'lucide-react';

export default function Home() {
  return (
    <Layout title="LearnHub - Master Engineering">
      {/* Hero Section */}
      {/* Hero Section */}
      {/* Hero Video Section (Visual) */}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-text-primary">
            Master Engineering
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-text-secondary max-w-3xl mx-auto">
            Learn Computer Science, Full Stack Development, System Design, and 200+ other technologies with comprehensive masterclasses and real-world projects
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/subjects" className="btn-primary bg-accent text-primary hover:bg-highlight hover:text-white border-2 border-accent hover:border-highlight backdrop-blur-sm font-bold shadow-glow transition-all duration-300">
              Start Learning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/about" className="btn-secondary bg-transparent hover:bg-ui-border/50 text-text-primary border-2 border-text-secondary hover:border-accent hover:text-accent backdrop-blur-md font-bold transition-all duration-300">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-ui-dark text-text-primary border-b border-ui-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">Why Choose LearnHub?</h2>
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
                <Link href="/practice/sorting-visualizer" className="px-8 py-3 bg-accent text-primary font-bold rounded-xl hover:bg-highlight hover:text-white transition-all shadow-glow">
                  Explore Visualizers
                </Link>
                <Link href="/practice/web-playground" className="px-8 py-3 bg-ui-card border border-ui-border text-text-primary font-bold rounded-xl hover:border-accent transition-all">
                  Open Web Studio
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


      {/* Courses Preview */}
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
              <p className="text-xs text-text-muted">Coming Soon</p>
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
