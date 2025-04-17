import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '@/types';
import * as cartService from '@/services/cartService';
import { isAuthenticated } from '@/utils/auth';
import { toast } from 'react-hot-toast';
import { 
  addItemAsync,
  fetchCart,
  updateQuantityAsync,
  removeItemAsync,
  clearCartAsync
} from '@/redux/api/cartApi';

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
  let initialState = {
    items: [],
    isOpen: false,
    loading: false,
    error: null,
  };
  
  if (typeof window !== 'undefined') {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        initialState = {
          ...initialState,
          ...parsedCart,
          loading: false,
          error: null,
        };
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
    }
  }
  
  return initialState;
};

// Async thunks for cart operations
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
      // Ensure items array exists
      if (!state.items) {
        state.items = [];
      }
      
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
        localStorage.setItem('cart', JSON.stringify({
          items: state.items,
          isOpen: state.isOpen
        }));
      }
      
      // Show success message
      if (typeof window !== 'undefined') {
        import('react-hot-toast').then(toast => {
          toast.toast.success(`${product.name} added to cart!`);
        }).catch(err => console.error('Could not load toast library', err));
      }
    },
    
    // Add an item by ID (simplified version when full product isn't available)
    addItemById: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      // Ensure items array exists
      if (!state.items) {
        state.items = [];
      }
      
      const { productId, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === productId);
      
      if (existingItemIndex >= 0) {
        // If item exists, add the specified quantity
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // For new items, we need to find the product data
        // This could be improved by passing the full product object
        // But for now, we'll just create a minimal item
        state.items.push({ 
          id: productId,
          quantity: quantity,
          name: `Product ${productId}`, // Will be updated when viewed in cart
          price: 0, // Will be updated when viewed in cart
          images: [],
          category: '',
          subCategory: '',
          description: '',
          specifications: { material: '', weight: '', dimensions: '', warranty: '' },
          rating: 0,
          reviews: 0,
          inStock: true,
          featured: false,
          discount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify({
          items: state.items,
          isOpen: state.isOpen
        }));
      }
      
      // Show success message
      if (typeof window !== 'undefined') {
        import('react-hot-toast').then(toast => {
          toast.toast.success("Product added to cart!");
        }).catch(err => console.error('Could not load toast library', err));
      }
    },
    
    removeItem: (state, action: PayloadAction<string>) => {
      // Ensure items array exists
      if (!state.items) {
        state.items = [];
        return;
      }
      
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify({
          items: state.items,
          isOpen: state.isOpen
        }));
      }
      
      // Show success message
      if (typeof window !== 'undefined') {
        import('react-hot-toast').then(toast => {
          toast.toast.success("Item removed from cart");
        }).catch(err => console.error('Could not load toast library', err));
      }
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      // Ensure items array exists
      if (!state.items) {
        state.items = [];
        return;
      }
      
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id);
      
      if (itemIndex >= 0 && quantity > 0) {
        state.items[itemIndex].quantity = quantity;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify({
            items: state.items,
            isOpen: state.isOpen
          }));
        }
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify({
          items: state.items,
          isOpen: state.isOpen
        }));
      }
      
      // Show success message
      if (typeof window !== 'undefined') {
        import('react-hot-toast').then(toast => {
          toast.toast.success("Cart cleared");
        }).catch(err => console.error('Could not load toast library', err));
      }
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify({
          items: state.items || [],
          isOpen: state.isOpen
        }));
      }
    },
    
    // Synchronize cart with authenticated user
    syncCart: (state, action: PayloadAction<CartItem[]>) => {
      // Ensure items array exists
      if (!state.items) {
        state.items = [];
      }
      
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
        localStorage.setItem('cart', JSON.stringify({
          items: state.items,
          isOpen: state.isOpen
        }));
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
  syncCart,
  addItemById
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