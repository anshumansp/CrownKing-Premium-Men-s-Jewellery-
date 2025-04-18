import { ProductClient } from './ProductClient';
import Link from 'next/link';
import { Product } from '@/types';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { getProductById, getFeaturedProducts } from '@/services/productService';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

// Definition for minimum fallback product data
const fallbackProduct: Product = {
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
};

interface PageProps {
    params: {
        id: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ProductPage({ params }: PageProps) {
    // Fix for Next.js 14+ by properly awaiting params
    const { id } = await Promise.resolve(params);
    let product: Product | null = null;
    let similarProducts: Product[] = [];

    try {
        // Attempt to fetch the product from the API
        const response = await getProductById(id);

        if (response?.success && response?.data) {
            product = response.data;

            // Fetch similar products based on category
            try {
                const featuredResponse = await getFeaturedProducts(8);
                if (featuredResponse?.success && featuredResponse?.data) {
                    // Filter by the same category, excluding the current product
                    similarProducts = featuredResponse.data
                        .filter(p => p.id !== id && p.category === product!.category)
                        .slice(0, 4);
                }
            } catch (error) {
                console.error("Error fetching similar products:", error);
                // Continue without similar products if there's an error
                similarProducts = [];
            }
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        // We'll handle the 404 case below
    }

    // If product not found, trigger 404 page
    if (!product) {
        notFound();
    }

    return (
        <>
            <Suspense fallback={<div className="min-h-screen flex justify-center items-center"><LoadingSpinner size="large" /></div>}>
                <ProductClient product={product} />

                {/* Similar Products Section */}
                {similarProducts.length > 0 && (
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
                )}
            </Suspense>
        </>
    );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
    // Fix for Next.js 14+ by properly awaiting params
    const id = (await Promise.resolve(params)).id;
    let product: Product | null = null;

    try {
        // Attempt to fetch the product from the API for metadata
        const response = await getProductById(id);

        if (response?.success && response?.data) {
            product = response.data;
        }
    } catch (error) {
        console.error("Error fetching product for metadata:", error);
        // Continue with null product for metadata fallback
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

