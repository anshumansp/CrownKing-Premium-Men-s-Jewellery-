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
    selectOrdersLoading,
    selectOrdersError
} from '@/redux/slices/orderSlice';
import { OrderCardSkeleton } from '@/components/Skeleton';
import { AppDispatch } from '@/redux/store';

// Mock order data for demo purposes
const mockOrders: Order[] = [
    {
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
    {
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
];

export default function Orders() {
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const orders = useSelector(selectOrders);
    const isOrdersLoading = useSelector(selectOrdersLoading);
    const error = useSelector(selectOrdersError);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchOrders());
        }
    }, [isAuthenticated, dispatch]);

    if (authLoading) {
        return (
            <div className="container mx-auto px-4 py-8 mt-24">
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
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
                        onClick={() => dispatch(fetchOrders())}
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
                    <div className="space-y-6">
                    {orders.map((order: Order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
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
                {order.items.map(item => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 mr-4">
                            {item.images && item.images[0] ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={item.images[0]}
                                        alt={item.name}
                                        fill
                                        className="object-cover rounded"
                                    />
                                </div>
                            ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                </div>
                            )}
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