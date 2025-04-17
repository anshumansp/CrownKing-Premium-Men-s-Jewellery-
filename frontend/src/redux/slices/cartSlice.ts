import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// Initial state based on localStorage if available
const getInitialState = (): CartState => {
  if (typeof window !== 'undefined') {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
    }
  }
  
  return {
    items: [],
    isOpen: false,
  };
};

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