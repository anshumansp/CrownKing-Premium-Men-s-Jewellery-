import { Order } from '@/types';
import { apiClient } from '@/lib/api';

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    totalOrders: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface OrderResponse {
  success: boolean;
  data: Order;
  clientSecret?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email?: string;
}

export interface PaymentDetails {
  method: 'credit_card' | 'paypal' | 'stripe';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  nameOnCard?: string;
}

export interface CreateOrderParams {
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
  shippingMethod: 'standard' | 'express' | 'free';
}

/**
 * Get user's orders
 */
export const getUserOrders = async (page = 1, limit = 10): Promise<OrdersResponse> => {
  try {
    const response = await apiClient.get('/orders', { params: { page, limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (id: string): Promise<OrderResponse> => {
  try {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new order (checkout)
 */
export const createOrder = async (params: CreateOrderParams): Promise<OrderResponse> => {
  try {
    const response = await apiClient.post('/orders', params);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Cancel an order
 */
export const cancelOrder = async (id: string): Promise<{ success: boolean; message: string; data: Order }> => {
  try {
    const response = await apiClient.post(`/orders/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error(`Error cancelling order with ID ${id}:`, error);
    throw error;
  }
}; 