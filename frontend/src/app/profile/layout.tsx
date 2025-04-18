'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileLayoutProps {
    children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/4">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">My Account</h2>
                        <nav className="space-y-2">
                            <ProfileNavLink href="/profile">Account Dashboard</ProfileNavLink>
                            <ProfileNavLink href="/profile/details">Personal Information</ProfileNavLink>
                            <ProfileNavLink href="/profile/addresses">Addresses</ProfileNavLink>
                            <ProfileNavLink href="/profile/change-password">Change Password</ProfileNavLink>
                            <ProfileNavLink href="/orders">Order History</ProfileNavLink>
                            <ProfileNavLink href="/wishlist">Wishlist</ProfileNavLink>
                        </nav>
                    </div>
                </div>
                <div className="w-full md:w-3/4">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ProfileNavLinkProps {
    href: string;
    children: React.ReactNode;
}

function ProfileNavLink({ href, children }: ProfileNavLinkProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href}>
            <div className={`block py-2 px-4 rounded transition-colors ${isActive
                ? 'bg-gray-100 text-black font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}>
                {children}
            </div>
        </Link>
    );
} 