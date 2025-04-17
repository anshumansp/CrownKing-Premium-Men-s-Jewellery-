import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '@/types';

// Mock data for demo (in a real app this would come from API)
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    total: 329.98,
    status: 'delivered',
    createdAt: '2023-05-15T10:30:00Z',
    items: [
      {
        id: '1',
        name: 'Gold Chain Bracelet',
        price: 249.99,
        quantity: 1,
        images: ['/images/products/bracelet-1.jpg'],
        category: 'bracelets',
        subCategory: 'gold',
        specifications: { 'material': '18K Gold' },
        rating: 4.8,
        reviews: 24,
        inStock: true,
        featured: true,
        discount: 0
      },
      {
        id: '3',
        name: 'Silver Cufflinks',
        price: 79.99,
        quantity: 1,
        images: ['/images/products/cufflinks-1.jpg'],
        category: 'accessories',
        subCategory: 'cufflinks',
        specifications: { 'material': 'Sterling Silver' },
        rating: 4.5,
        reviews: 12,
        inStock: true,
        featured: false,
        discount: 0
      }
    ],
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    paymentDetails: {
      cardNumber: '**** **** **** 1234',
      expiryDate: '05/25',
      cvv: '***',
      nameOnCard: 'John Doe'
    }
  },
  {
    id: 'ORD-002',
    total: 189.99,
    status: 'processing',
    createdAt: '2023-06-10T14:45:00Z',
    items: [
      {
        id: '2',
        name: 'Silver Pendant Necklace',
        price: 189.99,
        quantity: 1,
        images: ['/images/products/necklace-1.jpg'],
        category: 'necklaces',
        subCategory: 'silver',
        specifications: { 'material': 'Sterling Silver' },
        rating: 4.6,
        reviews: 18,
        inStock: true,
        featured: false,
        discount: 0
      }
    ],
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    paymentDetails: {
      cardNumber: '**** **** **** 5678',
      expiryDate: '08/24',
      cvv: '***',
      nameOnCard: 'John Doe'
    }
  }
];

// Mock order tracking data
const mockTracking: Record<string, any> = {
  'ORD-001': {
    status: 'delivered',
    events: [
      { status: 'ordered', date: '2023-05-15T10:30:00Z', description: 'Order placed' },
      { status: 'processing', date: '2023-05-15T14:20:00Z', description: 'Payment confirmed, order processing' },
      { status: 'shipped', date: '2023-05-16T09:45:00Z', description: 'Package shipped', tracking: 'TRK123456789' },
      { status: 'out_for_delivery', date: '2023-05-20T08:30:00Z', description: 'Out for delivery' },
      { status: 'delivered', date: '2023-05-20T14:15:00Z', description: 'Delivered' }
    ]
  },
  'ORD-002': {
    status: 'processing',
    events: [
      { status: 'ordered', date: '2023-06-10T14:45:00Z', description: 'Order placed' },
      { status: 'processing', date: '2023-06-10T15:30:00Z', description: 'Payment confirmed, order processing' }
    ]
  }
};

// Define types
interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  trackingInfo: any | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  trackingInfo: null,
  isLoading: false,
  error: null
};

// Async thunks for API calls
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulating API delay
      return mockOrders;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulating API delay
      
      const order = mockOrders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch order');
    }
  }
);

export const fetchOrderTracking = createAsyncThunk(
  'orders/fetchOrderTracking',
  async (orderId: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulating API delay
      
      const tracking = mockTracking[orderId];
      if (!tracking) {
        throw new Error('Tracking information not found');
      }
      
      return tracking;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tracking information');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulating API delay
      
      const order = mockOrders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      
      if (order.status === 'delivered' || order.status === 'shipped') {
        throw new Error('Cannot cancel an order that has been shipped or delivered');
      }
      
      return orderId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel order');
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
    builder.addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
      state.isLoading = false;
      state.orders = action.payload;
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
    builder.addCase(cancelOrder.fulfilled, (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      const orderId = action.payload;
      
      // Update order status in orders list
      state.orders = state.orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' as 'cancelled' } 
          : order
      );
      
      // Update current order if it's the cancelled one
      if (state.currentOrder && state.currentOrder.id === orderId) {
        state.currentOrder = { ...state.currentOrder, status: 'cancelled' as 'cancelled' };
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
export const selectCurrentOrder = (state: any) => state?.orders?.currentOrder || null;
export const selectTrackingInfo = (state: any) => state?.orders?.trackingInfo || null;
export const selectOrdersLoading = (state: any) => state?.orders?.isLoading || false;
export const selectOrdersError = (state: any) => state?.orders?.error || null;

export default orderSlice.reducer; 