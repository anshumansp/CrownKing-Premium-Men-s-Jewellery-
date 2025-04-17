'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchOrders,
    selectOrders,
    selectOrdersPagination,
    selectOrdersLoading,
    selectOrdersError
} from '@/redux/slices/orderSlice';
import { OrderCardSkeleton } from '@/components/Skeleton';
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

export default function Orders() {
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const orders = useSelector(selectOrders);
    const { currentPage, totalPages, limit } = useSelector(selectOrdersPagination);
    const isOrdersLoading = useSelector(selectOrdersLoading);
    const error = useSelector(selectOrdersError);

    const [page, setPage] = useState(1);

    useEffect(() => {
        // Only fetch orders if user is authenticated and userId exists
        if (isAuthenticated && user && user.id) {
            dispatch(fetchOrders({ page, limit: 5 }));
        }
    }, [isAuthenticated, user, dispatch, page]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo(0, 0);
    };

    if (authLoading) {
        return (
            <div className="container mx-auto px-4 py-8 mt-24">
                <div className="flex justify-center items-center min-h-[300px]">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-8 mt-24">
                <div className="bg-white shadow-md rounded-lg p-10 max-w-lg mx-auto text-center">
                    <div className="mb-6">
                        <div className="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-brand-blue-dark mb-2">Sign In Required</h2>
                        <p className="text-gray-500 mb-6">Please log in to view your order history.</p>
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
            <div className="container mx-auto px-4 py-8 mt-24">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10 max-w-lg mx-auto text-center">
                    <div className="mb-6">
                        <div className="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-brand-blue-dark mb-2">Something Went Wrong</h2>
                        <p className="text-gray-500 mb-6">{error}</p>
                        <div className="w-24 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto mb-6"></div>
                    </div>
                    <button
                        onClick={() => {
                            dispatch(fetchOrders({ page, limit: 5 }));
                        }}
                        className="inline-block bg-brand-primary text-white px-8 py-3 rounded-md hover:bg-brand-blue-light transition-colors duration-300 shadow-sm"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-24">
            <h1 className="text-2xl font-bold mb-8">Order History</h1>

            {isOrdersLoading ? (
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <OrderCardSkeleton key={i} />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10 max-w-lg mx-auto text-center">
                    <div className="mb-6">
                        <div className="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-brand-blue-dark mb-2">No Orders Yet</h2>
                        <p className="text-gray-500 mb-6">You haven't placed any orders with us yet.</p>
                        <div className="w-24 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto mb-6"></div>
                    </div>
                    <Link
                        href="/products"
                            className="inline-block bg-brand-primary text-white px-8 py-3 rounded-md hover:bg-brand-blue-light transition-colors duration-300 shadow-sm"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                        <>
                    <div className="space-y-6">
                    {orders.map((order: Order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 1}
                                            className={`px-3 py-1 rounded-md ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        >
                                            Previous
                                        </button>

                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => handlePageChange(index + 1)}
                                                className={`px-3 py-1 rounded-md ${index + 1 === page ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page === totalPages}
                                            className={`px-3 py-1 rounded-md ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
            )}
        </div>
    );
}

interface OrderCardProps {
    order: Order;
}

function OrderCard({ order }: OrderCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
    }
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

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <p className="text-sm text-gray-500">Order Placed: {formatDate(order.createdAt)}</p>
                    <p className="font-medium">Order #{order.id}</p>
                </div>
                <div className="flex items-center mt-2 sm:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <Link
                        href={`/orders/tracking/${order.id}`}
                        className="ml-4 text-sm font-medium text-brand-primary hover:underline"
                    >
                        Track Order
                    </Link>
                    <Link
                        href={`/orders/${order.id}`}
                        className="ml-4 text-sm font-medium text-black hover:underline"
                    >
                        View Details
                    </Link>
                </div>
            </div>

            <div className="p-4 divide-y divide-gray-100">
                {order.items && order.items.map(item => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 mr-4">
                                <div className="relative w-full h-full">
                                    <Image
                                    src={getImageSrc(item)}
                                        alt={item.name}
                                        fill
                                        className="object-cover rounded"
                                    />
                            </div>
                        </div>
                        <div className="flex-grow mt-2 sm:mt-0">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 font-medium">₹{item.price.toLocaleString('en-IN')}</div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-center">
                <div className="text-sm text-gray-500">
                    <span>Total: </span>
                    <span className="font-medium text-black">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
                <div className="mt-3 sm:mt-0">
                    <Link
                        href="/support"
                        className="text-sm text-brand-primary hover:underline"
                    >
                        Need help with this order?
                    </Link>
                </div>
            </div>
        </div>
    );
} 