'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';

interface NavigationButtonProps {
    href: string;
    className?: string;
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
}

export default function NavigationButton({
    href,
    className = '',
    children,
    onClick,
}: NavigationButtonProps) {
    const router = useRouter();
    const { startLoading } = useLoading();

    const handleClick = (e: React.MouseEvent) => {
        // Allow custom onClick to run first
        if (onClick) {
            onClick(e);
            if (e.defaultPrevented) {
                return;
            }
        }

        e.preventDefault();
        startLoading();
        router.push(href);
    };

    return (
        <button
            className={className}
            onClick={handleClick}
            data-navigation-button="true"
        >
            {children}
        </button>
    );
} 