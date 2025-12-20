
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import dynamic from 'next/dynamic';
import { 
  Monitor, Layout as LayoutIcon, Code2, Palette, 
  Terminal, Play, Maximize2, Zap, Save 
} from 'lucide-react';

const MonacoEditor = dynamic(() => import('../../components/tools/MonacoEditor'), { ssr: false });

import { useAuth } from '../../context/AuthContext'; // UPDATED
import { useRouter } from 'next/router';

export default function WebPlayground() {
  const [html, setHtml] = useState('<!-- UI Structure -->\n<div class="card">\n  <h1>Student Resource Hub Studio</h1>\n  <p>The professional playground for engineers.</p>\n  <button id="action">Click Me</button>\n</div>');
  const [css, setCss] = useState('/* Component Styling */\nbody {\n  background: #070D18;\n  color: #EAF1FF;\n  font-family: system-ui, sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n}\n\n.card {\n  background: #0F1E33;\n  padding: 3rem;\n  border-radius: 2rem;\n  border: 1px solid #233A5E;\n  text-align: center;\n  box-shadow: 0 0 40px rgba(31, 209, 193, 0.1);\n}\n\nh1 {\n  color: #1FD1C1;\n  font-size: 3rem;\n  margin-bottom: 1rem;\n}\n\nbutton {\n  background: #1FD1C1;\n  border: none;\n  padding: 0.8rem 2rem;\n  border-radius: 0.5rem;\n  font-weight: bold;\n  cursor: pointer;\n  transition: 0.3s;\n}\n\nbutton:hover {\n  background: #4DA3FF;\n  transform: scale(1.05);\n}');
  const [js, setJs] = useState('// Logic\ndocument.getElementById("action").addEventListener("click", () => {\n  alert("Logic connected! Welcome to the lab.");\n});');
  const [srcDoc, setSrcDoc] = useState('');
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');

  const { user } = useAuth();
  const router = useRouter();

  const handleSave = () => {
    if (!user) {
        if(confirm('You must be logged in to save. Go to login?')) router.push('/login');
    } else {
        alert('Project saved! (Simulation)');
    }
  };

  const handleManualRun = () => {
    runCode();
  };

  const runCode = () => {
    const combinedCode = `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
    setSrcDoc(combinedCode);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      runCode();
    }, 800);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  return (
    <Layout title="Web Studio | Interactive Playground">
      <div className="flex flex-col h-[calc(100vh-64px)] bg-primary overflow-hidden">
        
        {/* Toolbar */}
        <div className="h-16 border-b border-ui-border bg-ui-dark px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
             <div className="p-2 bg-accent/20 rounded-lg">
                <Terminal className="w-5 h-5 text-accent" />
             </div>
             <div>
                <h1 className="text-sm font-bold text-text-primary tracking-tight">Student Resource Hub Studio</h1>
                <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">Frontend Environment v1.0</p>
             </div>
          </div>

          <div className="flex items-center gap-2">
             <div className="flex bg-primary/50 p-1 rounded-xl border border-ui-border mr-4">
                <button 
                  onClick={() => setActiveTab('html')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'html' ? 'bg-accent text-primary' : 'text-text-muted hover:text-text-primary'}`}
                >
                  index.html
                </button>
                <button 
                  onClick={() => setActiveTab('css')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'css' ? 'bg-accent text-primary' : 'text-text-muted hover:text-text-primary'}`}
                >
                  styles.css
                </button>
                <button 
                  onClick={() => setActiveTab('js')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'js' ? 'bg-accent text-primary' : 'text-text-muted hover:text-text-primary'}`}
                >
                  main.js
                </button>
             </div>
             
             <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-ui-card hover:bg-ui-border border border-ui-border rounded-xl text-xs font-bold transition-all"
             >
                <Save className="w-4 h-4" /> Save
             </button>
             <button 
                onClick={handleManualRun}
                className="flex items-center gap-2 px-6 py-2 bg-accent text-primary hover:bg-highlight hover:text-white rounded-xl text-xs font-bold transition-all shadow-glow"
             >
                <Play className="w-4 h-4 fill-current" /> Execute
             </button>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col lg:row-reverse">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
            
            {/* Editor Container */}
            <div className="border-r border-ui-border relative">
              {activeTab === 'html' && (
                <MonacoEditor 
                  language="html" 
                  value={html} 
                  onChange={(v) => setHtml(v || '')} 
                  height="100%"
                />
              )}
              {activeTab === 'css' && (
                <MonacoEditor 
                  language="css" 
                  value={css} 
                  onChange={(v) => setCss(v || '')} 
                  height="100%"
                />
              )}
              {activeTab === 'js' && (
                <MonacoEditor 
                  language="javascript" 
                  value={js} 
                  onChange={(v) => setJs(v || '')} 
                  height="100%"
                />
              )}
            </div>

            {/* Preview Container */}
            <div className="bg-white relative">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                 <div className="bg-ui-dark/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 border border-slate-200">
                    LIVE PREVIEW
                 </div>
              </div>
              <iframe
                srcDoc={srcDoc}
                title="output"
                sandbox="allow-scripts"
                width="100%"
                height="100%"
                className="border-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="h-8 bg-ui-dark border-t border-ui-border px-6 flex items-center justify-between text-[10px] text-text-muted font-mono">
           <div className="flex gap-4">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Compiled Successfully</span>
              <span>UTF-8</span>
           </div>
           <div>Student Resource Hub v1.0.0</div>
        </div>
      </div>
    </Layout>
  );
}
