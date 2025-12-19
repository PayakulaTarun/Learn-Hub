import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A1A2F] text-[#EAF1FF] flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-[#112240] border border-rose-500/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <AlertTriangle size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 border border-rose-500/20">
                <AlertTriangle className="w-8 h-8 text-rose-500" />
              </div>

              <h1 className="text-3xl font-black mb-4 tracking-tight">System Critical Failure</h1>
              <p className="text-[#8892b0] mb-8 leading-relaxed">
                The application encountered an unexpected state and activated the safety mechanism to prevent data corruption.
              </p>

              {this.state.error && (
                <div className="bg-[#0A1A2F] rounded-lg p-4 font-mono text-xs text-rose-300 mb-8 border border-white/5 overflow-auto max-h-32">
                  {this.state.error.toString()}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} /> Reboot System
                </button>
                <Link 
                  href="/"
                  className="px-6 py-3 bg-[#1D3557] hover:bg-[#233A5E] text-[#EAF1FF] font-bold rounded-xl transition-all border border-[#233A5E] flex items-center justify-center gap-2"
                >
                  <Home size={18} /> Return to Base
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
