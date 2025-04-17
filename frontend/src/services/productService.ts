import { Product } from '@/types';
import { apiClient } from '@/lib/api';

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    totalProducts: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface ProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  subCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
}

export interface ProductCategoriesResponse {
  success: boolean;
  data: {
    name: string;
    subCategories: string[];
  }[];
}

export interface SearchProductsParams {
  query: string;
  page?: number;
  limit?: number;
}

/**
 * Get products with optional filtering
 */
export const getProducts = async (params?: ProductsParams): Promise<ProductsResponse> => {
  try {
    const response = await apiClient.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Get a single product by ID
 */
export const getProductById = async (id: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (limit = 8): Promise<{ success: boolean; data: Product[] }> => {
  try {
    const response = await apiClient.get('/products/featured', { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

/**
 * Search products by query string
 */
export const searchProducts = async (params: SearchProductsParams): Promise<ProductsResponse> => {
  try {
    const response = await apiClient.get('/products/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * Get product categories
 */
export const getProductCategories = async (): Promise<ProductCategoriesResponse> => {
  try {
    const response = await apiClient.get('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching product categories:', error);
    throw error;
  }
};

// Fallback products data in case of API failure
export const staticProducts: Product[] = [
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
  // More fallback products would be defined here
]; 