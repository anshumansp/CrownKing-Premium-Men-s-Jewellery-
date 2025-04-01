'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        try {
            // For demo purposes, let's just show a success message
            setSubmitted(true);
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
              throw new Error(data.message || 'Failed to send reset email');
            }
      
            setSubmitted(true);
            setMessage('Password reset instructions have been sent to your email');
            */
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send reset email');
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
            <div className="mb-10 text-center w-full max-w-[300px]">
                <Image
                    src="/CrownKing.svg"
                    width={300}
                    height={100}
                    alt="CrownKing Logo"
                    className="mx-auto"
                    priority
                />
            </div>

            <div className="w-full bg-white shadow-md p-8 border border-gray-100">
                {submitted ? (
                    <div className="text-center">
                        <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-md mb-6">
                            {message}
                        </div>
                        <Link href="/auth/login" className="text-blue-600 hover:underline">
                            Return to Login
                        </Link>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-6">Reset Your Password</h2>
                        <p className="text-gray-600 mb-8">
                            Enter your email address below, and we'll send you instructions to reset your password.
                        </p>

                        <h3 className="text-xl font-medium mb-4">Enter Email</h3>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Your Email"
                            className="w-full p-3 mb-6 border border-gray-300 focus:border-gray-800 focus:outline-none"
                        />

                        {error && (
                            <div className="mb-4 p-3 text-red-600 bg-red-50 border border-red-200 rounded">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors mb-8"
                        >
                            RESET PASSWORD
                        </button>

                        <div className="text-center">
                            <Link href="/auth/login" className="text-blue-600 hover:underline">
                                Back to Login
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
} 