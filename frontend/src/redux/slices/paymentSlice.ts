import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'credit_card' | 'debit_card' | 'paypal' | 'upi';
  cardLast4?: string;
  cardType?: string;
  date: string;
}

interface PaymentState {
  payments: Payment[];
  currentPayment: Payment | null;
  isLoading: boolean;
  error: string | null;
}

// Mock payment data for demo
const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    orderId: 'ORD-001',
    amount: 329.98,
    status: 'completed',
    method: 'credit_card',
    cardLast4: '1234',
    cardType: 'Visa',
    date: '2023-05-15T10:30:00Z'
  },
  {
    id: 'PAY-002',
    orderId: 'ORD-002',
    amount: 189.99,
    status: 'completed',
    method: 'credit_card',
    cardLast4: '5678',
    cardType: 'Mastercard',
    date: '2023-06-10T14:45:00Z'
  },
  {
    id: 'PAY-003',
    orderId: 'ORD-003',
    amount: 125.50,
    status: 'refunded',
    method: 'credit_card',
    cardLast4: '9012',
    cardType: 'Visa',
    date: '2023-04-22T09:15:00Z'
  }
];

// Initial state
const initialState: PaymentState = {
  payments: [],
  currentPayment: null,
  isLoading: false,
  error: null
};

// Async thunks
export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be an API call
      return mockPayments;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch payments');
    }
  }
);

export const fetchPaymentById = createAsyncThunk(
  'payments/fetchPaymentById',
  async (paymentId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const payment = mockPayments.find(p => p.id === paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      return payment;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch payment');
    }
  }
);

export const fetchPaymentsByOrderId = createAsyncThunk(
  'payments/fetchPaymentsByOrderId',
  async (orderId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const payments = mockPayments.filter(p => p.orderId === orderId);
      return payments;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch payments for order');
    }
  }
);

// Payment slice
const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    }
  },
  extraReducers: (builder) => {
    // Handle fetchPayments
    builder.addCase(fetchPayments.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPayments.fulfilled, (state, action: PayloadAction<Payment[]>) => {
      state.isLoading = false;
      state.payments = action.payload;
    });
    builder.addCase(fetchPayments.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Handle fetchPaymentById
    builder.addCase(fetchPaymentById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPaymentById.fulfilled, (state, action: PayloadAction<Payment>) => {
      state.isLoading = false;
      state.currentPayment = action.payload;
    });
    builder.addCase(fetchPaymentById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Handle fetchPaymentsByOrderId
    builder.addCase(fetchPaymentsByOrderId.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPaymentsByOrderId.fulfilled, (state, action: PayloadAction<Payment[]>) => {
      state.isLoading = false;
      state.payments = action.payload;
    });
    builder.addCase(fetchPaymentsByOrderId.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  }
});

export const { clearPaymentError, clearCurrentPayment } = paymentSlice.actions;

// Selectors
export const selectPayments = (state: any) => state?.payments?.payments || [];
export const selectCurrentPayment = (state: any) => state?.payments?.currentPayment || null;
export const selectPaymentsLoading = (state: any) => state?.payments?.isLoading || false;
export const selectPaymentsError = (state: any) => state?.payments?.error || null;

export default paymentSlice.reducer; 