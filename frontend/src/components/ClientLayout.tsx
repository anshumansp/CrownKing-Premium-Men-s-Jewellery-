'use client';

import React, { useEffect, Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import ChatWidget from './ChatWidget';

// Lazy load with custom loading placeholders
const Navbar = dynamic(() => import('./Navbar'), {
    loading: () => <div className="h-16 bg-white shadow-sm fixed top-0 left-0 right-0 z-50" />
});

const Footer = dynamic(() => import('./Footer'), {
    ssr: false,
    loading: () => <div className="py-8 bg-gray-100" />
});

// Placeholder components
const NavbarPlaceholder = () => (
    <div className="h-16 bg-white shadow-sm fixed top-0 left-0 right-0 z-50 animate-pulse" />
);

const MainContainer = ({ children }: { children: React.ReactNode }) => (
    <main className="flex-grow mt-16">
        {children}
    </main>
);

interface ClientLayoutProps {
    children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const [isClient, setIsClient] = useState(false);

    // Set up preloading for critical resources
    useEffect(() => {
        // Mark that we're on the client
        setIsClient(true);

        // Preload components after 100ms to prioritize main content
        const timer = setTimeout(() => {
            import('./Footer');
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Handle server-side rendering gracefully
    if (!isClient) {
        return (
            <>
                <NavbarPlaceholder />
                <MainContainer>{children}</MainContainer>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <MainContainer>{children}</MainContainer>
            <Footer />
            <ChatWidget />
        </>
    );
} 