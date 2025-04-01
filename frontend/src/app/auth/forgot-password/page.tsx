'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            // For demo purposes, let's simulate a successful password reset
            setIsSubmitted(true);
            setMessage('Password reset instructions have been sent to your email');

            // In a real application, you would use this:
            /*
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset instructions');
            }

            setIsSubmitted(true);
            setMessage(data.message || 'Password reset instructions have been sent to your email');
            */
        } catch (err) {
            setIsError(true);
            setMessage(err instanceof Error ? err.message : 'Failed to send reset instructions');
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto mt-20">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold mb-2">Forgot Password</h2>
                <p className="text-gray-600">Enter your email to reset your password</p>
            </div>

            <div className="w-full bg-white shadow-lg rounded-md p-8 border border-gray-100">
                {message && (
                    <div className={`mb-6 p-3 ${isError ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'} border rounded-md`}>
                        {message}
                    </div>
                )}

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="yourname@email.com"
                                className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
                        >
                            RESET PASSWORD
                        </button>
                    </form>
                ) : (
                    <div className="text-center my-6">
                        <p className="text-gray-600 mb-6">
                            We've sent instructions to reset your password to your email. Please check your inbox and follow the instructions.
                        </p>
                        <button
                            onClick={() => router.push('/auth/login')}
                            className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
                        >
                            RETURN TO LOGIN
                        </button>
                    </div>
                )}

                <div className="text-center mt-8">
                    <p className="text-gray-600 text-sm">
                        Remember your password?{' '}
                        <Link href="/auth/login" className="text-black font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
} 