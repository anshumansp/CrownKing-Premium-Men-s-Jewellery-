'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
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
    const isLoadingRef = useRef(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize NProgress only on the client side
    useEffect(() => {
        // Dynamic import of NProgress
        import('nprogress').then((module) => {
            NProgress = module.default;
            NProgress.configure({
                showSpinner: false,
                minimum: 0.1,
                speed: 200,
                trickleSpeed: 50
            });
        });
    }, []);

    // Manual navigation loading control with debouncing
    const startLoading = () => {
        if (isLoadingRef.current) return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        isLoadingRef.current = true;
        if (NProgress) {
            NProgress.start();
        }
        setIsLoading(true);
    };

    const stopLoading = () => {
        if (!isLoadingRef.current) return;

        // Small delay to prevent flickering for fast navigations
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            isLoadingRef.current = false;
            if (NProgress) {
                NProgress.done();
            }
            setIsLoading(false);
            timeoutRef.current = null;
        }, 100);
    };

    // Simplified navigation event handling
    useEffect(() => {
        // Only run on client
        if (typeof window === 'undefined') return;

        // Single listener for navigation clicks
        const handleClicks = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check if this is a navigation link
            const link = target.closest('a');
            if (link && 
                link.href && 
                link.href.startsWith(window.location.origin) && 
                !link.target && 
                !link.hasAttribute('download') && 
                !e.metaKey && !e.ctrlKey && !e.shiftKey) {
                startLoading();
                return;
            }

            // Check if this is a navigation button
            const button = target.closest('button');
            if (button && button.getAttribute('data-navigation-button') === 'true') {
                startLoading();
                return;
            }
        };

        // Add a single event listener for all clicks
        document.addEventListener('click', handleClicks, { passive: true });
        window.addEventListener('popstate', startLoading, { passive: true });
        
        return () => {
            document.removeEventListener('click', handleClicks);
            window.removeEventListener('popstate', startLoading);
        };
    }, []);

    // Track route changes to stop loading
    useEffect(() => {
        stopLoading();
    }, [pathname, searchParams]);

    // Cleanup any pending timeouts on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

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