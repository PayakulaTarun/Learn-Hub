import { NextPageContext } from 'next';

function Error({ statusCode }: { statusCode: number }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h1 className="text-6xl font-black text-rose-500 mb-4">{statusCode || 'Error'}</h1>
        <p className="text-xl text-gray-400 max-w-md text-center">
            {statusCode 
                ? `An error ${statusCode} occurred on server` 
                : 'An error occurred on client'}
        </p>
        <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-700 transition"
        >
            Reload Integration
        </button>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
