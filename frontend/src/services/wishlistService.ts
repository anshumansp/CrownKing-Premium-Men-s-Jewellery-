import { Product } from '@/types';
import { apiClient } from '@/lib/api';

export interface WishlistResponse {
  success: boolean;
  data: {
    items: WishlistItem[];
    totalItems: number;
  };
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItemResponse {
  success: boolean;
  message: string;
  data: WishlistItem;
}

export interface AddToWishlistParams {
  productId: string;
}

/**
 * Get user's wishlist
 */
export const getWishlist = async (): Promise<WishlistResponse> => {
  try {
    const response = await apiClient.get('/wishlist');
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

/**
 * Add product to wishlist
 */
export const addToWishlist = async (params: AddToWishlistParams): Promise<WishlistItemResponse> => {
  try {
    const response = await apiClient.post('/wishlist', params);
    return response.data;
  } catch (error) {
    console.error('Error adding product to wishlist:', error);
    throw error;
  }
};

/**
 * Remove product from wishlist
 */
export const removeFromWishlist = async (productId: string): Promise<{ success: boolean; message: string; data: { productId: string } }> => {
  try {
    const response = await apiClient.delete(`/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing product from wishlist:', error);
    throw error;
  }
};

/**
 * Clear wishlist
 */
export const clearWishlist = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete('/wishlist');
    return response.data;
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    throw error;
  }
}; 