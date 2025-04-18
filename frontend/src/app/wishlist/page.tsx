'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';
import AddToCartButton from '@/components/AddToCartButton';
import { AppDispatch } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectWishlistItems,
    selectWishlistLoading,
    selectWishlistError,
    fetchWishlist,
    removeFromWishlist,
    Item
} from '@/redux/slices/wishlistSlice';
import { useEffect } from 'react';
import { isAuthenticated } from '@/utils/auth';

export default function Wishlist() {
    const { isLoading: authLoading } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const items = useSelector(selectWishlistItems);
    const isLoading = useSelector(selectWishlistLoading);
    const error = useSelector(selectWishlistError);
    // Always consider authenticated for wishlist operations
    const userAuthenticated = isAuthenticated('wishlist');

    useEffect(() => {
        // Always fetch wishlist since we're allowing guest access
        dispatch(fetchWishlist());
    }, [dispatch]);

    const formatPrice = (price: number) => {
        return '₹' + price.toLocaleString('en-IN');
    };

    const calculateDiscountedPrice = (price: number, discount: number) => {
        if (discount <= 0) return price;
        const discountAmount = (price * discount) / 100;
        return Math.round(price - discountAmount);
    };

    // Handle remove from wishlist
    const handleRemoveFromWishlist = (productId: string) => {
        dispatch(removeFromWishlist(productId));
    };

    if (authLoading || isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 mt-24 min-h-[calc(100vh-200px)]">
                {/* Empty loading state - NProgress will show at the top */}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 mt-24 min-h-[calc(100vh-100px)] flex items-center justify-center">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10 max-w-lg mx-auto text-center">
                    <div className="mb-6">
                        <div className="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-brand-blue-dark mb-2">Your Wishlist is Empty</h2>
                        <p className="text-gray-500 mb-6">Discover and save your favorite items for later.</p>
                        <div className="w-24 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto mb-6"></div>
                    </div>
                    <Link
                        href="/products"
                        className="inline-block bg-brand-primary text-white px-8 py-3 rounded-md hover:bg-brand-blue-light transition-colors duration-300 shadow-sm"
                    >
                        Discover Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-24 min-h-[calc(100vh-200px)]">
            <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item: Item) => (
                    <div key={item.id} className="group">
                        <div className="bg-white overflow-hidden mb-4">
                            <Link href={`/products/${item.id}`} className="block relative aspect-square">
                                <Image
                                    src={item.images[0]}
                                    alt={item.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {item.discount > 0 && (
                                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-medium px-2 py-1">
                                        {item.discount}% OFF
                                    </div>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleRemoveFromWishlist(item.id);
                                    }}
                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5 text-red-500">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                </button>
                            </Link>
                        </div>

                        <div>
                            <div className="mb-1">
                                <Link href={`/products/category/${item.category.toLowerCase()}`} className="text-xs text-gray-500 hover:text-brand-primary">
                                    {item.category}
                                </Link>
                            </div>

                            <Link href={`/products/${item.id}`}>
                                <h3 className="text-base font-medium text-brand-blue-dark group-hover:text-brand-primary transition-colors mb-1">
                                    {item.name}
                                </h3>
                            </Link>

                            <div className="flex items-center mb-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`text-sm ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="ml-2 text-xs text-gray-500">
                                    ({item.reviews})
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-base font-semibold text-brand-primary">
                                        {formatPrice(item.discount > 0 ?
                                            calculateDiscountedPrice(item.price, item.discount) :
                                            item.price)}
                                    </span>
                                    {item.discount > 0 && (
                                        <span className="ml-2 text-sm text-gray-500 line-through">
                                            {formatPrice(item.price)}
                                        </span>
                                    )}
                                </div>
                                <AddToCartButton
                                    product={item}
                                    mini
                                    showText={false}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 