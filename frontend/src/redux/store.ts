import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import paymentReducer from './slices/paymentSlice';
import wishlistReducer from './slices/wishlistSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: orderReducer,
    payments: paymentReducer,
    wishlist: wishlistReducer,
  },
  // Add middleware to handle serialization during SSR
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 