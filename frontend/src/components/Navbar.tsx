'use client';

import React, { useState, useEffect, useCallback, memo, lazy, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    MagnifyingGlassIcon,
    UserIcon,
    ChevronDownIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';

// Lazy load components that aren't needed immediately
const WishlistCount = lazy(() => import('./WishlistCount'));
const CartCount = lazy(() => import('./CartCount'));
const SearchBar = lazy(() => import('./SearchBar'));

// Preload search component when user hovers over search icon
const preloadSearchBar = () => {
    import('./SearchBar');
};

function NavbarComponent() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const { startLoading } = useLoading();

    // Optimize scroll event handler
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 10);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Memoize event handlers
    const handleLogout = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        setShowProfileMenu(false);
    }, [logout]);

    const handleSearch = useCallback((query: string) => {
        startLoading();
        router.push(`/products?search=${encodeURIComponent(query)}`);
        setShowSearch(false);
    }, [startLoading, router]);

    const toggleProfileMenu = useCallback(() => {
        setShowProfileMenu(prev => !prev);
    }, []);

    const toggleSearch = useCallback(() => {
        setShowSearch(prev => !prev);
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
                    {showSearch ? (
                        <div className="relative flex-1 sm:max-w-xs">
                            <Suspense fallback={<div className="w-48 h-10 bg-gray-200 animate-pulse rounded-md" />}>
                                <SearchBar onSearch={handleSearch} />
                            </Suspense>
                            <button
                                onClick={toggleSearch}
                                className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 p-2"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            className="p-2 hover:text-gray-600"
                            aria-label="Search"
                                onClick={toggleSearch}
                                onMouseEnter={preloadSearchBar}
                        >
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </button>
                    )}

                    <Suspense fallback={<div className="w-10 h-10" />}>
                        <WishlistCount />
                    </Suspense>

                    <Suspense fallback={<div className="w-10 h-10" />}>
                        <CartCount />
                    </Suspense>

                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={toggleProfileMenu}
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

// Memoize the entire navbar to prevent unnecessary re-renders
const Navbar = memo(NavbarComponent);
export default Navbar; 