'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 text-red-500 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>

      <h1 className="text-5xl md:text-6xl font-bold mb-6">404 - Page Not Found</h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-8">
        Oops! The page you are looking for does not exist or has been moved.
      </p>

      <Link
        href="/" 
        className="inline-block bg-brand-primary text-white px-8 py-3 font-medium hover:bg-brand-primary-dark transition-colors"
      >
        Back to Home
      </Link>

      <div className="max-w-md mx-auto mt-12">
        <p className="text-gray-500 mb-4">You might also be interested in:</p>
        <div className="flex justify-center space-x-6">
          <Link href="/products" className="text-brand-primary hover:underline">
            Products
          </Link>
          <Link href="/contact" className="text-brand-primary hover:underline">
            Contact Us
          </Link>
          <Link href="/about" className="text-brand-primary hover:underline">
            About Us
          </Link>
        </div>
      </div>
    </div>
  );
}
