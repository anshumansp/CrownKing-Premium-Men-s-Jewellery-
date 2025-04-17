'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/types';

export default function Wishlist() {
    const { isLoading: authLoading, isAuthenticated } = useAuth();
    const { wishlist, isLoading: wishlistLoading, removeFromWishlist } = useWishlist();

    const handleAddToCart = (product: Product) => {
        // In a real implementation, this would add the item to the cart
        console.log('Added to cart:', product);
    };

    if (authLoading || wishlistLoading) {
        return (
            <div className="container mx-auto px-4 py-8 mt-24">
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-24">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

                {wishlist.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 mb-6">Your wishlist is empty.</p>
                        <Link
                            href="/products"
                            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {wishlist.map(product => (
                            <div key={product.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row items-center">
                                <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0 mb-4 md:mb-0 md:mr-6 relative">
                                    {product.images && product.images[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <span className="text-gray-400 text-xs">No image</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-grow text-center md:text-left">
                                    <h3 className="font-medium text-lg">{product.name}</h3>
                                    <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {product.inStock ?
                                            <span className="text-green-600">In Stock</span> :
                                            <span className="text-red-600">Out of Stock</span>}
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={!product.inStock}
                                            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-300"
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={() => removeFromWishlist(product.id)}
                                            className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 md:mt-0 md:ml-4">
                                    <Link
                                        href={`/products/${product.id}`}
                                        className="text-sm text-black hover:underline"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 