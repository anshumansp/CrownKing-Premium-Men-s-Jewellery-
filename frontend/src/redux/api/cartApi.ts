import { createAsyncThunk } from '@reduxjs/toolkit';
import * as cartService from '@/services/cartService';
import { isAuthenticated } from '@/utils/auth';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  loading: boolean;
  error: string | null;
}

// Re-export the async thunks from cartSlice to maintain compatibility
export const addItemAsync = createAsyncThunk(
  'cart/addItemAsync',
  async ({ productId, quantity = 1 }: { productId: string; quantity?: number }, { rejectWithValue, dispatch, getState }) => {
    try {
      // We don't need to update the local store here since that should be handled by
      // the component directly calling the regular addItem/addItemById action

      // Only add to backend if user is authenticated
      if (!isAuthenticated()) {
        return null;
      }
      
      const response = await cartService.addToCart({ productId, quantity });
      return response.data;
    } catch (error: any) {
      console.error('Failed to sync cart with server:', error);
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to add item to cart');
    }
  }
);

export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantityAsync',
  async ({ itemId, quantity }: { itemId: string; quantity: number }, { rejectWithValue }) => {
    try {
      // Only update backend if user is authenticated
      if (!isAuthenticated()) {
        return null;
      }
      
      const response = await cartService.updateCartItem(itemId, { quantity });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to update cart item');
    }
  }
);

export const removeItemAsync = createAsyncThunk(
  'cart/removeItemAsync',
  async (itemId: string, { rejectWithValue }) => {
    try {
      // Only remove from backend if user is authenticated
      if (!isAuthenticated()) {
        return { id: itemId };
      }
      
      const response = await cartService.removeCartItem(itemId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to remove item from cart');
    }
  }
);

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      // Only fetch from API if user is authenticated
      if (!isAuthenticated()) {
        return { items: [] };
      }
      
      const response = await cartService.getCart();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch cart');
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async (_, { rejectWithValue }) => {
    try {
      // Only clear backend if user is authenticated
      if (!isAuthenticated()) {
        return null;
      }
      
      await cartService.clearCart();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to clear cart');
    }
  }
); 