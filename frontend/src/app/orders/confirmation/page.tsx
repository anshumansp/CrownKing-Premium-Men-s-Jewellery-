'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Order } from '@/types';

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        } else {
            setLoading(false);
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login to view your order details');
                setLoading(false);
                return;
            }

            const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch order details');
            }

            const data = await response.json();
            setOrder(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch order details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">Loading order details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <div className="text-center mb-8">
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600">
                        Thank you for your purchase. Your order has been successfully placed.
                    </p>
                    {orderId && (
                        <p className="text-gray-600 mt-2">
                            Your order number is <span className="font-semibold">{orderId}</span>
                        </p>
                    )}
                </div>

                <div className="border-t border-gray-200 pt-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
                    <ul className="space-y-2 text-gray-600">
                        <li>• You will receive an order confirmation email shortly</li>
                        <li>• Our team will process your order within 24-48 hours</li>
                        <li>• You will receive shipping information once your order is dispatched</li>
                        <li>• Track your order status in your order history</li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                    <Link
                        href="/orders"
                        className="bg-black text-white py-3 px-6 rounded text-center hover:bg-gray-800 transition"
                    >
                        View Order History
                    </Link>
                    <Link
                        href="/products"
                        className="border border-black text-black py-3 px-6 rounded text-center hover:bg-gray-100 transition"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function OrderConfirmation() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">Loading...</div>
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    );
} 