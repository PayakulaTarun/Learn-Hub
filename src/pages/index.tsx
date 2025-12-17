import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { ArrowRight, Code, Palette, Zap, Users, BookOpen, Star, Database, GitBranch } from 'lucide-react';

export default function Home() {
  return (
    <Layout title="LearnHub - Master Web Development">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master Web Development
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Learn HTML, CSS, JavaScript, Python, Java, and 60+ other technologies with comprehensive masterclasses and real-world projects
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/subjects" className="btn-primary bg-white text-primary hover:bg-gray-100">
                Start Learning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/about" className="btn-secondary border-white text-white hover:bg-white hover:text-primary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose LearnHub?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master 60+ technologies with structured masterclasses, interactive code examples, and portfolio-ready projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-24 h-24 mx-auto mb-4">
                <img src="/books.jpg" alt="Live Code Editor" className="w-full h-full object-cover rounded-lg" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Code Editor</h3>
              <p className="text-gray-600">
                Write and run code directly in your browser with Prism.js syntax highlighting. Test each lesson's code examples instantly.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-24 h-24 mx-auto mb-4">
                <img src="/brain.jpg" alt="Structured Learning Path" className="w-full h-full object-cover rounded-lg" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Structured Learning Path</h3>
              <p className="text-gray-600">
                Follow our recommended path from HTML basics → CSS styling → JavaScript/Python → Backend frameworks with clear difficulty levels
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-24 h-24 mx-auto mb-4">
                <img src="/studying.png" alt="Real Projects" className="w-full h-full object-cover rounded-lg" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real Projects</h3>
              <p className="text-gray-600">
                Build portfolio sites, REST APIs, Django web apps, and database-driven applications to showcase to employers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Available Courses</h2>
            <p className="text-xl text-gray-600">
              Start your journey with our comprehensive curriculum
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Python Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <BookOpen className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-bold">Python Masterclass</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Complete Python curriculum from zero to hero.
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  <strong>Includes:</strong> Variables, OOP, Data Science, Web Dev
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">21 Topics • Comprehensive</span>
                  <Link href="/subjects/python-introduction" className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-accent transition">
                    Start Learning
                  </Link>
                </div>
              </div>
            </div>

            {/* Coming Soon Card */}
            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center opacity-70">
              <Code className="h-8 w-8 text-gray-400 mb-2" />
              <h3 className="font-bold text-gray-500">JavaScript</h3>
              <p className="text-xs text-gray-400">Coming Soon</p>
            </div>

            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center opacity-70">
              <Database className="h-8 w-8 text-gray-400 mb-2" />
              <h3 className="font-bold text-gray-500">Databases</h3>
              <p className="text-xs text-gray-400">Coming Soon</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/subjects" className="btn-primary inline-flex items-center">
              View All Topics <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
