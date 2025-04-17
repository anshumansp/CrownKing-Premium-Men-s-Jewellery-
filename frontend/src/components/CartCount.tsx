'use client';

import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { selectCartItemsCount } from '@/redux/slices/cartSlice';

export default function CartCount() {
    const count = useSelector(selectCartItemsCount);

    return (
        <Link href="/cart" className="p-2 hover:text-gray-600 relative" aria-label="Cart">
            <ShoppingCartIcon className="h-5 w-5" />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {count > 9 ? '9+' : count}
                </span>
            )}
        </Link>
    );
} 