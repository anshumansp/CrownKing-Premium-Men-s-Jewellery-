'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import WishlistButton from './WishlistButton';
import AddToCartButton from './AddToCartButton';
import { useState } from 'react';

// Define image mappings and fallbacks
const CATEGORY_IMAGE_MAP = {
    ring: '/jewe5.jpg',
    rings: '/jewe5.jpg',
    bracelet: '/jewe2.webp',
    bracelets: '/jewe2.webp',
    necklace: '/jewe1.webp',
    necklaces: '/jewe1.webp',
    pendant: '/jewe8.webp',
    pendants: '/jewe8.webp',
    watch: '/jewe12.webp',
    watches: '/jewe12.webp',
    accessory: '/jewe9.jpg',
    accessories: '/jewe9.jpg',
    earring: '/jewe6.avif',
    earrings: '/jewe6.avif',
    default: '/jewe1.webp' // Default fallback image
};

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [imageError, setImageError] = useState(false);

    const formatPrice = (price: number) => {
        return '₹' + price.toLocaleString('en-IN');
    };

    const calculateDiscountedPrice = (price: number, discount: number) => {
        if (discount <= 0) return price;
        const discountAmount = (price * discount) / 100;
        return Math.round(price - discountAmount);
    };

    // Handle image errors
    const handleImageError = () => {
        setImageError(true);
    };

    // Determine the appropriate image URL
    let imageUrl = CATEGORY_IMAGE_MAP.default; // Default fallback

    if (!imageError && product.images && product.images.length > 0) {
        if (product.images[0].includes('example.com')) {
            // Use category-based placeholder image if possible
            const category = product.category.toLowerCase();

            // Find a matching category image
            for (const [key, value] of Object.entries(CATEGORY_IMAGE_MAP)) {
                if (category.includes(key)) {
                    imageUrl = value;
                    break;
                }
            }
        } else {
            // Use the original image URL if it's not from example.com
            imageUrl = product.images[0];
        }
    }

    return (
        <div className="group">
            <div className="bg-white overflow-hidden mb-4">
                <Link href={`/products/${product.id}`} className="block relative aspect-square">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={handleImageError}
                        priority={true}
                    />
                    {product.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-medium px-2 py-1">
                            {product.discount}% OFF
                        </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                        <WishlistButton product={product} mini iconSize={20} />
                        <AddToCartButton product={product} mini iconSize={20} showText={false} />
                    </div>
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

                <div className="flex items-center justify-between">
                    <div>
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
        </div>
    );
} 