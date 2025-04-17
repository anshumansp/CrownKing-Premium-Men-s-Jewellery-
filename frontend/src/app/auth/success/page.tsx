'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const { setUser, setIsAuthenticated } = useAuth();

    useEffect(() => {
        const processAuth = async () => {
            if (token) {
                try {
                    // Process the OAuth callback and get user data
                    const userData = await authService.processOAuthCallback(token);

                    if (userData) {
                        // Update auth context with the user data
                        setUser(userData);
                        setIsAuthenticated(true);
                    }

                    // Redirect to home page
                    router.push('/');
                } catch (error) {
                    console.error('Error processing OAuth callback:', error);
                    router.push('/auth/login');
                }
            } else {
                // If no token, redirect to login
                router.push('/auth/login');
            }
        };

        processAuth();
    }, [token, router, setUser, setIsAuthenticated]);

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