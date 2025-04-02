'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function JewelryCarePage() {
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative h-[300px] flex items-center">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/care-hero.jpg"
                        alt="Jewelry Care"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-brand-blue-dark/70" />
                </div>

                <div className="container-custom relative z-10 text-white">
                    <h1 className="text-5xl font-bold mb-4">Jewelry Care Guide</h1>
                    <p className="text-xl max-w-2xl">
                        Maintain the brilliance and longevity of your premium jewelry with our expert care tips
                    </p>
                </div>
            </section>

            {/* Introduction */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h2 className="heading-lg mb-6">Preserving Your Investment</h2>
                        <p className="text-lg text-gray-700">
                            At CrownKing, we create jewelry that's designed to last for generations. With proper care and
                            maintenance, your pieces will remain as impressive as the day you acquired them. This guide
                            provides essential advice for protecting and maintaining your valuable jewelry collection.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-brand-cream-light rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Daily Care</h3>
                            <p className="text-gray-700">Simple practices to integrate into your routine that protect your jewelry during everyday wear</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-brand-cream-light rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Cleaning</h3>
                            <p className="text-gray-700">Specific techniques for safely cleaning different types of materials and gemstones</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-brand-cream-light rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-primary">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Storage</h3>
                            <p className="text-gray-700">Best practices for storing your jewelry to prevent damage and maintain its appearance</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Daily Care Section */}
            <section className="py-16 bg-brand-cream-light">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="heading-lg mb-6">Daily Care & Prevention</h2>
                            <p className="text-lg text-gray-700 mb-6">
                                The best way to keep your jewelry looking its best is to prevent damage before it occurs. Follow these guidelines during daily wear:
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <div className="bg-brand-primary rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-1 shrink-0">
                                        <span className="text-white font-medium">1</span>
                                    </div>
                                    <p className="text-gray-700">
                                        <strong>Put jewelry on last:</strong> Apply perfumes, colognes, lotions, and other personal care products before wearing your jewelry to prevent chemical exposure.
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <div className="bg-brand-primary rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-1 shrink-0">
                                        <span className="text-white font-medium">2</span>
                                    </div>
                                    <p className="text-gray-700">
                                        <strong>Remove during activities:</strong> Take off your jewelry before swimming, exercising, cleaning, or any manual labor to avoid exposure to chemicals, impact, or abrasion.
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <div className="bg-brand-primary rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-1 shrink-0">
                                        <span className="text-white font-medium">3</span>
                                    </div>
                                    <p className="text-gray-700">
                                        <strong>Avoid direct sunlight:</strong> Extended exposure to direct sunlight can fade certain gemstones and damage some treatments or finishes.
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <div className="bg-brand-primary rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-1 shrink-0">
                                        <span className="text-white font-medium">4</span>
                                    </div>
                                    <p className="text-gray-700">
                                        <strong>Regular checks:</strong> Periodically examine settings, clasps, and chains for signs of wear or damage, and address any issues promptly.
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <div className="relative h-[400px] rounded-lg overflow-hidden">
                            <Image
                                src="/care-daily.jpg"
                                alt="Daily Jewelry Care"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Cleaning Section */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <h2 className="heading-lg mb-8 text-center">Cleaning Different Types of Jewelry</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {/* Gold */}
                        <div className="card p-6">
                            <h3 className="text-xl font-semibold mb-4">Gold Jewelry</h3>
                            <div className="relative h-48 rounded-md overflow-hidden mb-4">
                                <Image
                                    src="/care-gold.jpg"
                                    alt="Gold Jewelry Care"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h4 className="font-medium mb-2">Recommended Cleaning:</h4>
                            <ul className="space-y-2 text-gray-700 mb-4">
                                <li>• Mix mild dish soap with warm water</li>
                                <li>• Use a soft-bristled brush to gently clean</li>
                                <li>• Rinse thoroughly with clean water</li>
                                <li>• Pat dry with a soft, lint-free cloth</li>
                            </ul>
                            <h4 className="font-medium mb-2">Avoid:</h4>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Harsh chemicals and abrasives</li>
                                <li>• Ultrasonic cleaners if pieces have stones</li>
                                <li>• Chlorinated water</li>
                            </ul>
                        </div>

                        {/* Silver */}
                        <div className="card p-6">
                            <h3 className="text-xl font-semibold mb-4">Silver Jewelry</h3>
                            <div className="relative h-48 rounded-md overflow-hidden mb-4">
                                <Image
                                    src="/care-silver.jpg"
                                    alt="Silver Jewelry Care"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h4 className="font-medium mb-2">Recommended Cleaning:</h4>
                            <ul className="space-y-2 text-gray-700 mb-4">
                                <li>• Use a silver polishing cloth regularly</li>
                                <li>• For tarnish, use a silver-specific cleaner</li>
                                <li>• Rinse thoroughly after cleaning</li>
                                <li>• Dry completely before storing</li>
                            </ul>
                            <h4 className="font-medium mb-2">Avoid:</h4>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Rubber and latex (causes tarnishing)</li>
                                <li>• Pools and hot tubs</li>
                                <li>• Sulfur-containing foods and environments</li>
                            </ul>
                        </div>

                        {/* Gemstones */}
                        <div className="card p-6">
                            <h3 className="text-xl font-semibold mb-4">Gemstone Jewelry</h3>
                            <div className="relative h-48 rounded-md overflow-hidden mb-4">
                                <Image
                                    src="/care-gemstones.jpg"
                                    alt="Gemstone Jewelry Care"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h4 className="font-medium mb-2">Recommended Cleaning:</h4>
                            <ul className="space-y-2 text-gray-700 mb-4">
                                <li>• Mild soap solution for most gemstones</li>
                                <li>• Clean around settings with a soft brush</li>
                                <li>• Wipe with a damp cloth, then dry</li>
                                <li>• Consider professional cleaning annually</li>
                            </ul>
                            <h4 className="font-medium mb-2">Avoid:</h4>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Heat exposure (can damage some stones)</li>
                                <li>• Ultrasonic cleaners (except for diamonds)</li>
                                <li>• Harsh chemicals or solvents</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-brand-blue-dark/5 rounded-lg p-6 max-w-3xl mx-auto">
                        <h3 className="text-xl font-semibold mb-4 text-center">Professional Cleaning & Maintenance</h3>
                        <p className="text-gray-700 mb-4">
                            While regular at-home care is essential, we recommend professional cleaning and inspection at least
                            once a year. Our expert jewelers can:
                        </p>
                        <ul className="space-y-2 text-gray-700 mb-4">
                            <li>• Deep clean in hard-to-reach areas</li>
                            <li>• Check and tighten settings</li>
                            <li>• Inspect for any potential issues</li>
                            <li>• Repolish and restore surfaces</li>
                            <li>• Reapply protective coatings when necessary</li>
                        </ul>
                        <div className="text-center mt-6">
                            <Link href="/contact" className="btn-primary">
                                Schedule a Cleaning
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Storage Section */}
            <section className="py-16 bg-brand-cream-light">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 relative h-[400px] rounded-lg overflow-hidden">
                            <Image
                                src="/care-storage.jpg"
                                alt="Jewelry Storage"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="heading-lg mb-6">Proper Storage</h2>
                            <p className="text-lg text-gray-700 mb-6">
                                How you store your jewelry when not wearing it is just as important as how you care for it during use.
                                Follow these best practices:
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <div className="bg-brand-primary rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-1 shrink-0">
                                        <span className="text-white font-medium">1</span>
                                    </div>
                                    <p className="text-gray-700">
                                        <strong>Keep pieces separate:</strong> Store items individually in soft pouches or compartmentalized boxes to prevent scratching and tangling.
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <div className="bg-brand-primary rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-1 shrink-0">
                                        <span className="text-white font-medium">2</span>
                                    </div>
                                    <p className="text-gray-700">
                                        <strong>Control humidity:</strong> Store in a cool, dry place with stable humidity levels to prevent tarnishing and corrosion.
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <div className="bg-brand-primary rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-1 shrink-0">
                                        <span className="text-white font-medium">3</span>
                                    </div>
                                    <p className="text-gray-700">
                                        <strong>Use anti-tarnish products:</strong> For silver pieces, consider anti-tarnish strips or cloths in your storage containers.
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <div className="bg-brand-primary rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-1 shrink-0">
                                        <span className="text-white font-medium">4</span>
                                    </div>
                                    <p className="text-gray-700">
                                        <strong>Secure storage:</strong> Keep valuable pieces in a safe or secure location when not in use, especially during travel.
                                    </p>
                                </li>
                            </ul>
                            <div className="mt-6">
                                <Link href="/products/accessories" className="text-brand-primary font-medium hover:underline flex items-center">
                                    <span>Shop Our Jewelry Storage Solutions</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <h2 className="heading-lg mb-8 text-center">Frequently Asked Questions</h2>

                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="card p-6">
                            <h3 className="text-xl font-semibold mb-3">How often should I clean my jewelry?</h3>
                            <p className="text-gray-700">
                                For pieces worn daily, a quick wipe with a soft cloth after each use is recommended.
                                More thorough cleaning should be done every few weeks, and professional cleaning at least annually.
                            </p>
                        </div>

                        <div className="card p-6">
                            <h3 className="text-xl font-semibold mb-3">Can I wear my jewelry in the shower?</h3>
                            <p className="text-gray-700">
                                We don't recommend it. Soaps, shampoos, and shower gels can leave residue on your jewelry,
                                dulling its appearance. Hard water can also contribute to tarnishing, especially for silver pieces.
                            </p>
                        </div>

                        <div className="card p-6">
                            <h3 className="text-xl font-semibold mb-3">Is it safe to use an ultrasonic cleaner?</h3>
                            <p className="text-gray-700">
                                Ultrasonic cleaners are generally safe for solid gold and diamonds but can damage certain gemstones
                                and affect treated stones or pieces with glued elements. When in doubt, opt for gentler cleaning methods
                                or consult with our specialists.
                            </p>
                        </div>

                        <div className="card p-6">
                            <h3 className="text-xl font-semibold mb-3">What should I do if a stone becomes loose?</h3>
                            <p className="text-gray-700">
                                Stop wearing the piece immediately to prevent stone loss and bring it to our store for professional repair.
                                Continuing to wear jewelry with loose settings can lead to permanent damage or loss of the gemstone.
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Link href="/faq" className="btn-outline">
                            View All FAQs
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-brand-primary text-white">
                <div className="container-custom text-center">
                    <h2 className="text-3xl font-bold mb-6">Need Personalized Jewelry Care Advice?</h2>
                    <p className="text-lg mb-8 max-w-2xl mx-auto">
                        Our expert jewelers are available to provide tailored recommendations based on your specific pieces and lifestyle.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link
                            href="/contact"
                            className="bg-brand-secondary text-brand-primary font-medium py-3 px-8 rounded-md hover:bg-brand-cream-dark transition-colors duration-200 inline-block"
                        >
                            Contact Our Experts
                        </Link>
                        <Link
                            href="/products/care-kits"
                            className="bg-transparent border border-white text-white font-medium py-3 px-8 rounded-md hover:bg-white/10 transition-colors duration-200 inline-block"
                        >
                            Shop Care Products
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
} 