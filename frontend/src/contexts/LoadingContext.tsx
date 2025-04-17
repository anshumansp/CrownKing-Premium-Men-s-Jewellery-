'use client';

import React, { createContext, useContext, useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

// Initialize NProgress
NProgress.configure({ showSpinner: false });

interface LoadingContextType {
    isLoading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

function LoadingProviderContent({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

        const handleStart = () => {
            NProgress.start();
            setIsLoading(true);
        };

        const handleStop = () => {
            NProgress.done();
            setIsLoading(false);
        };

        // Run on first load
        handleStart();

        // Wait for initial page load to complete
        if (document.readyState === 'complete') {
            handleStop();
        } else {
            window.addEventListener('load', handleStop);
            return () => window.removeEventListener('load', handleStop);
        }
    }, []);

    // Track route changes
    useEffect(() => {
        NProgress.start();
        setIsLoading(true);

        // Simulate delay to ensure the loader is visible
        const timer = setTimeout(() => {
            NProgress.done();
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    const startLoading = () => {
        NProgress.start();
        setIsLoading(true);
    };

    const stopLoading = () => {
        NProgress.done();
        setIsLoading(false);
    };

    return (
        <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={null}>
            <LoadingProviderContent>{children}</LoadingProviderContent>
        </Suspense>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
} 