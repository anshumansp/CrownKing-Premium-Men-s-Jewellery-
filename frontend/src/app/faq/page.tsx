'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

type FAQItem = {
    id: string;
    question: string;
    answer: React.ReactNode;
    category: string;
};

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const faqItems: FAQItem[] = [
        // Products
        {
            id: 'materials-used',
            question: 'What materials are used in your jewelry?',
            answer: (
                <p>
                    Our men's jewelry collection features premium materials including 925 Sterling Silver, 14K and 18K Gold (yellow, white, and rose),
                    Stainless Steel, and Titanium. We source ethically mined diamonds and gemstones for our statement pieces. Each product
                    description provides detailed information about the specific materials used.
                </p>
            ),
            category: 'products'
        },
        {
            id: 'size-guide',
            question: 'How do I determine the right size for my rings and bracelets?',
            answer: (
                <div>
                    <p className="mb-4">
                        For accurate sizing, we recommend visiting a local jeweler for professional measurement. However, you can also:
                    </p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Use our printable size guide (available on product pages)</li>
                        <li>Measure a ring that fits you well and compare to our size chart</li>
                        <li>For bracelets, measure your wrist with a flexible tape measure and add 0.5-1 inch for comfort</li>
                    </ul>
                    <p>
                        If you're uncertain, please <Link href="/contact" className="text-brand-primary hover:underline">contact our team</Link> for personalized assistance.
                    </p>
                </div>
            ),
            category: 'products'
        },
        {
            id: 'custom-jewelry',
            question: 'Do you offer custom or personalized jewelry?',
            answer: (
                <p>
                    Yes, we offer customization services including engraving, personalized designs, and bespoke pieces. For custom orders,
                    please <Link href="/contact" className="text-brand-primary hover:underline">contact our design team</Link> to discuss your requirements. Custom pieces typically
                    require 3-6 weeks for completion, depending on complexity.
                </p>
            ),
            category: 'products'
        },
        {
            id: 'hypoallergenic',
            question: 'Are your products hypoallergenic?',
            answer: (
                <p>
                    Many of our pieces are suitable for sensitive skin. Our stainless steel, titanium, and platinum pieces are
                    hypoallergenic. Our gold jewelry is nickel-free, making it suitable for most people with metal sensitivities.
                    Each product description specifies material composition for transparency.
                </p>
            ),
            category: 'products'
        },

        // Orders & Shipping
        {
            id: 'shipping-time',
            question: 'How long will it take to receive my order?',
            answer: (
                <div>
                    <p className="mb-4">Shipping timeframes vary based on your location and selected shipping method:</p>
                    <ul className="list-disc pl-5">
                        <li>Standard Shipping: 3-5 business days (domestic)</li>
                        <li>Express Shipping: 1-2 business days (domestic)</li>
                        <li>International Shipping: 7-14 business days</li>
                    </ul>
                </div>
            ),
            category: 'orders'
        },
        {
            id: 'order-tracking',
            question: 'How can I track my order?',
            answer: (
                <p>
                    Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order
                    by signing into your account and visiting the "Order History" section. If you've created a guest checkout,
                    use the order number and email address provided during checkout on our order tracking page.
                </p>
            ),
            category: 'orders'
        },
        {
            id: 'international-shipping',
            question: 'Do you ship internationally?',
            answer: (
                <div>
                    <p className="mb-4">
                        Yes, we ship to most countries worldwide. International orders may be subject to import duties, taxes, and customs
                        clearance fees, which are the responsibility of the recipient. Delivery times for international shipments typically
                        range from 7-14 business days, depending on the destination country and customs processing.
                    </p>
                    <p>
                        For specific information regarding shipping to your country, please <Link href="/contact" className="text-brand-primary hover:underline">contact our customer service</Link>.
                    </p>
                </div>
            ),
            category: 'orders'
        },
        {
            id: 'order-changes',
            question: 'Can I modify or cancel my order after placing it?',
            answer: (
                <p>
                    Order modifications or cancellations can be accommodated if requested within 2 hours of placing your order.
                    Once an order enters processing, we may not be able to make changes. Please contact our customer service team
                    immediately if you need to modify or cancel your order.
                </p>
            ),
            category: 'orders'
        },

        // Returns & Refunds
        {
            id: 'return-policy',
            question: 'What is your return policy?',
            answer: (
                <div>
                    <p className="mb-4">
                        We offer a 30-day return policy for unworn items in their original condition with all packaging and documentation.
                        Custom and personalized items cannot be returned unless there is a manufacturing defect.
                    </p>
                    <p>
                        To initiate a return, please visit our <Link href="/returns" className="text-brand-primary hover:underline">Returns Portal</Link> or contact our customer service team.
                    </p>
                </div>
            ),
            category: 'returns'
        },
        {
            id: 'refund-processing',
            question: 'How long does it take to process a refund?',
            answer: (
                <p>
                    Once we receive and inspect your returned item, refunds are typically processed within 3-5 business days.
                    The time it takes for the refund to appear in your account depends on your payment method and financial institution,
                    usually an additional 2-10 business days.
                </p>
            ),
            category: 'returns'
        },
        {
            id: 'exchanges',
            question: 'How do exchanges work?',
            answer: (
                <p>
                    For exchanges, initiate a standard return through our Returns Portal and place a new order for the desired item.
                    If you prefer a direct exchange, please contact our customer service team who can assist with the process and
                    ensure you're not charged twice.
                </p>
            ),
            category: 'returns'
        },
        {
            id: 'damaged-items',
            question: 'What if I receive a damaged or incorrect item?',
            answer: (
                <div>
                    <p className="mb-4">
                        If your item arrives damaged or is incorrect, please contact us within 48 hours of receipt. Please provide:
                    </p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Order number</li>
                        <li>Photos of the damaged/incorrect item</li>
                        <li>Description of the issue</li>
                    </ul>
                    <p>
                        We'll arrange for a replacement or refund at no additional cost to you, including return shipping.
                    </p>
                </div>
            ),
            category: 'returns'
        },

        // Care & Maintenance
        {
            id: 'jewelry-care',
            question: 'How should I care for my jewelry?',
            answer: (
                <div>
                    <p className="mb-4">
                        Proper care ensures your jewelry remains in excellent condition for years:
                    </p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Store pieces individually to prevent scratches</li>
                        <li>Remove jewelry before swimming, showering, or physical activities</li>
                        <li>Clean regularly with a soft cloth and appropriate jewelry cleaner</li>
                        <li>Avoid exposure to harsh chemicals and perfumes</li>
                    </ul>
                    <p>
                        For detailed care instructions, visit our <Link href="/care" className="text-brand-primary hover:underline">Jewelry Care Guide</Link>.
                    </p>
                </div>
            ),
            category: 'care'
        },
        {
            id: 'cleaning-products',
            question: 'What cleaning products should I use for my jewelry?',
            answer: (
                <p>
                    We recommend using mild soap and warm water for most pieces. For silver, use a designated silver polishing cloth.
                    For gold and platinum, a soft brush with mild soap works well. Avoid harsh chemicals, ultrasonic cleaners (except for
                    diamonds without treatments), and abrasive materials. Visit our online store for our selection of professional jewelry
                    cleaning products.
                </p>
            ),
            category: 'care'
        },
        {
            id: 'warranty',
            question: 'Do your products come with a warranty?',
            answer: (
                <p>
                    Yes, all our jewelry comes with a one-year limited warranty covering manufacturing defects. Our premium collections
                    include extended warranties of up to five years. The warranty does not cover damage from normal wear and tear, accidents,
                    or improper care. Please register your purchase on our website to activate your warranty.
                </p>
            ),
            category: 'care'
        },
        {
            id: 'repair-services',
            question: 'Do you offer repair services?',
            answer: (
                <p>
                    Yes, we provide repair and maintenance services for all our jewelry. Services include resizing, replating,
                    stone replacement, clasp repair, and chain soldering. Repairs for manufacturing defects within the warranty period
                    are complimentary. For out-of-warranty repairs, we provide quotes before proceeding. Please contact our customer
                    service to initiate a repair request.
                </p>
            ),
            category: 'care'
        },

        // Account & Payment
        {
            id: 'payment-methods',
            question: 'What payment methods do you accept?',
            answer: (
                <div>
                    <p className="mb-4">We accept a variety of payment methods:</p>
                    <ul className="list-disc pl-5">
                        <li>Major credit cards (Visa, Mastercard, American Express, Discover)</li>
                        <li>PayPal</li>
                        <li>Apple Pay</li>
                        <li>Google Pay</li>
                        <li>Shop Pay</li>
                        <li>Bank transfers</li>
                    </ul>
                </div>
            ),
            category: 'payment'
        },
        {
            id: 'account-benefits',
            question: 'What are the benefits of creating an account?',
            answer: (
                <div>
                    <p className="mb-4">Creating an account offers several advantages:</p>
                    <ul className="list-disc pl-5">
                        <li>Faster checkout process with saved shipping information</li>
                        <li>Order tracking and history</li>
                        <li>Access to exclusive promotions and early collection releases</li>
                        <li>Loyalty rewards program</li>
                        <li>Ability to create and share wishlists</li>
                        <li>Simplified returns and exchanges</li>
                    </ul>
                </div>
            ),
            category: 'payment'
        },
        {
            id: 'discount-codes',
            question: 'How do I apply a discount code to my order?',
            answer: (
                <p>
                    To apply a discount code, enter the code in the designated field during checkout, just before the payment step.
                    Click "Apply" to see the discount reflected in your order total. Please note that some discount codes cannot be
                    combined with other promotions, and some may have minimum purchase requirements or product restrictions.
                </p>
            ),
            category: 'payment'
        },
        {
            id: 'data-security',
            question: 'How do you protect my personal and payment information?',
            answer: (
                <p>
                    We take data security seriously. Our website uses SSL encryption to secure all transmissions of personal information.
                    We comply with PCI DSS standards for handling credit card data. We never store complete credit card details on our
                    servers. Additionally, we have implemented robust data protection protocols and regularly update our security measures
                    to safeguard your information. For more details, please review our Privacy Policy.
                </p>
            ),
            category: 'payment'
        }
    ];

    const categories = [
        { id: 'all', name: 'All Questions' },
        { id: 'products', name: 'Products' },
        { id: 'orders', name: 'Orders & Shipping' },
        { id: 'returns', name: 'Returns & Refunds' },
        { id: 'care', name: 'Care & Maintenance' },
        { id: 'payment', name: 'Account & Payment' }
    ];

    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const toggleItem = (id: string) => {
        setExpandedItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const filteredFaqs = faqItems.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = searchQuery === '' ||
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (typeof item.answer === 'string' && item.answer.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative h-[250px] flex items-center">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/faq-hero.jpg"
                        alt="Frequently Asked Questions"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-brand-blue-dark/70" />
                </div>

                <div className="container-custom relative z-10 text-white">
                    <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
                    <p className="text-xl max-w-2xl">
                        Find answers to common questions about our products, orders, and services
                    </p>
                </div>
            </section>

            {/* Search & Categories */}
            <section className="py-12 bg-white">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for answers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input-field pr-12 w-full"
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeCategory === category.id
                                            ? "bg-brand-primary text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Items */}
            <section className="py-8 pb-16 bg-white">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto">
                        {filteredFaqs.length === 0 ? (
                            <div className="text-center py-12">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                                </svg>
                                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                                <p className="text-gray-600 mb-6">Try adjusting your search or category selection</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setActiveCategory('all');
                                    }}
                                    className="btn-outline"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredFaqs.map((item) => (
                                    <div key={item.id} className="border rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleItem(item.id)}
                                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
                                        >
                                            <h3 className="font-semibold text-lg">{item.question}</h3>
                                            <span className="flex-shrink-0 ml-4">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className={`h-6 w-6 transition-transform ${expandedItems.includes(item.id) ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </span>
                                        </button>

                                        {expandedItems.includes(item.id) && (
                                            <div className="px-6 py-4 bg-gray-50 border-t">
                                                <div className="prose max-w-none text-gray-700">
                                                    {item.answer}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16 bg-brand-cream-light">
                <div className="container-custom text-center">
                    <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
                    <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                        Can't find what you're looking for? Our customer support team is here to help you with any questions you may have.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/contact" className="btn-primary">
                            Contact Us
                        </Link>
                        <a href="mailto:support@crownking.com" className="btn-outline">
                            Email Support
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
} 