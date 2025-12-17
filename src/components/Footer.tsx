import React from 'react';
import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ui-dark text-text-primary border-t border-ui-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo.png" alt="LearnHub Logo" className="h-10 w-auto" />
              <span className="text-xl font-bold text-text-primary">LearnHub</span>
            </div>
            <p className="text-text-muted max-w-md">
              Empowering students worldwide with comprehensive web development tutorials. 
              Learn HTML, CSS, JavaScript, and more at your own pace.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-text-primary">Courses</h3>
            <ul className="space-y-2 text-text-muted">
              <li><a href="/html" className="hover:text-accent transition-colors">HTML Tutorial</a></li>
              <li><a href="/css" className="hover:text-accent transition-colors">CSS Tutorial</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">JavaScript (Coming Soon)</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-text-primary">Resources</h3>
            <ul className="space-y-2 text-text-muted">
              <li><a href="#" className="hover:text-accent transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Examples</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Community</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-ui-border mt-8 pt-8 text-center text-text-muted">
          <p>&copy; 2024 LearnHub. Empowering students worldwide.</p>
        </div>
      </div>
    </footer>
  );
}