import React from 'react';
import Layout from '../components/Layout';
import { Users, Target, BookOpen, Award, Github, Heart } from 'lucide-react';

export default function About() {
  return (
    <Layout title="About - Student Resource Hub" description="Learn about our mission to make web development accessible to everyone">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Student Resource Hub</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe everyone should have access to quality programming education. 
            Our mission is to make web development skills accessible, practical, and enjoyable to learn.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Target className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To democratize web development education by providing comprehensive, 
              hands-on tutorials that bridge the gap between theory and real-world application. 
              We focus on practical skills that help learners build actual projects from day one.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Heart className="h-8 w-8 text-red-500 mr-3" />
              <h2 className="text-2xl font-bold">Our Philosophy</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Learning by doing. Every lesson includes interactive examples, real code, 
              and practical exercises. We believe the best way to learn programming 
              is to write code, make mistakes, and build something meaningful.
            </p>
          </div>
        </div>

        {/* Teaching Approach */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-white mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Teaching Approach</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Structured learning paths designed by developers, for developers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progressive Learning</h3>
              <p className="text-blue-100">
                Start with fundamentals and gradually build complexity. 
                Each lesson builds on the previous one.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-blue-100">
                Learn alongside thousands of developers. 
                Share projects and get feedback from peers.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Project-Based</h3>
              <p className="text-blue-100">
                Build real projects that you can add to your portfolio. 
                Theory backed by practical application.
              </p>
            </div>
          </div>
        </div>

        {/* Curriculum Structure */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Curriculum Structure</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our courses are designed to take you from complete beginner to job-ready developer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="bg-orange-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <span className="text-orange-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">HTML Foundations</h3>
              <p className="text-sm text-gray-600">Structure and semantic markup</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">CSS Styling</h3>
              <p className="text-sm text-gray-600">Design and responsive layouts</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Python Programming</h3>
              <p className="text-sm text-gray-600">Logic and backend development</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="bg-yellow-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <span className="text-yellow-600 font-bold">4</span>
              </div>
              <h3 className="font-semibold mb-2">JavaScript</h3>
              <p className="text-sm text-gray-600">Interactivity and modern frameworks</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-100 rounded-2xl p-8 md:p-12 mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Student Resource Hub by the Numbers</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <div className="text-gray-600">Lessons Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">15k+</div>
              <div className="text-gray-600">Students Learning</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Projects Built</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-gray-600">Completion Rate</div>
            </div>
          </div>
        </div>

        {/* Open Source */}
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <Github className="h-12 w-12 text-gray-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Open Source & Community</h2>
            <p className="text-gray-600 mb-6">
              Student Resource Hub is built with modern web technologies and our curriculum is continuously 
              updated based on industry trends and community feedback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#" className="btn-primary">
                View on GitHub
              </a>
              <a href="#" className="btn-secondary">
                Join Community
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
