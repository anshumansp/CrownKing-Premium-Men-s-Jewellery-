'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/profileService';
import { UserProfile, Address } from '@/types';

export default function ProfileDashboard() {
    const { user, isLoading } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user) return;

            try {
                setIsProfileLoading(true);
                const profile = await profileService.getProfile();
                setUserProfile(profile);
            } catch (err) {
                setError('Failed to load profile data');
                console.error(err);
            } finally {
                setIsProfileLoading(false);
            }
        };

        if (!isLoading) {
            fetchUserProfile();
        }
    }, [user, isLoading]);

    if (isLoading || isProfileLoading) {
        return (
            <div className="min-h-[300px] flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
                {error}
            </div>
        );
    }

    if (!userProfile) {
        return null;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

            <div className="mb-8">
                <div className="flex items-center mb-4">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-gray-700 mr-4">
                        {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{userProfile.name}</h2>
                        <p className="text-gray-600">{userProfile.email}</p>
                    </div>
                </div>

                <Link
                    href="/profile/details"
                    className="text-black underline text-sm hover:opacity-80"
                >
                    Edit personal information
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <DashboardCard
                    title="Recent Orders"
                    content={
                        <div className="text-center py-4">
                            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                            <Link
                                href="/products"
                                className="bg-black text-white px-4 py-2 rounded inline-block hover:bg-gray-800"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    }
                    link={{ text: 'View All Orders', href: '/orders' }}
                />

                <DashboardCard
                    title="Saved Addresses"
                    content={
                        <div>
                            {userProfile.addresses && userProfile.addresses.length > 0 ? (
                                <div>
                                    {userProfile.addresses
                                        .filter(address => address.isDefault)
                                        .map(address => (
                                            <AddressCard key={address.id} address={address} />
                                        ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 py-4 text-center">
                                    You don't have any saved addresses yet.
                                </p>
                            )}
                        </div>
                    }
                    link={{ text: 'Manage Addresses', href: '/profile/addresses' }}
                />
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SettingsButton
                        text="Personal Information"
                        href="/profile/details"
                    />
                    <SettingsButton
                        text="Manage Addresses"
                        href="/profile/addresses"
                    />
                    <SettingsButton
                        text="Change Password"
                        href="/profile/change-password"
                    />
                    <SettingsButton
                        text="Order History"
                        href="/orders"
                    />
                </div>
            </div>
        </div>
    );
}

interface DashboardCardProps {
    title: string;
    content: React.ReactNode;
    link?: {
        text: string;
        href: string;
    };
}

function DashboardCard({ title, content, link }: DashboardCardProps) {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium">{title}</h3>
            </div>
            <div className="p-4">
                {content}
            </div>
            {link && (
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-right">
                    <Link href={link.href} className="text-black hover:underline text-sm font-medium">
                        {link.text} →
                    </Link>
                </div>
            )}
        </div>
    );
}

interface AddressCardProps {
    address: Address;
}

function AddressCard({ address }: AddressCardProps) {
    return (
        <div className="p-3 border border-gray-200 rounded-md">
            <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium">{address.type === 'shipping' ? 'Shipping' : 'Billing'} Address</span>
                {address.isDefault && (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Default</span>
                )}
            </div>
            <div className="text-sm text-gray-600">
                <p className="font-medium">{address.firstName} {address.lastName}</p>
                <p>{address.address}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
                <p>{address.phone}</p>
            </div>
        </div>
    );
}

interface SettingsButtonProps {
    text: string;
    href: string;
}

function SettingsButton({ text, href }: SettingsButtonProps) {
    return (
        <Link href={href}>
            <div className="border border-gray-300 rounded-md p-3 text-center hover:bg-gray-50 transition-colors">
                {text}
            </div>
        </Link>
    );
} 