'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, ShoppingCartIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import WishlistButton from '@/components/WishlistButton';

interface ProductClientProps {
    product: Product;
}

export function ProductClient({ product }: ProductClientProps) {
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    const formatPrice = (price: number) => {
        return '₹' + price.toLocaleString('en-IN');
    };

    const calculateDiscountedPrice = (price: number, discount: number) => {
        if (discount <= 0) return price;
        const discountAmount = (price * discount) / 100;
        return Math.round(price - discountAmount);
    };

    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    return (
        <div className="container mx-auto px-4 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                {/* Product Image */}
                <div className="relative aspect-square md:h-auto bg-white">
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                    {product.discount > 0 && (
                        <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-medium px-2 py-1">
                            {product.discount}% OFF
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div>
                    <div className="mb-2">
                        <span className="text-sm text-gray-500">{product.category}</span>
                    </div>

                    <h1 className="text-3xl font-bold text-brand-primary mb-4">{product.name}</h1>

                    <div className="flex items-center mb-6">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    className={`text-lg ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">({product.reviews} reviews)</span>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-brand-primary">
                                {formatPrice(product.discount > 0 ?
                                    calculateDiscountedPrice(product.price, product.discount) :
                                    product.price)}
                            </span>
                            {product.discount > 0 && (
                                <span className="ml-3 text-lg text-gray-500 line-through">
                                    {formatPrice(product.price)}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Price Inclusive Of All Taxes</p>
                    </div>

                    <p className="text-gray-700 mb-6">{product.description}</p>

                    {/* Choose Size (if applicable) */}
                    <div className="mb-6">
                        <h3 className="mb-2">Choose Size</h3>
                        <div className="flex space-x-3">
                            <button className="bg-brand-primary text-white px-4 py-2 rounded-none font-medium">Small</button>
                            <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-none font-medium">Medium</button>
                            <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-none font-medium">Large</button>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center mb-8">
                        <div className="border border-gray-300 inline-flex items-center mr-4">
                            <button
                                onClick={decreaseQuantity}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 text-lg"
                            >
                                -
                            </button>
                            <span className="px-4 py-2 border-x border-gray-300 min-w-[50px] text-center">{quantity}</span>
                            <button
                                onClick={increaseQuantity}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 text-lg"
                            >
                                +
                            </button>
                        </div>
                        <div>
                            <WishlistButton
                                product={product}
                                iconSize={24}
                            />
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <div className="mb-8">
                        <button className="w-full bg-brand-primary text-white py-3 px-6 hover:bg-brand-blue-light transition-colors flex items-center justify-center">
                            <ShoppingCartIcon className="h-5 w-5 mr-2" />
                            Add To Cart
                        </button>
                    </div>

                    {/* Shipping Info */}
                    <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                            <TruckIcon className="h-5 w-5 mr-2 text-brand-primary" />
                            <span>Free shipping on orders over ₹10,000</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <ShieldCheckIcon className="h-5 w-5 mr-2 text-brand-primary" />
                            <span>Secure payment & money-back guarantee</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Tabs: Description, Features, Reviews, Return Policy */}
            <div className="mb-12">
                <div className="flex border-b overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('description')}
                        className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'description' ? 'border-b-2 border-black bg-black text-white' : 'text-gray-600'}`}
                    >
                        Description & Instructions
                    </button>
                    <button
                        onClick={() => setActiveTab('features')}
                        className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'features' ? 'border-b-2 border-black bg-black text-white' : 'text-gray-600'}`}
                    >
                        Features
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'reviews' ? 'border-b-2 border-black bg-black text-white' : 'text-gray-600'}`}
                    >
                        Reviews
                    </button>
                    <button
                        onClick={() => setActiveTab('return')}
                        className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'return' ? 'border-b-2 border-black bg-black text-white' : 'text-gray-600'}`}
                    >
                        Return Policy
                    </button>
                </div>

                <div className="py-8">
                    {activeTab === 'description' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Description</h2>
                            <p className="mb-6">
                                In each drop, sense the rushing water, the wind's whisper, and the earth's pulse. Bold yet serene, energetic yet soothing, this {product.name} is the ideal contrast. This product, which is designed for people who value both adventure and calm, awakens the explorer in you while reassuring you of your peace.
                            </p>
                            <p className="mb-6">
                                With a rush of freshness and liveliness, the journey starts with a warm cardamom and a sharp lemon zest. cold watery accords dance with cold mint and lavender before finally settling on an earthy Haitian vetiver base.
                            </p>

                            <h3 className="text-xl font-bold mt-8 mb-4">Ingredients</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Top notes: Lemon Zest, Cardamom</li>
                                <li>Middle notes: Watery Accords, Mint, Lavender</li>
                                <li>Base notes: Earthy Haitian Vetiver</li>
                            </ul>

                            <h3 className="text-xl font-bold mt-8 mb-4">Instruction</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                <div className="text-center">
                                    <div className="rounded-full bg-gray-100 h-16 w-16 flex items-center justify-center mx-auto mb-3">
                                        <span className="font-bold text-xl">1</span>
                                    </div>
                                    <p>Store in cool dark place</p>
                                </div>
                                <div className="text-center">
                                    <div className="rounded-full bg-gray-100 h-16 w-16 flex items-center justify-center mx-auto mb-3">
                                        <span className="font-bold text-xl">2</span>
                                    </div>
                                    <p>Keep away from children</p>
                                </div>
                                <div className="text-center">
                                    <div className="rounded-full bg-gray-100 h-16 w-16 flex items-center justify-center mx-auto mb-3">
                                        <span className="font-bold text-xl">3</span>
                                    </div>
                                    <p>Avoid direct contact with eyes</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'features' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Features</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Premium quality {product.specifications.material}</li>
                                <li>Handcrafted with precision</li>
                                <li>Weight: {product.specifications.weight}</li>
                                <li>Dimensions: {product.specifications.dimensions}</li>
                                <li>{product.specifications.warranty} manufacturer warranty</li>
                                <li>Exquisite finish and attention to detail</li>
                                <li>Elegant packaging suitable for gifting</li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
                            <div className="flex items-center mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`text-lg ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="ml-2 text-gray-600">{product.rating} out of 5</span>
                            </div>
                            <p>Based on {product.reviews} reviews</p>

                            <div className="border-t mt-6 pt-6">
                                <div className="mb-6">
                                    <div className="flex items-center mb-2">
                                        <p className="font-semibold">Rahul S.</p>
                                        <span className="mx-2">•</span>
                                        <div className="flex">
                                            <span className="text-yellow-400">★★★★★</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">Verified Purchase</p>
                                    <p>Excellent quality and craftsmanship. Very satisfied with my purchase.</p>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-center mb-2">
                                        <p className="font-semibold">Amit K.</p>
                                        <span className="mx-2">•</span>
                                        <div className="flex">
                                            <span className="text-yellow-400">★★★★</span><span className="text-gray-300">★</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">Verified Purchase</p>
                                    <p>Great product, but shipping took longer than expected.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'return' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Return Policy</h2>
                            <p className="mb-4">We want you to be completely satisfied with your purchase. If for any reason you are not, you may return it within 30 days of delivery for a full refund or exchange.</p>

                            <h3 className="text-lg font-semibold mt-6 mb-2">Conditions for Return:</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Item must be in original, unworn condition</li>
                                <li>Original packaging must be intact</li>
                                <li>Proof of purchase is required</li>
                                <li>Return shipping costs are the responsibility of the customer unless the item was defective</li>
                            </ul>

                            <p className="mt-6">For customized items, special return conditions may apply. Please contact our customer service team for assistance.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Similar Products Section */}
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Similar Products</h2>
                    <Link href="/products" className="inline-block bg-brand-primary text-white px-6 py-2 font-medium hover:bg-brand-primary-dark transition-colors">
                        View All Products
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Similar products will be fetched from the server */}
                </div>
            </div>
        </div>
    );
} 