'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo'; // Import the Logo component
import { ShoppingCartIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Corrected Heroicons import path and icon names

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-brand-teal via-brand-cream to-brand-teal-light shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/" className="text-brand-dark-blue hover:text-brand-teal px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link href="/products" className="text-brand-dark-blue hover:text-brand-teal px-3 py-2 rounded-md text-sm font-medium">
              Products
            </Link>
            {/* Add other links like Categories, About, etc. if needed */}
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Search Bar Placeholder */}
            <div className="relative">
              <input
                type="search"
                placeholder="Search jewellery..."
                className="pl-4 pr-8 py-1 rounded-full border border-brand-dark-blue/50 focus:ring-brand-teal focus:border-brand-teal text-sm"
              />
              {/* Magnifying glass icon can be added here */}
            </div>
            <Link href="/auth/login" className="text-brand-dark-blue hover:text-brand-teal">
              <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">Login/Account</span>
            </Link>
            <Link href="/cart" className="text-brand-dark-blue hover:text-brand-teal">
              <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">Shopping Cart</span>
              {/* Optional: Add cart item count badge */}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-dark-blue hover:text-brand-teal hover:bg-brand-cream focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-teal"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> // Use XMarkIcon
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" /> // Use Bars3Icon (formerly MenuIcon)
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-brand-cream">
          <Link href="/" className="text-brand-dark-blue hover:bg-brand-teal-light hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Home
          </Link>
          <Link href="/products" className="text-brand-dark-blue hover:bg-brand-teal-light hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Products
          </Link>
          <Link href="/auth/login" className="text-brand-dark-blue hover:bg-brand-teal-light hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Login / Register
          </Link>
          <Link href="/cart" className="text-brand-dark-blue hover:bg-brand-teal-light hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Cart
          </Link>
          {/* Search Bar Placeholder for Mobile */}
          <div className="px-3 py-2">
            <input
              type="search"
              placeholder="Search jewellery..."
              className="w-full pl-4 pr-8 py-1 rounded-full border border-brand-dark-blue/50 focus:ring-brand-teal focus:border-brand-teal text-sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
