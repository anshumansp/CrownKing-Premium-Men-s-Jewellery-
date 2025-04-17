import { ProductClient } from './ProductClient';
import Link from 'next/link';
import { Product } from '@/types';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { getProductById } from '@/services/productService';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

// Static product data as fallback
const staticProducts: Product[] = [
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
    }
    // Other static products...
];

interface PageProps {
    params: {
        id: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ProductPage({ params }: PageProps) {
    // In Next.js 14+, params in a page component should be treated as an async value
    const { id } = params;
    let product: Product | undefined;

    try {
        // First check if it's one of our static products (id is numeric)
        if (/^\d+$/.test(id)) {
            product = staticProducts.find(p => p.id === id);
        }

        // If not found or not a numeric ID, try to fetch from API
        if (!product) {
            const response = await getProductById(id);
            if (response?.data) {
                product = response.data;
            }
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        // If error, try static data as a last resort
        product = staticProducts.find(p => p.id === id);
    }

    // If product not found in any source
    if (!product) {
        notFound();
    }

    // Find similar products from static data (we don't need to await here)
    const similarProducts = staticProducts
        .filter(p => p.id !== id && p.category === product.category)
        .slice(0, 4);

    return (
        <>
            <Suspense fallback={<div className="min-h-screen flex justify-center items-center"><LoadingSpinner size="large" /></div>}>
                <ProductClient product={product} />
                {/* Similar Products Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-8">Similar Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {similarProducts.map((similarProduct) => (
                            <ProductCard key={similarProduct.id} product={similarProduct} />
                        ))}
                    </div>
                    <div className="mt-10 text-center">
                        <Link
                            href="/products"
                            className="inline-block bg-brand-primary text-white px-8 py-3 font-medium hover:bg-brand-primary-dark transition-colors"
                        >
                            View All Products
                        </Link>
                    </div>
                </div>
            </Suspense>
        </>
    );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
    const id = params.id;
    let product: Product | undefined;

    try {
        // Check static products first
        if (/^\d+$/.test(id)) {
            product = staticProducts.find(p => p.id === id);
        }

        // If not found, try API
        if (!product) {
            const response = await getProductById(id);
            if (response?.data) {
                product = response.data;
            }
        }
    } catch (error) {
        console.error("Error fetching product for metadata:", error);
        product = staticProducts.find(p => p.id === id);
    }

    if (!product) {
        return {
            title: 'Product Not Found',
            description: 'The requested product could not be found.'
        };
    }

    return {
        title: product.name,
        description: product.description,
    };
}

