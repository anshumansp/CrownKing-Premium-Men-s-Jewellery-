'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Product } from '@/types';
import { addItem } from '@/redux/slices/cartSlice';

interface AddToCartButtonProps {
    product: Product;
    className?: string;
    mini?: boolean;
    iconSize?: number;
    showText?: boolean;
}

export default function AddToCartButton({
    product,
    className = '',
    mini = false,
    iconSize = 24,
    showText = true,
}: AddToCartButtonProps) {
    const dispatch = useDispatch();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        setIsAdding(true);
        dispatch(addItem(product));

        // Show success animation
        setTimeout(() => {
            setIsAdding(false);
        }, 500);
    };

    if (mini) {
        return (
            <button
                onClick={handleAddToCart}
                disabled={isAdding || !product.inStock}
                className={`rounded-full p-2 text-gray-700 hover:bg-gray-100 transition-colors ${isAdding ? 'bg-green-50 text-green-600' : ''} ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
                aria-label="Add to cart"
            >
                <ShoppingCartIcon style={{ width: iconSize, height: iconSize }} />
            </button>
        );
    }

    return (
        <button
            onClick={handleAddToCart}
            disabled={isAdding || !product.inStock}
            className={`flex items-center justify-center gap-2 py-2 px-4 bg-black text-white rounded transition-colors ${isAdding ? 'bg-green-600' : 'hover:bg-gray-800'} ${!product.inStock ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400' : ''} ${className}`}
        >
            <ShoppingCartIcon className="h-5 w-5" />
            {showText && (
                <span>{isAdding ? 'Added!' : !product.inStock ? 'Out of Stock' : 'Add to Cart'}</span>
            )}
        </button>
    );
} 