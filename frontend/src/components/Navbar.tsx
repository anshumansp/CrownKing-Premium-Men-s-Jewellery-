'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    MagnifyingGlassIcon,
    UserIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import WishlistCount from './WishlistCount';
import CartCount from './CartCount';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        setShowProfileMenu(false);
    };

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

                    <WishlistCount />

                    <CartCount />

                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center space-x-1 p-2 hover:text-gray-600"
                                aria-label="Profile"
                                aria-expanded={showProfileMenu}
                            >
                                <UserIcon className="h-5 w-5" />
                                <ChevronDownIcon className="h-4 w-4" />
                            </button>

                            {showProfileMenu && (
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50"
                                    onMouseLeave={() => setShowProfileMenu(false)}
                                >
                                    <div className="p-3 border-b border-gray-100">
                                        <p className="font-medium">{user?.name}</p>
                                        <p className="text-sm text-gray-500">{user?.email}</p>
                                    </div>
                                    <div className="py-1">
                                        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            My Account
                                        </Link>
                                        <Link href="/profile/details" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Personal Information
                                        </Link>
                                        <Link href="/profile/addresses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            My Addresses
                                        </Link>
                                        <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Order History
                                        </Link>
                                        <Link href="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Wishlist
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                                <Link href="/auth/login" className="hidden sm:block bg-black text-white py-2 px-4 hover:bg-gray-800 transition-colors font-medium">
                                    LOGIN
                                </Link>

                                <Link href="/auth/login" className="sm:hidden p-2 hover:text-gray-600">
                                    <UserIcon className="h-5 w-5" />
                                </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
} 