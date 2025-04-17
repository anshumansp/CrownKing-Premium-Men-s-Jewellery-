'use client'; // Mark as client component for form handling

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = authService.getGoogleAuthUrl();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto mt-20">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your CrownKing account</p>
      </div>
      
      <div className="w-full bg-white shadow-lg rounded-md p-8 border border-gray-100">
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="yourname@email.com"
              className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
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
          
          <div className="flex justify-end mb-6">
            <Link href="/auth/forgot-password" className="text-sm text-black hover:underline">
              Forgot password?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
        
        <div className="flex items-center justify-center my-6">
          <div className="border-t border-gray-300 flex-grow mr-3"></div>
          <span className="text-gray-500 text-sm">or continue with</span>
          <div className="border-t border-gray-300 flex-grow ml-3"></div>
        </div>
        
        <button
          className="w-full border border-gray-300 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
          onClick={handleGoogleLogin}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-black font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
