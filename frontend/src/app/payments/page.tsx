'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchPayments,
    selectPayments,
    selectPaymentsLoading,
    selectPaymentsError,
    Payment
} from '@/redux/slices/paymentSlice';
import { TableRowSkeleton } from '@/components/Skeleton';
import { AppDispatch } from '@/redux/store';

// Mock payment data for demo purposes
const mockPayments = [
    {
        id: 'PAY-001',
        orderId: 'ORD-001',
        amount: 329.98,
        status: 'completed',
        method: 'credit_card',
        cardLast4: '1234',
        cardType: 'Visa',
        date: '2023-05-15T10:30:00Z'
    },
    {
        id: 'PAY-002',
        orderId: 'ORD-002',
        amount: 189.99,
        status: 'completed',
        method: 'credit_card',
        cardLast4: '5678',
        cardType: 'Mastercard',
        date: '2023-06-10T14:45:00Z'
    },
    {
        id: 'PAY-003',
        orderId: 'ORD-003',
        amount: 125.50,
        status: 'refunded',
        method: 'credit_card',
        cardLast4: '9012',
        cardType: 'Visa',
        date: '2023-04-22T09:15:00Z'
    }
];

export default function Payments() {
    const { isLoading: authLoading, isAuthenticated } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const payments = useSelector(selectPayments);
    const isLoading = useSelector(selectPaymentsLoading);
    const error = useSelector(selectPaymentsError);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchPayments());
        }
    }, [isAuthenticated, dispatch]);

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'PPP');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Completed</span>;
            case 'pending':
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Pending</span>;
            case 'failed':
                return <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">Failed</span>;
            case 'refunded':
                return <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">Refunded</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full font-medium">{status}</span>;
        }
    };

    const getPaymentIcon = (method: string, cardType?: string) => {
        if (method === 'credit_card') {
            if (cardType === 'Visa') {
                return (
                    <div className="w-8 h-6 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded">
                        VISA
                    </div>
                );
            } else if (cardType === 'Mastercard') {
                return (
                    <div className="w-8 h-6 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded">
                        MC
                    </div>
                );
            }
        }

        return (
            <div className="w-8 h-6 flex items-center justify-center bg-gray-400 text-white text-xs font-bold rounded">
                PAY
            </div>
        );
    };

    if (authLoading) {
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-brand-blue-dark mb-2">Sign In Required</h2>
                        <p className="text-gray-500 mb-6">Please log in to view your payment history.</p>
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
                        onClick={() => dispatch(fetchPayments())}
                        className="inline-block bg-brand-primary text-white px-8 py-3 rounded-md hover:bg-brand-blue-light transition-colors duration-300 shadow-sm"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-24 min-h-[calc(100vh-200px)]">
            <h1 className="text-2xl font-bold mb-8">Payment History</h1>

            {isLoading ? (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Payment Method
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {[1, 2, 3, 4].map((i) => (
                                    <TableRowSkeleton key={i} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : payments.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10 max-w-lg mx-auto text-center">
                    <div className="mb-6">
                        <div className="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-brand-blue-dark mb-2">No Payment History</h2>
                        <p className="text-gray-500 mb-6">You haven't made any payments yet.</p>
                        <div className="w-24 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto mb-6"></div>
                    </div>
                    <Link
                        href="/products"
                        className="inline-block bg-brand-primary text-white px-8 py-3 rounded-md hover:bg-brand-blue-light transition-colors duration-300 shadow-sm"
                    >
                        Shop Now
                    </Link>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Payment Method
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payments.map((payment: Payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getPaymentIcon(payment.method, payment.cardType)}
                                                <div className="ml-3">
                                                    <p className="text-sm text-gray-900">{payment.method === 'credit_card' ? `${payment.cardType} card` : payment.method}</p>
                                                    {payment.cardLast4 && (
                                                        <p className="text-xs text-gray-500">**** {payment.cardLast4}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">₹{payment.amount.toLocaleString('en-IN')}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(payment.date)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(payment.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <Link href={`/orders/${payment.orderId}`} className="text-brand-primary hover:underline">
                                                {payment.orderId}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link href={`/payments/${payment.id}`} className="text-brand-primary hover:underline">
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
} 