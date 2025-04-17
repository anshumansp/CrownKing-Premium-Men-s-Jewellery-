'use client';

import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useWishlist } from '@/contexts/WishlistContext';

export default function WishlistCount() {
    const { wishlist } = useWishlist();
    const count = wishlist.length;

    return (
        <Link href="/wishlist" className="p-2 hover:text-gray-600 relative" aria-label="Wishlist">
            <HeartIcon className="h-5 w-5" />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {count > 9 ? '9+' : count}
                </span>
            )}
        </Link>
    );
} 