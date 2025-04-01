'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { StarIcon, ShoppingCartIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Product } from '@/types';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

// Product data with fixed INR prices
const products: Product[] = [
    {
        id: '1',
        name: 'Luxury Gold Chain Necklace',
        description: 'Premium handcrafted 24K gold chain necklace for men, perfect for special occasions',
        price: 82917,
        images: ['/jewe1.webp'],
        category: 'Necklaces',
        subCategory: 'Gold',
        specifications: {
            material: '24K Gold',
            weight: '45g',
            dimensions: '20 inches',
            warranty: '2 years',
        },
        rating: 4.8,
        reviews: 124,
        inStock: true,
        featured: true,
        discount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Classic Silver Bracelet',
        description: 'Elegant pure silver bracelet with contemporary design for the modern man',
        price: 38171,
        images: ['/jewe2.webp'],
        category: 'Bracelets',
        subCategory: 'Silver',
        specifications: {
            material: 'Pure Silver',
            weight: '25g',
            dimensions: '8 inches',
            warranty: '1 year',
        },
        rating: 4.7,
        reviews: 98,
        inStock: true,
        featured: true,
        discount: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'Diamond-Studded Ring',
        description: 'Premium gold ring with authentic diamond studs for an elegant statement',
        price: 107891,
        images: ['/jewe3.jpeg'],
        category: 'Rings',
        subCategory: 'Diamond',
        specifications: {
            material: '18K Gold with Diamonds',
            weight: '12g',
            dimensions: 'Size 10',
            warranty: '5 years',
        },
        rating: 4.9,
        reviews: 76,
        inStock: true,
        featured: true,
        discount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '4',
        name: 'Royal Platinum Cufflinks',
        description: 'Sophisticated platinum cufflinks with minimalist design for formal occasions',
        price: 66391,
        images: ['/jewe4.jpg'],
        category: 'Accessories',
        subCategory: 'Cufflinks',
        specifications: {
            material: 'Platinum',
            weight: '15g',
            dimensions: '1.5 cm diameter',
            warranty: '3 years',
        },
        rating: 4.6,
        reviews: 45,
        inStock: true,
        featured: true,
        discount: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '5',
        name: 'Designer Gold Ring',
        description: 'Artisan crafted designer gold ring with unique patterns',
        price: 64999,
        images: ['/jewe5.jpg'],
        category: 'Rings',
        subCategory: 'Gold',
        specifications: {
            material: '22K Gold',
            weight: '8g',
            dimensions: 'Size 9',
            warranty: '2 years',
        },
        rating: 4.5,
        reviews: 87,
        inStock: true,
        featured: true,
        discount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '6',
        name: 'Premium Silver Earrings',
        description: 'Sophisticated silver earrings for men with minimalist design',
        price: 29990,
        images: ['/jewe6.avif'],
        category: 'Earrings',
        subCategory: 'Silver',
        specifications: {
            material: 'Pure Silver',
            weight: '5g',
            dimensions: '1.2 cm',
            warranty: '1 year',
        },
        rating: 4.3,
        reviews: 58,
        inStock: true,
        featured: true,
        discount: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '7',
        name: 'Royal Gold Bracelet',
        description: 'Luxurious gold bracelet with intricate design and premium finish',
        price: 95990,
        images: ['/jewe7.webp'],
        category: 'Bracelets',
        subCategory: 'Gold',
        specifications: {
            material: '24K Gold',
            weight: '35g',
            dimensions: '7.5 inches',
            warranty: '5 years',
        },
        rating: 4.9,
        reviews: 112,
        inStock: true,
        featured: true,
        discount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '8',
        name: 'Diamond Pendant Chain',
        description: 'Stylish pendant chain with authentic diamond centerpiece',
        price: 74999,
        images: ['/jewe8.webp'],
        category: 'Necklaces',
        subCategory: 'Diamond',
        specifications: {
            material: '18K Gold with Diamond',
            weight: '20g',
            dimensions: '22 inches',
            warranty: '3 years',
        },
        rating: 4.7,
        reviews: 68,
        inStock: true,
        featured: true,
        discount: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '9',
        name: 'Classic Tie Pin',
        description: 'Elegant gold tie pin with subtle design patterns for formal wear',
        price: 15990,
        images: ['/jewe9.jpg'],
        category: 'Accessories',
        subCategory: 'Tie Pins',
        specifications: {
            material: '18K Gold',
            weight: '6g',
            dimensions: '5.5 cm',
            warranty: '1 year',
        },
        rating: 4.4,
        reviews: 42,
        inStock: true,
        featured: true,
        discount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '10',
        name: 'Luxury Tungsten Ring',
        description: 'Modern tungsten carbide ring with sleek black finish for the contemporary man',
        price: 42599,
        images: ['/jewe10.jpg'],
        category: 'Rings',
        subCategory: 'Tungsten',
        specifications: {
            material: 'Tungsten Carbide',
            weight: '18g',
            dimensions: 'Size 11',
            warranty: '2 years',
        },
        rating: 4.6,
        reviews: 59,
        inStock: true,
        featured: true,
        discount: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '11',
        name: 'Elegant Leather Bracelet',
        description: 'Sophisticated braided leather bracelet with stainless steel magnetic clasp',
        price: 18499,
        images: ['/jewe11.webp'],
        category: 'Bracelets',
        subCategory: 'Leather',
        specifications: {
            material: 'Premium Leather and Stainless Steel',
            weight: '12g',
            dimensions: '8.5 inches',
            warranty: '1 year',
        },
        rating: 4.5,
        reviews: 73,
        inStock: true,
        featured: true,
        discount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '12',
        name: 'Diamond-Accented Watch',
        description: 'Luxury chronograph watch with diamond accents and premium leather strap',
        price: 154999,
        images: ['/jewe12.webp'],
        category: 'Watches',
        subCategory: 'Luxury',
        specifications: {
            material: 'Stainless Steel with Diamond Accents',
            weight: '85g',
            dimensions: '42mm case',
            warranty: '5 years',
        },
        rating: 4.9,
        reviews: 94,
        inStock: true,
        featured: true,
        discount: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '13',
        name: 'Titanium Money Clip',
        description: 'Minimalist titanium money clip with brushed finish and ergonomic design',
        price: 12599,
        images: ['/jewe10.jpg'], // Reusing image for demo purposes
        category: 'Accessories',
        subCategory: 'Money Clips',
        specifications: {
            material: 'Titanium',
            weight: '15g',
            dimensions: '6.5 cm x 2.2 cm',
            warranty: '2 years',
        },
        rating: 4.4,
        reviews: 48,
        inStock: true,
        featured: true,
        discount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

export default function ProductPage({ params }: { params: { id: string } }) {
    const product = products.find(p => p.id === params.id);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    if (!product) {
        return notFound();
    }

    // Find similar products based on category or subcategory
    const similarProducts = products
        .filter(p =>
            p.id !== product.id
        );

    const formatPrice = (price: number) => {
        return '₹' + price.toLocaleString('en-IN');
    };

    const calculateDiscountedPrice = (price: number, discount: number) => {
        if (discount <= 0) return price;
        const discountAmount = (price * discount) / 100;
        return Math.round(price - discountAmount);
    };

    const handleWishlist = () => {
        setIsWishlisted(!isWishlisted);
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
                            <button
                                onClick={handleWishlist}
                                className="p-3 border border-gray-300 hover:border-brand-primary transition-colors"
                            >
                                {isWishlisted ? (
                                    <HeartIconSolid className="h-6 w-6 text-red-500" />
                                ) : (
                                    <HeartIcon className="h-6 w-6 text-gray-600" />
                                )}
                            </button>
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
                <h2 className="text-2xl font-bold mb-8">Similar Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {similarProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <div className="mt-10 text-center">
                    <Link href="/products" className="inline-block bg-brand-primary text-white px-8 py-3 font-medium hover:bg-brand-primary-dark transition-colors">
                        View All Products
                    </Link>
                </div>
            </div>
        </div>
    );
} 