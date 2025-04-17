'use client';

import { useState } from 'react';
import { profileService } from '@/services/profileService';

export default function ChangePassword() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        // Validation
        if (formData.newPassword !== formData.confirmPassword) {
            setIsError(true);
            setMessage('New passwords do not match');
            return;
        }

        if (formData.newPassword.length < 8) {
            setIsError(true);
            setMessage('Password must be at least 8 characters long');
            return;
        }

        setIsSubmitting(true);
        try {
            await profileService.changePassword(formData.currentPassword, formData.newPassword);
            setMessage('Your password has been updated successfully.');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setIsError(true);
            setMessage(err instanceof Error ? err.message : 'Failed to change password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Change Password</h1>

            {message && (
                <div className={`mb-6 p-4 border rounded-md ${isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                    </label>
                    <input
                        id="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                    </label>
                    <input
                        id="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                        required
                    />
                    <p className="mt-1 text-sm text-gray-500">Password must be at least 8 characters long.</p>
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                        required
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Changing Password...' : 'Change Password'}
                    </button>
                </div>
            </form>
        </div>
    );
} 