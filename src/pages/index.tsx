import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { ArrowRight, Code, Palette, Zap, Users, BookOpen, Star, Database, GitBranch } from 'lucide-react';

export default function Home() {
  return (
    <Layout title="LearnHub - Master Engineering">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full"
          >
            <source src="/background.mp4" type="video/mp4" />
          </video>
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master Engineering
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Learn Computer Science, Full Stack Development, System Design, and 60+ other technologies with comprehensive masterclasses and real-world projects
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/subjects" className="btn-primary bg-accent text-primary hover:bg-highlight hover:text-white border-2 border-accent hover:border-highlight backdrop-blur-sm font-bold shadow-[0_0_15px_rgba(31,209,193,0.3)] transition-all duration-300">
                Start Learning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/about" className="btn-secondary bg-black/30 border-2 border-white/50 text-white hover:bg-white/10 hover:border-white hover:text-accent backdrop-blur-md font-bold transition-all duration-300">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-ui-light text-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Why Choose LearnHub?</h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Master 60+ technologies with structured masterclasses, interactive code examples, and portfolio-ready projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-ui-border/10">
              <div className="w-24 h-24 mx-auto mb-4">
                <img src="/books.jpg" alt="Live Code Editor" className="w-full h-full object-cover rounded-lg" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary">Live Code Editor</h3>
              <p className="text-text-muted">
                Write and run code directly in your browser with Prism.js syntax highlighting. Test each lesson's code examples instantly.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-ui-border/10">
              <div className="w-24 h-24 mx-auto mb-4">
                <img src="/brain.jpg" alt="Structured Learning Path" className="w-full h-full object-cover rounded-lg" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary">Structured Learning Path</h3>
              <p className="text-text-muted">
                Follow our recommended path from HTML basics → CSS styling → JavaScript/Python → Backend frameworks with clear difficulty levels
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-ui-border/10">
              <div className="w-24 h-24 mx-auto mb-4">
                <img src="/studying.png" alt="Real Projects" className="w-full h-full object-cover rounded-lg" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary">Real Projects</h3>
              <p className="text-text-muted">
                Build portfolio sites, REST APIs, Django web apps, and database-driven applications to showcase to employers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="bg-ui-light py-20 border-t border-ui-border/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Available Courses</h2>
            <p className="text-xl text-text-muted">
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

            {/* Coming Soon Card */}
            <div className="bg-ui-dark rounded-xl border-2 border-dashed border-ui-border p-6 flex flex-col items-center justify-center text-center opacity-70">
              <Code className="h-8 w-8 text-text-muted mb-2" />
              <h3 className="font-bold text-text-secondary">JavaScript</h3>
              <p className="text-xs text-text-muted">Coming Soon</p>
            </div>

            <div className="bg-ui-dark rounded-xl border-2 border-dashed border-ui-border p-6 flex flex-col items-center justify-center text-center opacity-70">
              <Database className="h-8 w-8 text-text-muted mb-2" />
              <h3 className="font-bold text-text-secondary">Databases</h3>
              <p className="text-xs text-text-muted">Coming Soon</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/subjects" className="btn-primary inline-flex items-center bg-primary text-white hover:bg-secondary hover:shadow-[0_0_20px_rgba(77,163,255,0.4)]">
              View All Topics <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
