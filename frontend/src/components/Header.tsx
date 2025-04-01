'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo'; // Import the Logo component
import { ShoppingCartIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex md:items-center md:space-x-12">
            <Link href="/" className="nav-link font-medium">
              Home
            </Link>
            <Link href="/products" className="nav-link font-medium">
              Shop
            </Link>
            <Link href="/about" className="nav-link font-medium">
              About
            </Link>
            <Link href="/contact" className="nav-link font-medium">
              Contact
            </Link>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <button className="text-brand-blue-dark hover:text-brand-blue-light focus:outline-none">
              <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">Search</span>
            </button>
            <Link href="/wishlist" className="text-brand-blue-dark hover:text-brand-blue-light">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              <span className="sr-only">Wishlist</span>
            </Link>
            <Link href="/cart" className="text-brand-blue-dark hover:text-brand-blue-light relative">
              <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
              <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
              <span className="sr-only">Shopping Cart</span>
            </Link>
            <Link href="/auth/login" className="bg-brand-primary text-white px-6 py-2 rounded-md hover:bg-brand-blue-light transition-colors duration-200">
              LOGIN
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-blue-dark hover:text-brand-blue-light focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-4 pt-2 pb-3 space-y-1 bg-white border-t">
          <Link href="/" className="nav-link block py-2">
            Home
          </Link>
          <Link href="/products" className="nav-link block py-2">
            Shop
          </Link>
          <Link href="/about" className="nav-link block py-2">
            About
          </Link>
          <Link href="/contact" className="nav-link block py-2">
            Contact
          </Link>
          <Link href="/auth/login" className="nav-link block py-2">
            Login / Register
          </Link>
          <Link href="/cart" className="nav-link block py-2">
            Cart
          </Link>
          {/* Search Bar for Mobile */}
          <div className="py-2">
            <div className="relative">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 rounded-md border border-gray-300 focus:ring-brand-primary focus:border-brand-primary"
              />
              <button className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
