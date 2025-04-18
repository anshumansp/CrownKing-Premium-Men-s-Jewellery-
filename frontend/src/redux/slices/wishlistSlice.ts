import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Product } from '@/types';
import * as wishlistService from '@/services/wishlistService';
import { isAuthenticated } from '@/utils/auth';
import { toast } from 'react-hot-toast';

// Define the type for Item (which was missing)
export interface Item extends Product {}

interface WishlistState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

// Get initial state from localStorage if available
const getInitialState = (): WishlistState => {
  let initialState = {
    items: [],
    loading: false,
    error: null,
  };
  
  if (typeof window !== 'undefined') {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        initialState = {
          ...initialState,
          items: parsedWishlist,
          loading: false,
          error: null,
        };
      }
    } catch (error) {
      console.error('Failed to parse wishlist from localStorage:', error);
    }
  }
  
  return initialState;
};

// Async thunk to fetch wishlist items
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      // If user is logged in with token, fetch from API
      if (isAuthenticated() && localStorage.getItem('token')) {
        const response = await wishlistService.getWishlist();
        return response.data;
      } else {
        // For guest users, get from localStorage
        const localWishlist = localStorage.getItem('wishlist');
        return localWishlist ? JSON.parse(localWishlist) : [];
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

// Async thunk to add item to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (product: any, { rejectWithValue, dispatch }) => {
    try {
      // For logged in users, save to API
      if (isAuthenticated() && localStorage.getItem('token')) {
        await wishlistService.addToWishlist(product.id);
        toast.success(`${product.name} added to wishlist!`);
        return product;
      } else {
        // For guest users, save to localStorage
        const localWishlist = localStorage.getItem('wishlist');
        const wishlistItems = localWishlist ? JSON.parse(localWishlist) : [];
        
        // Check if the product is already in the wishlist
        if (!wishlistItems.some((item: Item) => item.id === product.id)) {
          wishlistItems.push(product);
          localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
          toast.success(`${product.name} added to wishlist!`);
        }
        
        return product;
      }
    } catch (error: any) {
      toast.error('Failed to add to wishlist');
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

// Async thunk to remove item from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      // For logged in users, remove from API
      if (isAuthenticated() && localStorage.getItem('token')) {
        await wishlistService.removeFromWishlist(productId);
        toast.success('Item removed from wishlist');
        return productId;
      } else {
        // For guest users, remove from localStorage
        const localWishlist = localStorage.getItem('wishlist');
        if (localWishlist) {
          const wishlistItems = JSON.parse(localWishlist);
          const filteredItems = wishlistItems.filter((item: Item) => item.id !== productId);
          localStorage.setItem('wishlist', JSON.stringify(filteredItems));
          toast.success('Item removed from wishlist');
        }
        
        return productId;
      }
    } catch (error: any) {
      toast.error('Failed to remove from wishlist');
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

// Create thunk for clearing wishlist
export const clearWishlistAsync = createAsyncThunk(
  'wishlist/clearWishlistAsync',
  async (_, { rejectWithValue }) => {
    try {
      // If authenticated, clear from backend
      if (isAuthenticated()) {
        await wishlistService.clearWishlist();
      }
      
      // Clear from localStorage
      localStorage.removeItem('wishlist');
      
      return [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to clear wishlist');
    }
  }
);

// Create thunk for syncing wishlist with backend
export const syncWishlistWithBackend = createAsyncThunk(
  'wishlist/syncWishlistWithBackend',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Only sync if authenticated
      if (!isAuthenticated()) {
        return null;
      }
      
      const state = getState() as RootState;
      const localItems = state.wishlist.items;
      
      // If we have local items, sync them to backend
      if (localItems.length > 0) {
        // Add each local item to backend
        for (const item of localItems) {
          try {
            await wishlistService.addToWishlist({ productId: item.id });
          } catch (error) {
            console.error('Error syncing wishlist item:', error);
          }
        }
      }
      
      // Then fetch latest wishlist from backend
      const response = await wishlistService.getWishlist();
      return response.data.items.map((item: any) => item.product);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to sync wishlist');
    }
  }
);

// Create the slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: getInitialState(),
  reducers: {
    clearWishlist(state) {
      state.items = [];
      // Clear localStorage wishlist
      if (typeof window !== 'undefined') {
        localStorage.removeItem('wishlist');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('wishlist', JSON.stringify(action.payload));
        }
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        // Only add if not already in the wishlist
        if (!state.items.some(item => item.id === action.payload.id)) {
          state.items.push(action.payload);
          // Update localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('wishlist', JSON.stringify(state.items));
          }
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('wishlist', JSON.stringify(state.items));
        }
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Clear wishlist
      .addCase(clearWishlistAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearWishlistAsync.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        toast.success('Wishlist cleared');
      })
      .addCase(clearWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error || 'Failed to clear wishlist');
      })
      
      // Sync wishlist with backend
      .addCase(syncWishlistWithBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncWishlistWithBackend.fulfilled, (state, action) => {
        if (action.payload) {
          state.loading = false;
          state.items = action.payload;
          localStorage.setItem('wishlist', JSON.stringify(action.payload));
        }
      })
      .addCase(syncWishlistWithBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error || 'Failed to sync wishlist');
      });
  },
});

// Export actions
export const { clearWishlist } = wishlistSlice.actions;

// Export selectors
export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectWishlistLoading = (state: RootState) => state.wishlist.loading;
export const selectWishlistError = (state: RootState) => state.wishlist.error;
export const selectIsInWishlist = (state: RootState, productId: string) => 
  state.wishlist.items.some(item => item.id === productId);
export const selectWishlistItemCount = (state: RootState) => state.wishlist.items.length;

// Export reducer
export default wishlistSlice.reducer; 