'use client';

import React, { createContext, useContext, useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();

    // Manual navigation loading control
    const startLoading = () => {
        NProgress.start();
        setIsLoading(true);
    };

    const stopLoading = () => {
        NProgress.done();
        setIsLoading(false);
    };

    useEffect(() => {
        // Listen for route changes at the DOM level since Next.js
        // doesn't expose router events in the App Router
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