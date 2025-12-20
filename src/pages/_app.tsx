import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { AIProvider } from '../context/AIContext';
import ChatWidget from '../components/AI/ChatWidget';

  // Version Integrity Check
  import { useEffect } from 'react';

  export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        // Prevent mismatch issues by checking build ID
        fetch('/version.json')
            .then(res => res.json())
            .then(data => {
                console.log(`🚀 System Version: ${data.version} (${data.commit})`);
            })
            .catch(() => console.warn('Build version info missing'));
    }, []);

    return (
      <ErrorBoundary>
        <AuthProvider>
           <AIProvider>
              <Component {...pageProps} />
              <ChatWidget />
           </AIProvider>
        </AuthProvider>
      </ErrorBoundary>
    );
  }
