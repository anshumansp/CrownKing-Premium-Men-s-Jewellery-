import React from 'react';
import Link from 'next/link';
import Logo from './Logo'; // Re-use the logo
// Consider adding social media icons if needed (e.g., from react-icons)
// import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-brand-dark-blue via-brand-teal to-brand-teal-light text-brand-cream mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Brand Info */}
          <div className="mb-6 md:mb-0">
            <Logo className="mb-4" /> {/* Pass className if needed */}
            <p className="text-sm text-brand-cream/80">
              Premium Men's Jewellery. Crafted with excellence.
            </p>
            {/* Optional: Add address or contact info */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white text-sm">Home</Link></li>
              <li><Link href="/products" className="hover:text-white text-sm">All Products</Link></li>
              <li><Link href="/about" className="hover:text-white text-sm">About Us</Link></li> {/* Placeholder */}
              <li><Link href="/contact" className="hover:text-white text-sm">Contact</Link></li> {/* Placeholder */}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="hover:text-white text-sm">FAQ</Link></li> {/* Placeholder */}
              <li><Link href="/shipping" className="hover:text-white text-sm">Shipping & Returns</Link></li> {/* Placeholder */}
              <li><Link href="/privacy" className="hover:text-white text-sm">Privacy Policy</Link></li> {/* Placeholder */}
              <li><Link href="/terms" className="hover:text-white text-sm">Terms of Service</Link></li> {/* Placeholder */}
            </ul>
          </div>

          {/* Newsletter/Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Stay Connected</h3>
            <p className="text-sm mb-4 text-brand-cream/80">Sign up for exclusive offers and updates.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-3 py-2 rounded-l-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-teal-light"
              />
              <button
                type="submit"
                className="bg-brand-teal hover:bg-brand-teal-light text-white px-4 py-2 rounded-r-md text-sm font-medium"
              >
                Subscribe
              </button>
            </form>
            {/* Optional: Social Media Icons */}
            {/* <div className="flex space-x-4 mt-6">
              <a href="#" className="text-brand-cream/80 hover:text-white"><FaFacebook size={20} /></a>
              <a href="#" className="text-brand-cream/80 hover:text-white"><FaInstagram size={20} /></a>
              <a href="#" className="text-brand-cream/80 hover:text-white"><FaTwitter size={20} /></a>
            </div> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-brand-cream/20 text-center text-sm text-brand-cream/60">
          &copy; {currentYear} CrownKing. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
