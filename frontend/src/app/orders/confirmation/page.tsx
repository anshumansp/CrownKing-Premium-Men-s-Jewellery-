'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, selectCurrentOrder, selectOrdersLoading } from '@/redux/slices/orderSlice';
import { AppDispatch } from '@/redux/store';
import LoadingSpinner from '@/components/LoadingSpinner';
import SearchBar from '@/components/SearchBar';

export default function OrderConfirmation() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const order = useSelector(selectCurrentOrder);
    const isLoading = useSelector(selectOrdersLoading);

    // Get orderId from URL query string or generate a random one
    const [orderId, setOrderId] = useState<string>('');
    const [estimatedDelivery, setEstimatedDelivery] = useState<string>('');

    useEffect(() => {
        if (searchParams) {
            const urlOrderId = searchParams.get('orderId');

            if (urlOrderId) {
                setOrderId(urlOrderId);
                dispatch(fetchOrderById(urlOrderId));
            } else {
                // Fallback to generating a random order ID if none is provided
                setOrderId(`ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);
            }
        } else {
            // If searchParams is null, generate a random order ID
            setOrderId(`ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);
        }

    // Calculate estimated delivery (5 days from now)
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 5);
        setEstimatedDelivery(deliveryDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }));

        // Track order confirmation
        console.log('Order confirmed:', orderId);
    }, [searchParams, dispatch, orderId]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-16 mt-16 min-h-screen">
                <div className="flex justify-center items-center min-h-[300px]">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 mt-16 min-h-screen">
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
                <SearchBar className="w-full" />
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center bg-green-100 p-3 rounded-full mb-6">
                            <CheckCircleIcon className="h-16 w-16 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
                        <p className="text-lg text-gray-600">
                            Thank you for your purchase. Your order has been received and is being processed.
                        </p>
                    </div>

                    <div className="border-t border-b border-gray-200 py-6 mb-6">
                        <div className="flex justify-between mb-4">
                            <span className="text-gray-600">Order Number:</span>
                            <span className="font-medium">{orderId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Estimated Delivery:</span>
                            <span className="font-medium">{estimatedDelivery}</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
                        <ul className="space-y-4">
                            <li className="flex">
                                <div className="rounded-full bg-gray-100 p-1 mr-4 flex-shrink-0">
                                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-black text-white">1</span>
                                </div>
                                <div>
                                    <h3 className="font-medium">Order Confirmation</h3>
                                    <p className="text-gray-600">We'll send you an email with your order details.</p>
                                </div>
                            </li>
                            <li className="flex">
                                <div className="rounded-full bg-gray-100 p-1 mr-4 flex-shrink-0">
                                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-black text-white">2</span>
                                </div>
                                <div>
                                    <h3 className="font-medium">Order Processing</h3>
                                    <p className="text-gray-600">Your order is now being processed by our team.</p>
                                </div>
                            </li>
                            <li className="flex">
                                <div className="rounded-full bg-gray-100 p-1 mr-4 flex-shrink-0">
                                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-black text-white">3</span>
                                </div>
                                <div>
                                    <h3 className="font-medium">Shipping</h3>
                                    <p className="text-gray-600">Once shipped, we'll update you with tracking information.</p>
                                </div>
                            </li>
                            <li className="flex">
                                <div className="rounded-full bg-gray-100 p-1 mr-4 flex-shrink-0">
                                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-black text-white">4</span>
                                </div>
                                <div>
                                    <h3 className="font-medium">Delivery</h3>
                                    <p className="text-gray-600">Your order will be delivered to your doorstep.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/orders"
                            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            View Orders
                            <ChevronRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
                        </Link>
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800"
                        >
                            Continue Shopping
                            <ChevronRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 