'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-16">
            <div className="text-center max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                <p className="text-gray-600 mb-8">
                    We're sorry, but there was an error loading this page.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Try again
                    </button>

                    <Link
                        href="/"
                        className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Go home
                    </Link>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 bg-gray-100 rounded-md text-left">
                        <p className="font-semibold mb-2">Error details:</p>
                        <p className="text-red-600 text-sm font-mono overflow-auto">
                            {error.message}
                        </p>
                        {error.stack && (
                            <details className="mt-2">
                                <summary className="text-sm cursor-pointer">Stack trace</summary>
                                <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-200 rounded">
                                    {error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 