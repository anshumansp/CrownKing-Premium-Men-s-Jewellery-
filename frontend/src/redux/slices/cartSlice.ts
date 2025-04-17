import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '@/types';
import * as cartService from '@/services/cartService';
import { isAuthenticated } from '@/utils/auth';
import { toast } from 'react-hot-toast';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state based on localStorage if available
const getInitialState = (): CartState => {
  if (typeof window !== 'undefined') {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        return {
          ...parsedCart,
          loading: false,
          error: null,
        };
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
    }
  }
  
  return {
    items: [],
    isOpen: false,
    loading: false,
    error: null,
  };
};

// Async thunks for cart operations
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

export const addItemAsync = createAsyncThunk(
  'cart/addItemAsync',
  async ({ productId, quantity = 1 }: { productId: string; quantity?: number }, { rejectWithValue }) => {
    try {
      // Only add to backend if user is authenticated
      if (!isAuthenticated()) {
        return null;
      }
      
      const response = await cartService.addToCart({ productId, quantity });
      return response.data;
    } catch (error: any) {
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

export const syncCartWithBackend = createAsyncThunk(
  'cart/syncCartWithBackend',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      // Only sync with backend if user is authenticated
      if (!isAuthenticated()) {
        return null;
      }
      
      const state = getState() as { cart: CartState };
      const localItems = state.cart.items;
      
      // If we have local items, sync them to the backend
      if (localItems.length > 0) {
        // Add each local item to the backend
        for (const item of localItems) {
          try {
            await cartService.addToCart({ productId: item.id, quantity: item.quantity });
          } catch (error) {
            console.error('Error syncing item:', error);
          }
        }
      }
      
      // Then fetch the latest cart from backend
      const response = await cartService.getCart();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to sync cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: getInitialState(),
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // If item exists, increase quantity
        state.items[existingItemIndex].quantity += 1;
      } else {
        // Add new item
        state.items.push({ ...product, quantity: 1 });
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    
    removeItem: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id);
      
      if (itemIndex >= 0 && quantity > 0) {
        state.items[itemIndex].quantity = quantity;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(state));
        }
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    // Synchronize cart with authenticated user
    syncCart: (state, action: PayloadAction<CartItem[]>) => {
      // Merge local cart with user's cart from database
      const mergedItems: CartItem[] = [...state.items];
      
      action.payload.forEach(serverItem => {
        const localItemIndex = mergedItems.findIndex(item => item.id === serverItem.id);
        
        if (localItemIndex >= 0) {
          // Item exists both locally and on server, take the higher quantity
          mergedItems[localItemIndex].quantity = Math.max(
            mergedItems[localItemIndex].quantity,
            serverItem.quantity
          );
        } else {
          // Item only exists on server, add it
          mergedItems.push(serverItem);
        }
      });
      
      state.items = mergedItems;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.items) {
          // Convert API response to CartItem format
          const cartItems = action.payload.items.map((item: any) => ({
            ...item.product,
            quantity: item.quantity,
          }));
          
          // Merge with local cart (take higher quantity)
          const mergedItems: CartItem[] = [...state.items];
          
          cartItems.forEach(serverItem => {
            const localItemIndex = mergedItems.findIndex(item => item.id === serverItem.id);
            
            if (localItemIndex >= 0) {
              mergedItems[localItemIndex].quantity = Math.max(
                mergedItems[localItemIndex].quantity,
                serverItem.quantity
              );
            } else {
              mergedItems.push(serverItem);
            }
          });
          
          state.items = mergedItems;
          
          // Save to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify({
              items: state.items,
              isOpen: state.isOpen,
            }));
          }
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
        toast.error(state.error);
      })
      
      // addItemAsync
      .addCase(addItemAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemAsync.fulfilled, (state, action) => {
        state.loading = false;
        // If authenticated, the item is added to backend but we don't update UI
        // We'll handle updating the UI in the regular addItem action
      })
      .addCase(addItemAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
        toast.error(state.error);
      })
      
      // updateQuantityAsync
      .addCase(updateQuantityAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        state.loading = false;
        // If authenticated, the item is updated in backend but we don't update UI
        // We'll handle updating the UI in the regular updateQuantity action
      })
      .addCase(updateQuantityAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
        toast.error(state.error);
      })
      
      // removeItemAsync
      .addCase(removeItemAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemAsync.fulfilled, (state, action) => {
        state.loading = false;
        // If authenticated, the item is removed from backend but we don't update UI
        // We'll handle updating the UI in the regular removeItem action
      })
      .addCase(removeItemAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
        toast.error(state.error);
      })
      
      // clearCartAsync
      .addCase(clearCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.loading = false;
        // If authenticated, the cart is cleared in backend but we don't update UI
        // We'll handle updating the UI in the regular clearCart action
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
        toast.error(state.error);
      })
      
      // syncCartWithBackend
      .addCase(syncCartWithBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncCartWithBackend.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.items) {
          // Convert API response to CartItem format
          const cartItems = action.payload.items.map((item: any) => ({
            ...item.product,
            quantity: item.quantity,
          }));
          
          state.items = cartItems;
          
          // Save to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify({
              items: state.items,
              isOpen: state.isOpen,
            }));
          }
        }
      })
      .addCase(syncCartWithBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
        toast.error(state.error);
      });
  },
});

export const { 
  addItem, 
  removeItem, 
  updateQuantity, 
  clearCart, 
  toggleCart,
  syncCart
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors with safety checks
export const selectCartItems = (state: any) => state?.cart?.items || [];
export const selectCartItemsCount = (state: any) => 
  state?.cart?.items ? state.cart.items.reduce((total: number, item: CartItem) => total + item.quantity, 0) : 0;
export const selectCartTotal = (state: any) => 
  state?.cart?.items ? state.cart.items.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0) : 0;
export const selectIsCartOpen = (state: any) => state?.cart?.isOpen || false;
export const selectCartLoading = (state: any) => state?.cart?.loading || false; 
export const selectCartError = (state: any) => state?.cart?.error || null; 