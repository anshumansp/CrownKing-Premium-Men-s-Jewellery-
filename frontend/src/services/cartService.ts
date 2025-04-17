import { CartItem } from '@/types';
import { apiClient } from '@/lib/api';

export interface CartResponse {
  success: boolean;
  data: {
    items: CartItem[];
    totalItems: number;
    cartTotal: number;
  };
}

export interface CartItemResponse {
  success: boolean;
  message: string;
  data: CartItem;
}

export interface AddToCartParams {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemParams {
  quantity: number;
}

/**
 * Get user's cart
 */
export const getCart = async (): Promise<CartResponse> => {
  try {
    const response = await apiClient.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

/**
 * Add item to cart
 */
export const addToCart = async (params: AddToCartParams): Promise<CartItemResponse> => {
  try {
    const response = await apiClient.post('/cart', params);
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (itemId: string, params: UpdateCartItemParams): Promise<CartItemResponse> => {
  try {
    const response = await apiClient.put(`/cart/${itemId}`, params);
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

/**
 * Remove item from cart
 */
export const removeCartItem = async (itemId: string): Promise<{ success: boolean; message: string; data: { id: string } }> => {
  try {
    const response = await apiClient.delete(`/cart/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};

/**
 * Clear cart
 */
export const clearCart = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete('/cart');
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}; 