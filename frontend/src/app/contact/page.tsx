'use client';

import Image from 'next/image';
import React, { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would send the form data to your backend here
        console.log('Form submitted:', formData);
        setSubmitted(true);

        // Reset form after submission
        setTimeout(() => {
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
            setSubmitted(false);
        }, 3000);
    };

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative h-[300px] flex items-center">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/contact-hero.jpg"
                        alt="Contact CrownKing"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-brand-blue-dark/70" />
                </div>

                <div className="container-custom relative z-10 text-white">
                    <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
                    <p className="text-xl max-w-2xl">
                        We're here to assist you with any inquiries about our products and services
                    </p>
                </div>
            </section>

            {/* Contact Form & Info Section */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h2 className="heading-md mb-6">Send Us a Message</h2>

                            {submitted ? (
                                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-6">
                                    Thank you for your message! We'll get back to you as soon as possible.
                                </div>
                            ) : null}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                                        Subject *
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="Product Inquiry">Product Inquiry</option>
                                        <option value="Order Status">Order Status</option>
                                        <option value="Returns & Exchanges">Returns & Exchanges</option>
                                        <option value="Custom Order">Custom Order</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="input-field"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary w-full py-3 font-medium"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h2 className="heading-md mb-6">Contact Information</h2>

                            <div className="mb-8">
                                <p className="text-lg text-gray-700 mb-4">
                                    Have questions about our products, orders, or services? Our dedicated customer support team is here to help.
                                </p>
                                <p className="text-lg text-gray-700">
                                    Reach out to us through any of the channels below, and we'll get back to you as soon as possible.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-brand-cream-light rounded-full h-12 w-12 flex items-center justify-center mr-4 shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-primary">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">Our Store</h3>
                                        <p className="text-gray-700">
                                            123 Luxury Lane<br />
                                            London, UK W1S 1DP
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-brand-cream-light rounded-full h-12 w-12 flex items-center justify-center mr-4 shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-primary">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">Phone</h3>
                                        <p className="text-gray-700">
                                            Customer Service: +44 123 456 7890<br />
                                            Orders & Support: +44 123 456 7891
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-brand-cream-light rounded-full h-12 w-12 flex items-center justify-center mr-4 shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-primary">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">Email</h3>
                                        <p className="text-gray-700">
                                            General Inquiries: info@crownking.com<br />
                                            Customer Support: support@crownking.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-brand-cream-light rounded-full h-12 w-12 flex items-center justify-center mr-4 shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-primary">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">Business Hours</h3>
                                        <p className="text-gray-700">
                                            Monday - Friday: 9:00 AM - 6:00 PM<br />
                                            Saturday: 10:00 AM - 4:00 PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-16 bg-brand-cream-light">
                <div className="container-custom">
                    <h2 className="heading-md text-center mb-8">Visit Our Flagship Store</h2>
                    <div className="rounded-lg overflow-hidden h-[750px] relative">
                        {/* In a real application, you would integrate with Google Maps or another map provider */}
                        <Image
                            src="/store-map.jpg"
                            alt="CrownKing Store Location"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
} 