'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-4">
                {/* Breadcrumb */}
                <nav className="flex mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1">
                        <li>
                            <Link href="/" className="hover:text-brand-primary">
                                Home
                            </Link>
                        </li>
                        <li className="flex items-center">
                            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                            <span className="ml-1 text-brand-primary">Shop</span>
                        </li>
                    </ol>
                </nav>

                {/* Main content */}
                <main>{children}</main>
            </div>
        </div>
    );
} 