'use client';

import React, { createContext, useContext, useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Only import NProgress on the client side
let NProgress: any = null;

// Context type definition
interface LoadingContextType {
    isLoading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
}

// Create the context with a default value that won't throw during SSR
const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    startLoading: () => { },
    stopLoading: () => { },
});

// Client-only content wrapper that uses NProgress
function LoadingProviderContent({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize NProgress only on the client side
    useEffect(() => {
        // Dynamic import of NProgress
        import('nprogress').then((module) => {
            NProgress = module.default;
            NProgress.configure({ showSpinner: false });
        });
    }, []);

    // Manual navigation loading control
    const startLoading = () => {
        if (NProgress) {
            NProgress.start();
        }
        setIsLoading(true);
    };

    const stopLoading = () => {
        if (NProgress) {
            NProgress.done();
        }
        setIsLoading(false);
    };

    useEffect(() => {
        // Only run on client
        if (typeof window === 'undefined') return;

        // Listen for route changes at the DOM level
        const handleRouteChangeStart = () => {
            startLoading();
        };

        const handleRouteChangeComplete = () => {
            stopLoading();
        };

        // Add event listeners for navigation clicks
        const handleLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            
            if (link && 
                link.href && 
                link.href.startsWith(window.location.origin) && 
                !link.target && 
                !link.hasAttribute('download') && 
                !e.metaKey && !e.ctrlKey && !e.shiftKey) {
                startLoading();
            }
        };

        const handleButtonClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const button = target.closest('button');
            
            if (button && button.getAttribute('data-navigation-button') === 'true') {
                startLoading();
            }
        };

        document.addEventListener('click', handleLinkClick);
        document.addEventListener('click', handleButtonClick);
        window.addEventListener('popstate', handleRouteChangeStart);
        
        return () => {
            document.removeEventListener('click', handleLinkClick);
            document.removeEventListener('click', handleButtonClick);
            window.removeEventListener('popstate', handleRouteChangeStart);
        };
    }, []);

    // Track route changes to stop loading
    useEffect(() => {
        // When pathname or searchParams change, that means navigation has completed
        stopLoading();
    }, [pathname, searchParams]);

    return (
        <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

// Create a client-only version of the LoadingProvider
const ClientLoadingProvider = dynamic(() =>
    Promise.resolve(({ children }: { children: React.ReactNode }) => (
        <LoadingProviderContent>{children}</LoadingProviderContent>
    )),
    { ssr: false }
);

// Main export that works in SSR
export function LoadingProvider({ children }: { children: React.ReactNode }) {
    return <ClientLoadingProvider>{children}</ClientLoadingProvider>;
}

// Hook to use the loading context
export function useLoading() {
    const context = useContext(LoadingContext);

    // Only throw error on client-side to avoid SSR issues
    if (context === undefined && typeof window !== 'undefined') {
        throw new Error('useLoading must be used within a LoadingProvider');
    }

    return context;
} 