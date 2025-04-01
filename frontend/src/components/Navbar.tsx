'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCartIcon, HeartIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'
                }`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex-shrink-0">
                    <div className="relative w-[160px] h-[42px]">
                        <Image
                            src="/CrownKing.svg"
                            alt="CrownKing"
                            fill
                            priority
                            className="object-contain"
                        />
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex space-x-8">
                    <Link href="/" className="text-black hover:text-gray-600 font-medium">
                        Home
                    </Link>
                    <Link href="/products" className="text-black hover:text-gray-600 font-medium">
                        Shop
                    </Link>
                    <Link href="/about" className="text-black hover:text-gray-600 font-medium">
                        About
                    </Link>
                    <Link href="/contact" className="text-black hover:text-gray-600 font-medium">
                        Contact
                    </Link>
                </nav>

                {/* Action Icons */}
                <div className="flex items-center space-x-4">
                    <button className="p-2 hover:text-gray-600" aria-label="Search">
                        <MagnifyingGlassIcon className="h-5 w-5" />
                    </button>

                    <Link href="/wishlist" className="p-2 hover:text-gray-600" aria-label="Wishlist">
                        <HeartIcon className="h-5 w-5" />
                    </Link>

                    <Link href="/cart" className="p-2 hover:text-gray-600 relative" aria-label="Cart">
                        <ShoppingCartIcon className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">0</span>
                    </Link>

                    <Link href="/auth/login" className="hidden sm:block bg-black text-white py-2 px-4 hover:bg-gray-800 transition-colors font-medium">
                        LOGIN
                    </Link>

                    <Link href="/auth/login" className="sm:hidden p-2 hover:text-gray-600">
                        <UserIcon className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </header>
    );
} 