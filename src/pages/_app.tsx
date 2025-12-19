import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '../components/Auth/AuthContext';
import { AuthGateProvider } from '../components/Auth/AuthGateContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AuthGateProvider>
        <Component {...pageProps} />
      </AuthGateProvider>
    </AuthProvider>
  );
}
