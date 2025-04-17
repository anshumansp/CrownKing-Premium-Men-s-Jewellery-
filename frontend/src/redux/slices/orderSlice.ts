import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '@/types';
import * as orderService from '@/services/orderService';

// Define types
interface OrderState {
  orders: Order[];
  totalOrders: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  currentOrder: Order | null;
  trackingInfo: any | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: OrderState = {
  orders: [],
  totalOrders: 0,
  totalPages: 1,
  currentPage: 1,
  limit: 10,
  currentOrder: null,
  trackingInfo: null,
  isLoading: false,
  error: null
};

// Async thunks for API calls
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await orderService.getUserOrders(page, limit);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch orders';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderById(orderId);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch order';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchOrderTracking = createAsyncThunk(
  'orders/fetchOrderTracking',
  async (orderId: string, { rejectWithValue }) => {
    try {
      // Note: For tracking API, we need to implement this endpoint on the backend
      // For now, we'll mock this with a placeholder
      throw new Error('Tracking API not implemented yet');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch tracking information';
      return rejectWithValue(errorMessage);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await orderService.cancelOrder(orderId);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel order';
      return rejectWithValue(errorMessage);
    }
  }
);

// Order slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.trackingInfo = null;
    }
  },
  extraReducers: (builder) => {
    // Handle fetch orders
    builder.addCase(fetchOrders.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action: PayloadAction<orderService.OrdersResponse['data']>) => {
      state.isLoading = false;
      state.orders = action.payload.orders;
      state.totalOrders = action.payload.totalOrders;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.limit = action.payload.limit;
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Handle fetch order by ID
    builder.addCase(fetchOrderById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
      state.isLoading = false;
      state.currentOrder = action.payload;
    });
    builder.addCase(fetchOrderById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Handle fetch order tracking
    builder.addCase(fetchOrderTracking.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchOrderTracking.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.trackingInfo = action.payload;
    });
    builder.addCase(fetchOrderTracking.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Handle cancel order
    builder.addCase(cancelOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(cancelOrder.fulfilled, (state, action: PayloadAction<{ order: Order }>) => {
      state.isLoading = false;
      const updatedOrder = action.payload.order;
      
      // Update order status in orders list
      state.orders = state.orders.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      );
      
      // Update current order if it's the cancelled one
      if (state.currentOrder && state.currentOrder.id === updatedOrder.id) {
        state.currentOrder = updatedOrder;
      }
    });
    builder.addCase(cancelOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  }
});

export const { clearOrderError, clearCurrentOrder } = orderSlice.actions;

// Selectors
export const selectOrders = (state: any) => state?.orders?.orders || [];
export const selectOrdersPagination = (state: any) => ({
  totalOrders: state?.orders?.totalOrders || 0,
  totalPages: state?.orders?.totalPages || 1,
  currentPage: state?.orders?.currentPage || 1,
  limit: state?.orders?.limit || 10
});
export const selectCurrentOrder = (state: any) => state?.orders?.currentOrder || null;
export const selectTrackingInfo = (state: any) => state?.orders?.trackingInfo || null;
export const selectOrdersLoading = (state: any) => state?.orders?.isLoading || false;
export const selectOrdersError = (state: any) => state?.orders?.error || null;

export default orderSlice.reducer; 