// Token storage keys
const TOKEN_KEY = 'crown_king_token';
const USER_KEY = 'crown_king_user';

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
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
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