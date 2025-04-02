'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import TabSection from './TabSection';
import Link from 'next/link';
import { Product } from '@/types';

// Product data with jewelry images
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

const tabs = [
    { id: 'all', label: 'ALL' },
    { id: 'new', label: 'NEW ARRIVALS' },
    { id: 'best', label: 'BEST SELLER' },
    { id: 'top', label: 'TOP RATED' }
];

export default function ProductSection() {
    const [activeTab, setActiveTab] = useState('all');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

    useEffect(() => {
        // Filter products based on active tab
        if (activeTab === 'all') {
            setFilteredProducts(products.slice(0, 8));
        } else if (activeTab === 'new') {
            // Sort by creation date for new arrivals
            const sorted = [...products].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ).slice(0, 8);
            setFilteredProducts(sorted);
        } else if (activeTab === 'best') {
            // Simulate best sellers by number of reviews
            const sorted = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 8);
            setFilteredProducts(sorted);
        } else if (activeTab === 'top') {
            // Sort by rating for top rated
            const sorted = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
            setFilteredProducts(sorted);
        }
    }, [activeTab]);

    return (
        <section className="py-16">
            <div className="container-custom">
                {/* Logo and Branding Section */}
                <div className="flex justify-center mb-12">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-2">CrownKing</h2>
                        <p className="text-gray-500">Premium Men's Jewelry Collection</p>
                    </div>
                </div>

                {/* Product Tabs */}
                <TabSection tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center border border-brand-primary text-brand-primary px-6 py-2 rounded-none hover:bg-brand-primary hover:text-white transition-colors duration-200"
                    >
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    );
} 