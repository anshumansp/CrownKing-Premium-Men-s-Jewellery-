'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!token) {
        return (
            <div className="flex flex-col items-center w-full max-w-md mx-auto mt-20">
                <div className="w-full bg-white shadow-lg rounded-md p-8 border border-gray-100">
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                        Invalid or expired reset token. Please request a new password reset link.
                    </div>
                    <Link href="/auth/forgot-password">
                        <button className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors">
                            REQUEST NEW RESET LINK
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setIsError(true);
            setMessage('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await authService.resetPassword(token, formData.password);
            setIsSuccess(true);
            setMessage('Your password has been successfully reset. You may now login with your new password.');
        } catch (err) {
            setIsError(true);
            setMessage(err instanceof Error ? err.message : 'Password reset failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto mt-20">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
                <p className="text-gray-600">Enter your new password</p>
            </div>

            <div className="w-full bg-white shadow-lg rounded-md p-8 border border-gray-100">
                {message && (
                    <div className={`mb-6 p-3 ${isError ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'} border rounded-md`}>
                        {message}
                    </div>
                )}

                {!isSuccess ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="••••••••"
                                className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center my-6">
                        <p className="text-gray-600 mb-6">
                            Your password has been reset successfully!
                        </p>
                        <button
                            onClick={() => router.push('/auth/login')}
                            className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
                        >
                            RETURN TO LOGIN
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Main component with Suspense boundary
export default function ResetPassword() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center w-full max-w-md mx-auto mt-20">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
} 