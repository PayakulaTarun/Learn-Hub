import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { Home, BookOpen, ArrowLeft } from 'lucide-react';

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>404 - Page Not Found | Student Resource Hub</title>
        <meta name="description" content="The page you're looking for doesn't exist" />
      </Head>

      <div className="min-h-screen bg-ui-dark flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          {/* 404 Number */}
          <div className="mb-8 relative">
            <h1 className="text-9xl font-bold text-ui-card opacity-50 relative z-10">404</h1>
            <div className="absolute inset-0 flex items-center justify-center z-20">
               <h1 className="text-6xl font-bold text-accent/20 blur-sm">Lost?</h1>
            </div>
          </div>

          {/* Icon */}
          <div className="mb-8">
            <BookOpen className="mx-auto text-accent" size={80} />
          </div>

          {/* Message */}
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-text-muted mb-8">
            The AI Brain searched everywhere, but this page seems to have vanished into the void.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-primary font-bold rounded-lg hover:bg-accent/90 transition-colors shadow-glow"
            >
              <Home size={20} />
              Return Base
            </Link>
            <Link
              href="/subjects"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-ui-card text-text-primary font-medium rounded-lg border border-ui-border hover:border-accent transition-colors"
            >
              <BookOpen size={20} />
              Browse Knowledge
            </Link>
          </div>

          {/* Navigation Help */}
          <div className="mt-12 pt-8 border-t border-ui-border">
            <p className="text-sm text-text-muted mb-4">Did the AI send you here? Try asking again.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
