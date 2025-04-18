'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import TabSection from '@/components/TabSection';
import Image from 'next/image';
import { getProducts, staticProducts } from '@/services/productService';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'react-hot-toast';

// Define the tabs for the product categories
const tabs = [
  { id: 'all', label: 'ALL' },
  { id: 'new', label: 'NEW ARRIVALS' },
  { id: 'best', label: 'BEST SELLER' },
  { id: 'top', label: 'TOP RATED' }
];

export default function ProductsPage() {
  // Initialize with staticProducts to avoid empty state
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(staticProducts);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriesLoaded, setCategoriesLoaded] = useState<boolean>(false);

  // Get unique categories from products once they're loaded
  const categoryList = React.useMemo(() => {
    const uniqueCategories = ['All', ...new Set(products.map(product => product.category))];
    return uniqueCategories;
  }, [products]);

  // Convert categories to the format expected by TabSection
  const categoryTabs = React.useMemo(() => {
    return categoryList.map(category => ({
      id: category,
      label: category
    }));
  }, [categoryList]);

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
          // Fallback already happened in state initialization
          setError('Received unexpected data format from API');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback already happened in state initialization
        setError('Failed to fetch products from the server');
        toast.error('Failed to fetch products. Showing local data instead.');
      } finally {
        setLoading(false);
        setCategoriesLoaded(true);
      }
    };

    fetchProductsData();
  }, []);

  // Filter products when category changes
  useEffect(() => {
    if (!categoriesLoaded) return; // Skip if categories aren't loaded yet

    if (activeCategory === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.category === activeCategory);
      setFilteredProducts(filtered);
    }
  }, [activeCategory, products, categoriesLoaded]);

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
      <div className="container mx-auto px-4  min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8" role="alert">
          <p className="font-bold">Error loading products</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4  mt-2 min-h-screen">
      {/* Display error toast if using fallback data but still show products */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-8" role="alert">
          <p className="font-bold">Note:</p>
          <p>Using local data instead of server data. Some features might be limited.</p>
        </div>
      )}

      <div className="mb-8">
        <TabSection
          tabs={categoryTabs}
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
        <div className="flex flex-col items-center justify-center">
            <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <span className="text-gray-400 text-4xl">🔍</span>
            </div>
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
