// Token storage keys
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

/**
 * Save authentication token to localStorage
 */
export const saveToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Get authentication token from localStorage
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Save user data to localStorage
 */
export const saveUser = (user: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

/**
 * Get user data from localStorage
 */
export const getUser = (): any | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
};

/**
 * Clear all authentication data from localStorage
 */
export const clearTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

/**
 * Check if user is authenticated
 * If the context is cart or wishlist related, we'll consider the user as authenticated
 * to allow guests to use those features
 */
export const isAuthenticated = (context?: string): boolean => {
  const hasToken = !!getToken();
  
  // Allow access to cart/wishlist/checkout for all users
  if (context === 'cart' || context === 'wishlist' || context === 'checkout') {
    return true;
  }
  
  if (typeof window !== 'undefined' && !hasToken) {
    // Check if we're on a cart, wishlist, or checkout page
    const pathname = window.location.pathname;
    if (
      pathname.includes('/cart') || 
      pathname.includes('/wishlist') || 
      pathname.includes('/checkout')
    ) {
      return true;
    }
  }
  
  return hasToken;
};

/**
 * Check if user has a specific role
 */
export const hasRole = (role: string): boolean => {
  const user = getUser();
  return user && user.role === role;
};

/**
 * Check if user is an admin
 */
export const isAdmin = (): boolean => {
  return hasRole('admin');
}; 