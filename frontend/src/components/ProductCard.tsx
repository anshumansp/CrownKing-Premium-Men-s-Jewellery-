'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsWishlisted(!isWishlisted);
    };

    const formatPrice = (price: number) => {
        return '₹' + price.toLocaleString('en-IN');
    };

    const calculateDiscountedPrice = (price: number, discount: number) => {
        if (discount <= 0) return price;
        const discountAmount = (price * discount) / 100;
        return Math.round(price - discountAmount);
    };

    return (
        <div className="group">
            <div className="bg-white overflow-hidden mb-4">
                <Link href={`/products/${product.id}`} className="block relative aspect-square">
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-medium px-2 py-1">
                            {product.discount}% OFF
                        </div>
                    )}
                    <button
                        onClick={handleWishlist}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                    >
                        {isWishlisted ? (
                            <HeartIconSolid className="h-5 w-5 text-red-500" />
                        ) : (
                            <HeartIcon className="h-5 w-5 text-gray-600" />
                        )}
                    </button>
                </Link>
            </div>

            <div>
                <div className="mb-1">
                    <Link href={`/products/category/${product.category.toLowerCase()}`} className="text-xs text-gray-500 hover:text-brand-primary">
                        {product.category}
                    </Link>
                </div>

                <Link href={`/products/${product.id}`}>
                    <h3 className="text-base font-medium text-brand-blue-dark group-hover:text-brand-primary transition-colors mb-1">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center mb-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <span
                                key={i}
                                className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <span className="ml-2 text-xs text-gray-500">
                        ({product.reviews})
                    </span>
                </div>

                <div className="flex items-center">
                    <span className="text-base font-semibold text-brand-primary">
                        {formatPrice(product.discount > 0 ?
                            calculateDiscountedPrice(product.price, product.discount) :
                            product.price)}
                    </span>
                    {product.discount > 0 && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                            {formatPrice(product.price)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
} 