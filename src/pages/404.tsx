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

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-[#4A90E2] opacity-20">404</h1>
          </div>

          {/* Icon */}
          <div className="mb-8">
            <BookOpen className="mx-auto text-gray-400" size={80} />
          </div>

          {/* Message */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#4A90E2] text-white font-medium rounded-lg hover:bg-[#357ABD] transition-colors"
            >
              <Home size={20} />
              Go Home
            </Link>
            <Link
              href="/subjects"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#4A90E2] font-medium rounded-lg border-2 border-[#4A90E2] hover:bg-gray-50 transition-colors"
            >
              <BookOpen size={20} />
              Browse Subjects
            </Link>
          </div>

          {/* Navigation Help */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Suggested pages:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                href="/subjects"
                className="text-sm text-[#4A90E2] hover:underline"
              >
                All Subjects
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/"
                className="text-sm text-[#4A90E2] hover:underline"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
