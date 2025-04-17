'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchOrderById,
    fetchOrderTracking,
    selectCurrentOrder,
    selectTrackingInfo,
    selectOrdersLoading,
    selectOrdersError,
    clearCurrentOrder
} from '@/redux/slices/orderSlice';

// Mock order tracking data
const mockTracking = {
    'ORD-001': {
        status: 'delivered',
        events: [
            { status: 'ordered', date: '2023-05-15T10:30:00Z', description: 'Order placed' },
            { status: 'processing', date: '2023-05-15T14:20:00Z', description: 'Payment confirmed, order processing' },
            { status: 'shipped', date: '2023-05-16T09:45:00Z', description: 'Package shipped', tracking: 'TRK123456789' },
            { status: 'out_for_delivery', date: '2023-05-20T08:30:00Z', description: 'Out for delivery' },
            { status: 'delivered', date: '2023-05-20T14:15:00Z', description: 'Delivered' }
        ]
    },
    'ORD-002': {
        status: 'processing',
        events: [
            { status: 'ordered', date: '2023-06-10T14:45:00Z', description: 'Order placed' },
            { status: 'processing', date: '2023-06-10T15:30:00Z', description: 'Payment confirmed, order processing' },
        ]
    }
};

// Mock order data
const mockOrders: Record<string, Order> = {
    'ORD-001': {
        id: 'ORD-001',
        total: 329.98,
        status: 'delivered',
        createdAt: '2023-05-15T10:30:00Z',
        items: [
            {
                id: '1',
                name: 'Gold Chain Bracelet',
                price: 249.99,
                quantity: 1,
                images: ['/images/products/bracelet-1.jpg'],
                category: 'bracelets',
                subCategory: 'gold',
                specifications: { 'material': '18K Gold' },
                rating: 4.8,
                reviews: 24,
                inStock: true,
                featured: true,
                discount: 0
            },
            {
                id: '3',
                name: 'Silver Cufflinks',
                price: 79.99,
                quantity: 1,
                images: ['/images/products/cufflinks-1.jpg'],
                category: 'accessories',
                subCategory: 'cufflinks',
                specifications: { 'material': 'Sterling Silver' },
                rating: 4.5,
                reviews: 12,
                inStock: true,
                featured: false,
                discount: 0
            }
        ],
        shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '123-456-7890',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
        },
        paymentDetails: {
            cardNumber: '**** **** **** 1234',
            expiryDate: '05/25',
            cvv: '***',
            nameOnCard: 'John Doe'
        }
    },
    'ORD-002': {
        id: 'ORD-002',
        total: 189.99,
        status: 'processing',
        createdAt: '2023-06-10T14:45:00Z',
        items: [
            {
                id: '2',
                name: 'Silver Pendant Necklace',
                price: 189.99,
                quantity: 1,
                images: ['/images/products/necklace-1.jpg'],
                category: 'necklaces',
                subCategory: 'silver',
                specifications: { 'material': 'Sterling Silver' },
                rating: 4.6,
                reviews: 18,
                inStock: true,
                featured: false,
                discount: 0
            }
        ],
        shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '123-456-7890',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
        },
        paymentDetails: {
            cardNumber: '**** **** **** 5678',
            expiryDate: '08/24',
            cvv: '***',
            nameOnCard: 'John Doe'
        }
    }
};

export default function OrderTracking({ params }: { params: { id: string } }) {
    const { id } = params;
    const { isLoading: authLoading, isAuthenticated } = useAuth();
    const dispatch = useDispatch();
    const order = useSelector(selectCurrentOrder);
    const tracking = useSelector(selectTrackingInfo);
    const isLoading = useSelector(selectOrdersLoading);
    const error = useSelector(selectOrdersError);

    useEffect(() => {
        if (isAuthenticated) {
            // @ts-ignore - Redux Toolkit typings issue
            dispatch(fetchOrderById(id));
            // @ts-ignore - Redux Toolkit typings issue
            dispatch(fetchOrderTracking(id));
        }

        // Cleanup function to clear current order when component unmounts
        return () => {
            dispatch(clearCurrentOrder());
        };
    }, [id, isAuthenticated, dispatch]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (authLoading || isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 mt-24 min-h-[calc(100vh-200px)]">
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-8 mt-24 min-h-[calc(100vh-200px)]">
                <div className="bg-white shadow-md rounded-lg p-10 max-w-lg mx-auto text-center">
                    <div className="mb-6">
                        <div className="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-brand-blue-dark mb-2">Sign In Required</h2>
                        <p className="text-gray-500 mb-6">Please log in to track your order.</p>
                        <div className="w-24 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto mb-6"></div>
                    </div>
                    <Link
                        href="/auth/login"
                        className="inline-block bg-brand-primary text-white px-8 py-3 rounded-md hover:bg-brand-blue-light transition-colors duration-300 shadow-sm"
                    >
                        Login to Your Account
                    </Link>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 mt-24 min-h-[calc(100vh-200px)]">
                <div className="bg-white shadow-md rounded-lg p-10 max-w-lg mx-auto text-center">
                    <div className="mb-6">
                        <div className="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-brand-blue-dark mb-2">Order Not Found</h2>
                        <p className="text-gray-500 mb-6">{error}</p>
                        <div className="w-24 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto mb-6"></div>
                    </div>
                    <Link
                        href="/orders"
                        className="inline-block bg-brand-primary text-white px-8 py-3 rounded-md hover:bg-brand-blue-light transition-colors duration-300 shadow-sm"
                    >
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    if (!order || !tracking) {
        return (
            <div className="container mx-auto px-4 py-8 mt-24 min-h-[calc(100vh-200px)]">
                <div className="bg-white shadow-md rounded-lg p-10 max-w-lg mx-auto text-center">
                    <div className="mb-6">
                        <div className="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-brand-blue-dark mb-2">Tracking Information Unavailable</h2>
                        <p className="text-gray-500 mb-6">We couldn't retrieve tracking information for this order.</p>
                        <div className="w-24 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto mb-6"></div>
                    </div>
                    <Link
                        href="/orders"
                        className="inline-block bg-brand-primary text-white px-8 py-3 rounded-md hover:bg-brand-blue-light transition-colors duration-300 shadow-sm"
                    >
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusStep = (status: string) => {
        const statusMap: Record<string, number> = {
            'ordered': 1,
            'processing': 2,
            'shipped': 3,
            'out_for_delivery': 4,
            'delivered': 5
        };
        return statusMap[status] || 0;
    };

    const currentStep = getStatusStep(tracking.status);

    return (
        <div className="container mx-auto px-4 py-8 mt-24 min-h-[calc(100vh-200px)]">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-brand-blue-dark mb-1">Order Tracking</h1>
                            <p className="text-gray-500">Order #{order.id}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <Link
                                href={`/orders/${order.id}`}
                                className="text-brand-primary hover:underline"
                            >
                                View Order Details
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Progress Bar */}
                    <div className="mb-12">
                        <div className="relative pt-8">
                            {/* Track Line */}
                            <div className="h-1 bg-gray-200 absolute top-12 left-0 right-0 z-0 mx-6"></div>

                            {/* Steps */}
                            <div className="flex justify-between relative z-10">
                                {/* Step 1: Ordered */}
                                <div className="flex flex-col items-center">
                                    <div className={`rounded-full flex items-center justify-center w-10 h-10 ${currentStep >= 1 ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <span className="mt-2 text-xs font-medium text-center">Ordered</span>
                                </div>

                                {/* Step 2: Processing */}
                                <div className="flex flex-col items-center">
                                    <div className={`rounded-full flex items-center justify-center w-10 h-10 ${currentStep >= 2 ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <span className="mt-2 text-xs font-medium text-center">Processing</span>
                                </div>

                                {/* Step 3: Shipped */}
                                <div className="flex flex-col items-center">
                                    <div className={`rounded-full flex items-center justify-center w-10 h-10 ${currentStep >= 3 ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                        </svg>
                                    </div>
                                    <span className="mt-2 text-xs font-medium text-center">Shipped</span>
                                </div>

                                {/* Step 4: Out for Delivery */}
                                <div className="flex flex-col items-center">
                                    <div className={`rounded-full flex items-center justify-center w-10 h-10 ${currentStep >= 4 ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </div>
                                    <span className="mt-2 text-xs font-medium text-center">Out for Delivery</span>
                                </div>

                                {/* Step 5: Delivered */}
                                <div className="flex flex-col items-center">
                                    <div className={`rounded-full flex items-center justify-center w-10 h-10 ${currentStep >= 5 ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="mt-2 text-xs font-medium text-center">Delivered</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold mb-4">Tracking Events</h2>

                    <div className="space-y-6">
                        {tracking.events.map((event: any, index: number) => (
                            <div key={index} className="flex">
                                <div className="mr-4">
                                    <div className={`rounded-full w-4 h-4 mt-1 ${index === 0 ? 'bg-brand-primary' : 'bg-gray-300'}`}></div>
                                    {index < tracking.events.length - 1 && (
                                        <div className="w-0.5 h-full bg-gray-200 ml-1.5"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:justify-between">
                                        <h3 className="font-medium mb-1">{event.description}</h3>
                                        <span className="text-sm text-gray-500 mb-2 sm:mb-0">{formatDate(event.date)}</span>
                                    </div>
                                    {event.tracking && (
                                        <p className="text-sm text-gray-500">Tracking Number: <span className="font-medium">{event.tracking}</span></p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 p-6 border-t border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
                    <p className="text-gray-700">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                        {order.shippingAddress.country}
                    </p>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="font-medium mb-2">Need Help?</h3>
                        <p className="text-sm text-gray-600 mb-4">If you have any questions about your order, please contact our customer support.</p>
                        <Link
                            href="/contact"
                            className="text-brand-primary hover:underline"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 