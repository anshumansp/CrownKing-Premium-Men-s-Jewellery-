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
import { AppDispatch } from '@/redux/store';
import LoadingSpinner from '@/components/LoadingSpinner';

// Define image mappings and fallbacks
const CATEGORY_IMAGE_MAP = {
    ring: '/jewe5.jpg',
    rings: '/jewe5.jpg',
    bracelet: '/jewe2.webp',
    bracelets: '/jewe2.webp',
    necklace: '/jewe1.webp',
    necklaces: '/jewe1.webp',
    pendant: '/jewe8.webp',
    pendants: '/jewe8.webp',
    watch: '/jewe12.webp',
    watches: '/jewe12.webp',
    accessory: '/jewe9.jpg',
    accessories: '/jewe9.jpg',
    earring: '/jewe6.avif',
    earrings: '/jewe6.avif',
    default: '/jewe1.webp' // Default fallback image
};

// Fallback tracking data if API is not available
const fallbackTracking = {
        status: 'processing',
    events: [
        { status: 'ordered', date: new Date().toISOString(), description: 'Order placed' },
        { status: 'processing', date: new Date().toISOString(), description: 'Payment confirmed, order processing' },
    ]
};

type OrderTrackingParams = {
    id: string;
};

type OrderTrackingProps = {
    params: OrderTrackingParams;
};

export default function OrderTracking({ params }: OrderTrackingProps) {
    const { id } = params;
    const { isLoading: authLoading, isAuthenticated } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const order = useSelector(selectCurrentOrder);
    const tracking = useSelector(selectTrackingInfo);
    const isLoading = useSelector(selectOrdersLoading);
    const error = useSelector(selectOrdersError);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchOrderById(id));
            try {
            dispatch(fetchOrderTracking(id));
            } catch (error) {
                console.error('Error fetching tracking info:', error);
                // API might not be implemented yet - we continue without tracking data
            }
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

    // Get image source with fallback
    const getImageSrc = (item: any) => {
        if (item.images && item.images.length > 0 &&
            typeof item.images[0] === 'string' &&
            !item.images[0].includes('example.com')) {
            return item.images[0];
        }

        // Use category-based fallback
        if (item.category) {
            const category = item.category.toLowerCase();
            for (const [key, value] of Object.entries(CATEGORY_IMAGE_MAP)) {
                if (category.includes(key)) {
                    return value;
                }
            }
        }

        // Default fallback
        return CATEGORY_IMAGE_MAP.default;
    };

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'ordered':
                return 1;
            case 'processing':
                return 2;
            case 'shipped':
                return 3;
            case 'out_for_delivery':
                return 4;
            case 'delivered':
                return 5;
            case 'cancelled':
                return -1;
            default:
                return 0;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
            case 'ordered':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'out_for_delivery':
                return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 mt-24 min-h-[calc(100vh-200px)]">
                <div className="flex justify-center items-center min-h-[300px]">
                    <LoadingSpinner />
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

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8 mt-24 min-h-[calc(100vh-200px)]">
                <div className="bg-white shadow-md rounded-lg p-10 max-w-lg mx-auto text-center">
                    <div className="mb-6">
                        <div className="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-brand-blue-dark mb-2">Loading Order Information</h2>
                        <p className="text-gray-500 mb-6">Please wait while we retrieve your order information.</p>
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

    // Use actual tracking data or fallback
    const trackingData = tracking || {
        status: order.status,
        events: [
            { status: 'ordered', date: order.createdAt, description: 'Order placed' },
            ...((order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') ?
                [{ status: 'processing', date: order.createdAt, description: 'Payment confirmed, order processing' }] : []),
            ...(order.status === 'shipped' || order.status === 'delivered' ?
                [{ status: 'shipped', date: order.createdAt, description: 'Package shipped' }] : []),
            ...(order.status === 'delivered' ?
                [{ status: 'delivered', date: order.createdAt, description: 'Order delivered' }] : []),
            ...(order.status === 'cancelled' ?
                [{ status: 'cancelled', date: order.createdAt, description: 'Order cancelled' }] : []),
        ]
    };

    // Sort events by date
    const sortedEvents = [...trackingData.events].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const currentStep = getStatusStep(order.status);

    return (
        <div className="container mx-auto px-4 py-8 mt-24 min-h-[calc(100vh-200px)]">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Order Tracking</h1>
                <Link href="/orders" className="text-brand-primary font-medium hover:underline">
                    Back to Orders
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Order Status and Timeline */}
                <div className="md:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8">
                        <div className="border-b border-gray-200 p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                                    <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                                </div>
                                <div className="mt-2 sm:mt-0">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Progress Bar */}
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-6">Order Progress</h2>
                            {order.status === 'cancelled' ? (
                                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                                    <div className="flex">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-red-800">This order has been cancelled.</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center w-full mb-8">
                                    {['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, index) => (
                                        <div key={step} className="flex-1 flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${currentStep >= index + 1 ? 'bg-brand-primary text-white' : 'bg-gray-200'}`}>
                                                {currentStep > index + 1 ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                                ) : (
                                                    <span>{index + 1}</span>
                                                )}
                                            </div>
                                            <span className={`text-xs text-center ${currentStep >= index + 1 ? 'text-brand-primary font-medium' : 'text-gray-500'}`}>
                                                {step}
                                            </span>
                                            {index < 4 && (
                                                <div className={`hidden sm:block h-0.5 w-full ${currentStep > index + 1 ? 'bg-brand-primary' : 'bg-gray-200'}`} style={{ width: 'calc(100% - 2rem)' }}></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Event Timeline */}
                            <h2 className="text-lg font-semibold mb-4">Order Updates</h2>
                            <div className="space-y-4">
                                {sortedEvents.map((event, index) => (
                                    <div key={index} className="flex">
                                        <div className="mr-4">
                                            <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-brand-primary' : 'bg-gray-300'} mt-1.5`}></div>
                                            {index < sortedEvents.length - 1 && (
                                                <div className="w-0.5 bg-gray-200 h-full ml-1.5"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className={`text-sm font-medium ${index === 0 ? 'text-brand-primary' : 'text-gray-700'}`}>
                                                {event.description}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {formatDate(event.date)}
                                            </div>
                                            {event.tracking && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Tracking Number: <span className="font-medium">{event.tracking}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            </div>
                        </div>
                    </div>

                {/* Order Details */}
                <div className="md:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8">
                        <div className="border-b border-gray-200 p-4">
                            <h2 className="font-semibold">Order Summary</h2>
                        </div>
                        <div className="p-4">
                            <div className="space-y-3 mb-4">
                                {order.items && order.items.map((item) => (
                                    <div key={item.id} className="flex items-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 mr-3">
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={getImageSrc(item)}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover rounded"
                                                />
                                            </div>
                                </div>
                                <div className="flex-1">
                                            <p className="text-sm font-medium">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Total</span>
                                    <span className="font-medium">₹{order.total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8">
                        <div className="border-b border-gray-200 p-4">
                            <h2 className="font-semibold">Shipping Address</h2>
                        </div>
                        <div className="p-4">
                            <p className="text-sm">
                                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}<br />
                                {order.shippingAddress?.address}<br />
                                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br />
                                {order.shippingAddress?.country}<br />
                                {order.shippingAddress?.email}<br />
                                {order.shippingAddress?.phone}
                            </p>
                        </div>
                    </div>

                    {/* Need Help */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8">
                        <div className="border-b border-gray-200 p-4">
                            <h2 className="font-semibold">Need Help?</h2>
                        </div>
                        <div className="p-4">
                            <Link href="/support" className="text-brand-primary text-sm font-medium hover:underline">
                                Contact Customer Support
                        </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 