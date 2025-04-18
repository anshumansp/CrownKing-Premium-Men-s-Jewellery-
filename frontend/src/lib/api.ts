import axios from 'axios';
import { getToken, clearTokens } from '@/utils/auth';
import { toast } from 'react-hot-toast';

// Use NEXT_PUBLIC_ prefixed env vars or default to production URL if in production
const isProd = process.env.NODE_ENV === 'production';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 
                (isProd ? 'https://crownking.onrender.com/api' : 'http://localhost:5000/api');

// Create axios instance with base URL
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to set Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Clear tokens but don't redirect automatically
      // This allows components to handle auth redirects appropriately
      clearTokens();
      
      // Only redirect automatically if not on an auth page and not on a public page
      if (typeof window !== 'undefined' && 
          !window.location.pathname.includes('/auth') && 
          !window.location.pathname.includes('/products') &&
          !window.location.pathname.includes('/') &&
          window.location.pathname !== '/') {
        
        // Check if we should redirect (avoid redirect loops)
        const isApiCall = error.config && error.config.url && 
                         !error.config.url.includes('auth');
        
        if (isApiCall) {
          // Set session expired parameter to show appropriate message
          window.location.href = '/auth/login?session=expired';
          return new Promise(() => {}); // Prevent further error handling
        }
      }
    }
    
    // Handle network errors
    if (error.message === 'Network Error') {
      toast.error('Network error. Please check your connection.');
    }
    
    // Handle other errors with response
    if (error.response && error.response.data && error.response.data.error) {
      const errorMessage = error.response.data.error.message || 'An error occurred';
      toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 