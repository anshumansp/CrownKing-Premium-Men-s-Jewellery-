'use client';

import Image from "next/image";
import Link from "next/link";
import ProductSection from '@/components/ProductSection';

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/jewe3.jpeg"
            alt="CrownKing Men's Jewelry"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-brand-blue-dark/60" />
        </div>

        <div className="container-custom relative z-10 text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Distinctive Elegance for Men
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Premium men's jewelry crafted with precision and sophistication
            </p>
            <Link
              href="/products"
              className="btn-primary text-lg px-8 py-3 inline-block"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Tagline Banner */}
      <section className="bg-brand-cream-light py-16">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Your Style. Your Statement.</h2>
          <h3 className="text-2xl md:text-3xl font-medium mb-6">"Timeless. Sophisticated. Unforgettable."</h3>
          <p className="text-lg text-brand-blue-dark/80">CrownKing since 1978</p>
        </div>
      </section>

      {/* Product Section */}
      <ProductSection />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-brand-cream-light rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-brand-primary">
                  <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.943c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 12.75v9h6.75a2.25 2.25 0 0 0 2.25-2.25v-6.75h-9Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Crafted with the finest materials and meticulous attention to detail</p>
            </div>
            <div className="text-center">
              <div className="bg-brand-cream-light rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-brand-primary">
                  <path d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Exclusive Designs</h3>
              <p className="text-gray-600">Unique pieces created by expert designers for a distinctive look</p>
            </div>
            <div className="text-center">
              <div className="bg-brand-cream-light rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-brand-primary">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lifetime Guarantee</h3>
              <p className="text-gray-600">We stand behind our products with comprehensive warranty services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-brand-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="mb-8 max-w-xl mx-auto">Subscribe to receive updates on new collections, exclusive offers, and styling tips.</p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field flex-1"
            />
            <button type="submit" className="bg-brand-secondary text-brand-primary font-medium py-2 px-6 rounded-md hover:bg-brand-cream-dark transition-colors duration-200 whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
