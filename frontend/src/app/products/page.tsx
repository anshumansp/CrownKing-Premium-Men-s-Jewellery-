'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import TabSection from '@/components/TabSection';
import Image from 'next/image';
import { getProducts, staticProducts } from '@/services/productService';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'react-hot-toast';

// Define the product data with realistic images from public folder
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
];

// Define the tabs for the product categories
const tabs = [
  { id: 'all', label: 'ALL' },
  { id: 'new', label: 'NEW ARRIVALS' },
  { id: 'best', label: 'BEST SELLER' },
  { id: 'top', label: 'TOP RATED' }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get unique categories from products
  const categories = ['All', ...new Set(products.map(product => product.category))];

  // Fetch products on component mount
  useEffect(() => {
    const fetchProductsData = async () => {
      setLoading(true);
      try {
        const response = await getProducts();
        if (response && response.data && response.data.products) {
          setProducts(response.data.products);
          setFilteredProducts(response.data.products);
        } else {
          // Fallback to static data if API response is unexpected
          setProducts(staticProducts);
          setFilteredProducts(staticProducts);
          setError('Received unexpected data format from API');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to static data if API fails
        setProducts(staticProducts);
        setFilteredProducts(staticProducts);
        setError('Failed to fetch products from the server');
        toast.error('Failed to fetch products. Showing local data instead.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsData();
  }, []);

  // Filter products when category changes
  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.category === activeCategory);
      setFilteredProducts(filtered);
    }
  }, [activeCategory, products]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Error state with fallback data
  if (error && filteredProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8" role="alert">
          <p className="font-bold">Error loading products</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 mt-24 min-h-screen">
      {/* Display error toast if using fallback data but still show products */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-8" role="alert">
          <p className="font-bold">Note:</p>
          <p>Using local data instead of server data. Some features might be limited.</p>
        </div>
      )}

      <h1 className="text-3xl font-bold text-brand-blue-dark mb-8">Discover Our Collection</h1>

      <div className="mb-8">
        <TabSection
          tabs={categories}
          activeTab={activeCategory}
          onTabChange={handleCategoryChange}
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <Image
            src="/empty-state.svg"
            alt="No products found"
            width={200}
            height={200}
            className="mb-4 opacity-75"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No products found</h2>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            We couldn't find any products in this category. Please try another category or check back later.
          </p>
          <button
            onClick={() => setActiveCategory('All')}
            className="bg-brand-primary text-white px-4 py-2 rounded hover:bg-brand-primary-dark transition-colors"
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  );
}
