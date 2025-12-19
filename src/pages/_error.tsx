import { NextPageContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { AlertTriangle, Home, BookOpen, RefreshCw } from 'lucide-react';

interface ErrorProps {
  statusCode?: number;
  message?: string;
}

function Error({ statusCode, message }: ErrorProps) {
  const defaultMessage = statusCode
    ? `An error ${statusCode} occurred on server`
    : 'An error occurred on client';

  return (
    <Layout>
      <Head>
        <title>{statusCode ? `${statusCode} Error` : 'Error'} | Student Resource Hub</title>
        <meta name="description" content="An error occurred" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <AlertTriangle className="mx-auto text-orange-500" size={80} />
          </div>

          {/* Error Code */}
          {statusCode && (
            <div className="mb-4">
              <span className="text-6xl font-bold text-gray-300">{statusCode}</span>
            </div>
          )}

          {/* Message */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {message || defaultMessage}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#4A90E2] text-white font-medium rounded-lg hover:bg-[#357ABD] transition-colors"
            >
              <RefreshCw size={20} />
              Retry
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#4A90E2] font-medium rounded-lg border-2 border-[#4A90E2] hover:bg-gray-50 transition-colors"
            >
              <Home size={20} />
              Go Home
            </Link>
          </div>

          {/* Help */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              If this problem persists, try:
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>Refreshing the page</li>
              <li>Clearing your browser cache</li>
              <li>Going back to the <Link href="/" className="text-[#4A90E2] hover:underline">homepage</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const message = err?.message;
  return { statusCode, message };
};

export default Error;
