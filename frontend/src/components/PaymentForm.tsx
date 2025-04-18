'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
    amount: number;
    orderId: string;
    onSuccess: () => void;
    onError: (error: string) => void;
}

export default function PaymentForm({ amount, orderId, onSuccess, onError }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        try {
            // Create payment intent
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-payment-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    amount,
                    paymentMethod
                })
            });

            const { clientSecret } = await response.json();

            // Confirm payment
            const { error: submitError } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/orders/confirmation?orderId=${orderId}`,
                },
            });

            if (submitError) {
                onError(submitError.message || 'Payment failed');
            } else {
                onSuccess();
            }
        } catch (error) {
            onError('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex space-x-4">
                <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`px-4 py-2 rounded ${paymentMethod === 'card'
                            ? 'bg-brand-teal text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                >
                    Card Payment
                </button>
                <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`px-4 py-2 rounded ${paymentMethod === 'upi'
                            ? 'bg-brand-teal text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                >
                    UPI Payment
                </button>
            </div>

            {paymentMethod === 'card' ? (
                <PaymentElement />
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            UPI ID
                        </label>
                        <input
                            type="text"
                            placeholder="username@upi"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-teal focus:ring-brand-teal"
                            required
                        />
                    </div>
                    <div className="text-sm text-gray-500">
                        Supported UPI apps: Google Pay, PhonePe, Paytm, BHIM
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || loading}
                className="btn-primary w-full"
            >
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
} 