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

// Initialize state from localStorage if available
const getInitialState = (): WishlistState => {
  if (typeof window !== 'undefined') {
    try {
      const localWishlist = localStorage.getItem('wishlist');
      if (localWishlist) {
        return {
          items: JSON.parse(localWishlist),
          loading: false,
          error: null,
        };
      }
    } catch (error) {
      console.error('Failed to parse wishlist from localStorage:', error);
    }
  }
  
  return {
    items: [],
    loading: false,
    error: null,
  };
};

// Create async thunk for fetching wishlist data
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      // If not authenticated, use localStorage
      if (!isAuthenticated()) {
        const localWishlist = localStorage.getItem('wishlist');
        return localWishlist ? JSON.parse(localWishlist) : [];
      }
      
      // Fetch from API
      const response = await wishlistService.getWishlist();
      return response.data.items.map((item: any) => item.product);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch wishlist');
    }
  }
);

// Create async thunk for adding item to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (product: Item, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const currentItems = state.wishlist.items;
      
      // Check if product already exists in wishlist
      if (currentItems.some(item => item.id === product.id)) {
        return currentItems;
      }
      
      // If authenticated, add to backend
      if (isAuthenticated()) {
        await wishlistService.addToWishlist({ productId: product.id });
      }
      
      // Add new product to wishlist
      const updatedItems = [...currentItems, product];
      
      // Save to localStorage
      localStorage.setItem('wishlist', JSON.stringify(updatedItems));
      
      return updatedItems;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to add item to wishlist');
    }
  }
);

// Create async thunk for removing item from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const currentItems = state.wishlist.items;
      
      // If authenticated, remove from backend
      if (isAuthenticated()) {
        await wishlistService.removeFromWishlist(productId);
      }
      
      // Filter out the item to remove
      const updatedItems = currentItems.filter(item => item.id !== productId);
      
      // Save to localStorage or remove if empty
      if (updatedItems.length === 0) {
        localStorage.removeItem('wishlist');
      } else {
        localStorage.setItem('wishlist', JSON.stringify(updatedItems));
      }
      
      return updatedItems;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to remove item from wishlist');
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
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlist');
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error || 'Failed to fetch wishlist');
      })
      
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.loading = false;
        state.items = action.payload;
        toast.success('Item added to wishlist');
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error || 'Failed to add item to wishlist');
      })
      
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.loading = false;
        state.items = action.payload;
        toast.success('Item removed from wishlist');
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(state.error || 'Failed to remove item from wishlist');
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

// Export reducer
export default wishlistSlice.reducer; 