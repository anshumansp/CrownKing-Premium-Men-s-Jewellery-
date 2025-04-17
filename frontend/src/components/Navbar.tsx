'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    MagnifyingGlassIcon,
    UserIcon,
    ChevronDownIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import WishlistCount from './WishlistCount';
import CartCount from './CartCount';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';
import NavigationButton from './NavigationButton';

export default function Navbar() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { startLoading } = useLoading();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        setShowProfileMenu(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        startLoading();
        router.push('/products');
        setShowSearch(false);
        setSearchQuery('');
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
                    {showSearch ? (
                        <div className="relative flex-1 sm:max-w-xs">
                            <form onSubmit={handleSearch} className="flex items-center">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for products..."
                                    className="py-2 px-4 pr-10 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                                </button>
                            </form>
                            <button
                                onClick={() => setShowSearch(false)}
                                className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 p-2"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            className="p-2 hover:text-gray-600"
                            aria-label="Search"
                            onClick={() => setShowSearch(true)}
                        >
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </button>
                    )}

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