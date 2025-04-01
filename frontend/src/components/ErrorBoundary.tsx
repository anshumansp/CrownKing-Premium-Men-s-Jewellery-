'use client';

import React from 'react';
import { logError } from '@/utils/errorHandler';

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        logError(error, { errorInfo });
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Oops! Something went wrong
                            </h2>
                            <p className="text-gray-600 mb-6">
                                We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
                            </p>
                            <div className="space-x-4">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-teal hover:bg-brand-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal"
                                >
                                    Refresh Page
                                </button>
                                <a
                                    href="/"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal"
                                >
                                    Go to Homepage
                                </a>
                            </div>
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="mt-6 p-4 bg-gray-100 rounded-md">
                                    <p className="text-sm text-gray-700 font-mono">
                                        {this.state.error.toString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
} 