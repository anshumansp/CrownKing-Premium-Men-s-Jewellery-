'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';

export default function AuthSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            // Process the OAuth callback
            authService.processOAuthCallback(token);

            // Redirect to home page
            router.push('/');
        } else {
            // If no token, redirect to login
            router.push('/auth/login');
        }
    }, [token, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-md p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Authentication Successful</h2>
                <p className="text-gray-600 mb-8">You're being redirected...</p>
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mx-auto"></div>
            </div>
        </div>
    );
} 