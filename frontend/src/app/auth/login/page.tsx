'use client'; // Mark as client component for form handling

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // For demo purposes, let's just redirect
      router.push('/');

    // In a real application, you would use this:
      /*
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to home page
      router.push('/');
      */
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
        <h3 className="text-xl font-medium mb-4">Enter Email</h3>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter Your Email"
          className="w-full p-3 mb-8 border border-gray-300 focus:border-gray-800 focus:outline-none"
        />

        <h3 className="text-xl font-medium mb-4">Enter Password</h3>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="****"
          className="w-full p-3 mb-2 border border-gray-300 focus:border-gray-800 focus:outline-none"
        />

        <div className="flex justify-end mb-8">
          <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
            Forget Password
          </Link>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors mb-4"
        >
          LOGIN NOW
        </button>

        <div className="flex items-center justify-center my-6">
          <div className="border-t border-gray-300 flex-grow mr-3"></div>
          <span className="text-gray-500">or</span>
          <div className="border-t border-gray-300 flex-grow ml-3"></div>
        </div>

        <button className="w-full border border-gray-300 py-3 font-medium hover:bg-gray-50 transition-colors mb-8">
          Continue With Google
        </button>

        <div className="text-center">
          <p className="text-gray-600 mb-2">Don't Have An Account?</p>
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
