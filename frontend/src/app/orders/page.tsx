'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types';

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
    const { user, isLoading, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isOrdersLoading, setIsOrdersLoading] = useState(true);

    useEffect(() => {
        // In a real implementation, this would fetch from an API
    const fetchOrders = async () => {
        try {
            setIsOrdersLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // For demo purposes, using mock data
            setOrders(mockOrders);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setIsOrdersLoading(false);
        }
    };

        if (isAuthenticated) {
            fetchOrders();
        } else {
            setIsOrdersLoading(false);
        }
    }, [isAuthenticated]);

    if (isLoading || isOrdersLoading) {
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
                <div className="bg-white shadow-md rounded-lg p-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">My Orders</h1>
                    <p className="text-gray-600 mb-6">Please log in to see your order history.</p>
                    <Link
                        href="/auth/login"
                        className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-24">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold mb-6">Order History</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                        <Link
                            href="/products"
                            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
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
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">Order Placed: {formatDate(order.createdAt)}</p>
                    <p className="font-medium">Order #{order.id}</p>
                </div>
                <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
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
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center">
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
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-gray-400 text-xs">No image</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-grow">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>

                        <div className="text-right">
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <p className="font-medium">Order Total:</p>
                    <p className="font-bold text-xl">${order.total.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
} 