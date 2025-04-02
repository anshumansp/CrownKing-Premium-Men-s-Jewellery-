'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function AboutPage() {
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/about-hero.jpg"
                        alt="CrownKing Story"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-brand-blue-dark/70" />
                </div>

                <div className="container-custom relative z-10 text-white">
                    <h1 className="text-5xl font-bold mb-4">Our Story</h1>
                    <p className="text-xl max-w-2xl">
                        The journey of redefining men's elegance through exquisite jewelry craftsmanship
                    </p>
                </div>
            </section>

            {/* Our Legacy Section */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="heading-lg mb-6">Our Legacy of Excellence</h2>
                            <p className="text-lg text-gray-700 mb-6">
                                Founded in 1978, CrownKing began with a simple yet powerful vision: to create exceptional jewelry that empowers men to express their unique style with confidence.
                            </p>
                            <p className="text-lg text-gray-700 mb-6">
                                What started as a small boutique in London has evolved into a global brand, recognized for its commitment to quality, innovative design, and timeless elegance.
                            </p>
                            <p className="text-lg text-gray-700">
                                Through decades of meticulous craftsmanship and dedication to excellence, we've established ourselves as pioneers in men's luxury accessories.
                            </p>
                        </div>
                        <div className="relative h-[400px] rounded-lg overflow-hidden">
                            <Image
                                src="/about-legacy.jpg"
                                alt="CrownKing Legacy"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Craftsmanship Section */}
            <section className="py-16 bg-brand-cream-light">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 relative h-[400px] rounded-lg overflow-hidden">
                            <Image
                                src="/about-craft.jpg"
                                alt="CrownKing Craftsmanship"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="heading-lg mb-6">Masterful Craftsmanship</h2>
                            <p className="text-lg text-gray-700 mb-6">
                                Every CrownKing piece is a testament to our unwavering commitment to craftsmanship. Our artisans combine traditional techniques with modern innovation to create jewelry of exceptional quality.
                            </p>
                            <p className="text-lg text-gray-700 mb-6">
                                We select only the finest materials – premium metals, ethically sourced gemstones, and precious elements – ensuring that each piece meets our exacting standards.
                            </p>
                            <p className="text-lg text-gray-700">
                                This meticulous attention to detail results in jewelry that not only looks magnificent but stands the test of time, becoming cherished heirlooms passed down through generations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-16 bg-white">
                <div className="container-custom text-center mb-12">
                    <h2 className="heading-lg mb-4">Our Core Values</h2>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                        The principles that guide every decision we make and every piece we create
                    </p>
                </div>

                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card p-8 text-center">
                            <div className="bg-brand-cream-light rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.5 20.25h-9a1.5 1.5 0 0 1-1.5-1.5v-10.5a1.5 1.5 0 0 1 1.5-1.5h9a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                            <p className="text-gray-700">
                                We pursue perfection in every aspect of our craft, from design to delivery, never compromising on quality.
                            </p>
                        </div>

                        <div className="card p-8 text-center">
                            <div className="bg-brand-cream-light rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Integrity</h3>
                            <p className="text-gray-700">
                                We conduct our business with honesty and transparency, respecting our customers, partners, and the environment.
                            </p>
                        </div>

                        <div className="card p-8 text-center">
                            <div className="bg-brand-cream-light rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                            <p className="text-gray-700">
                                We constantly push boundaries, combining tradition with modern techniques to create distinctive designs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-brand-primary text-white">
                <div className="container-custom text-center">
                    <h2 className="text-3xl font-bold mb-6">Experience the CrownKing Difference</h2>
                    <p className="text-lg mb-8 max-w-2xl mx-auto">
                        Discover our collection of meticulously crafted jewelry pieces designed to elevate your style.
                    </p>
                    <Link
                        href="/products"
                        className="bg-brand-secondary text-brand-primary font-medium py-3 px-8 rounded-md hover:bg-brand-cream-dark transition-colors duration-200 inline-block"
                    >
                        Explore Our Collection
                    </Link>
                </div>
            </section>
        </div>
    );
} 