'use client';

import { useState } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/types';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';

interface WishlistButtonProps {
    product: Product;
    className?: string;
    iconSize?: number;
    showText?: boolean;
    mini?: boolean;
}

export default function WishlistButton({
    product,
    className = '',
    iconSize = 24,
    showText = false,
    mini = false,
}: WishlistButtonProps) {
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { startLoading } = useLoading();
    const [isProcessing, setIsProcessing] = useState(false);

    const isProductInWishlist = isInWishlist(product.id);

    const handleToggleWishlist = async () => {
        if (isProcessing) return;

        setIsProcessing(true);

        try {
            if (!isAuthenticated) {
                startLoading(); // Start loading before navigation
                router.push('/auth/login');
                return;
            }

            if (isProductInWishlist) {
                removeFromWishlist(product.id);
            } else {
                addToWishlist(product);
            }
        } catch (error) {
            console.error('Failed to toggle wishlist item:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (mini) {
        return (
            <button
                onClick={handleToggleWishlist}
                disabled={isProcessing}
                className={`rounded-full p-2 bg-white ${isProductInWishlist ? 'text-red-500' : 'text-gray-500'} 
                hover:bg-red-500 hover:text-white transition-colors shadow-sm ${className}`}
                aria-label={isProductInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                {isProductInWishlist ? (
                    <HeartIcon className="h-5 w-5" style={{ width: iconSize, height: iconSize }} />
                ) : (
                    <HeartIconOutline className="h-5 w-5" style={{ width: iconSize, height: iconSize }} />
                )}
            </button>
        );
    }

    return (
        <button
            onClick={handleToggleWishlist}
            disabled={isProcessing}
            className={`flex items-center gap-2 py-2 px-4 border ${isProductInWishlist
                ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                } rounded transition-colors ${className}`}
            aria-label={isProductInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            {isProductInWishlist ? (
                <HeartIcon className="h-5 w-5 flex-shrink-0" style={{ width: iconSize, height: iconSize }} />
            ) : (
                <HeartIconOutline className="h-5 w-5 flex-shrink-0" style={{ width: iconSize, height: iconSize }} />
            )}
            {showText && (
                <span>{isProductInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
            )}
        </button>
    );
} 