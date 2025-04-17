import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Product } from '@/types';

// Define the type for Item (which was missing)
export interface Item extends Product {}

interface WishlistState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

// Create async thunk for fetching wishlist data
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      // For now, we're using localStorage like in WishlistContext
      // In a real implementation, this would be an API call
      const localWishlist = localStorage.getItem('wishlist');
      if (localWishlist) {
        return JSON.parse(localWishlist) as Item[];
      }
      return [] as Item[];
    } catch (error) {
      return rejectWithValue('Failed to fetch wishlist');
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
      
      // Add new product to wishlist
      const updatedItems = [...currentItems, product];
      
      // Save to localStorage
      localStorage.setItem('wishlist', JSON.stringify(updatedItems));
      
      return updatedItems;
    } catch (error) {
      return rejectWithValue('Failed to add item to wishlist');
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
      
      // Filter out the item to remove
      const updatedItems = currentItems.filter(item => item.id !== productId);
      
      // Save to localStorage or remove if empty
      if (updatedItems.length === 0) {
        localStorage.removeItem('wishlist');
      } else {
        localStorage.setItem('wishlist', JSON.stringify(updatedItems));
      }
      
      return updatedItems;
    } catch (error) {
      return rejectWithValue('Failed to remove item from wishlist');
    }
  }
);

// Create the slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
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
      })
      
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.loading = false;
        state.items = action.payload;
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
      .addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearWishlist } = wishlistSlice.actions;

// Export selectors
export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectWishlistLoading = (state: RootState) => state.wishlist.loading;
export const selectWishlistError = (state: RootState) => state.wishlist.error;

// Export reducer
export default wishlistSlice.reducer; 