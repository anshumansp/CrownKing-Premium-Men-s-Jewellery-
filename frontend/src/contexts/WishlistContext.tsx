'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/types';
import { useAuth } from './AuthContext';

interface WishlistContextType {
    wishlist: Product[];
    isLoading: boolean;
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create a default context value with empty implementations
const defaultContextValue: WishlistContextType = {
    wishlist: [],
    isLoading: false,
    addToWishlist: () => { },
    removeFromWishlist: () => { },
    isInWishlist: () => false,
};

const WishlistContext = createContext<WishlistContextType>(defaultContextValue);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();

    // Fetch wishlist when component mounts or when user logs in
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                setIsLoading(true);

                if (typeof window === 'undefined') {
                    // Skip localStorage in SSR
                    setIsLoading(false);
                    return;
                }

                if (!isAuthenticated) {
                    // Try to get wishlist from local storage for non-authenticated users
                    try {
                        const localWishlist = localStorage.getItem('wishlist');
                        if (localWishlist) {
                            const parsedWishlist = JSON.parse(localWishlist);
                            if (Array.isArray(parsedWishlist)) {
                                setWishlist(parsedWishlist);
                            } else {
                                // If not an array, initialize with empty array
                                setWishlist([]);
                            }
                        }
                    } catch (error) {
                        console.error('Error parsing wishlist from localStorage:', error);
                        setWishlist([]);
                    }
                    setIsLoading(false);
                    return;
                }

                // For authenticated users, fetch from API
                const token = localStorage.getItem('token');
                if (!token) {
                    setIsLoading(false);
                    return;
                }

                // In a real implementation, this would be an API call
                // For now, using mock data or local storage
                try {
                    const localWishlist = localStorage.getItem('wishlist');
                    if (localWishlist) {
                        const parsedWishlist = JSON.parse(localWishlist);
                        if (Array.isArray(parsedWishlist)) {
                            setWishlist(parsedWishlist);
                        }
                    }
                } catch (error) {
                    console.error('Error parsing wishlist:', error);
                }

                // Sample API call (commented out for now)
                /*
                const response = await fetch(`${API_URL}/wishlist`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
        
                if (response.ok) {
                  const data = await response.json();
                  setWishlist(data.items);
                }
                */
            } catch (error) {
                console.error('Failed to fetch wishlist:', error);
                setWishlist([]); // Ensure wishlist is always an array
            } finally {
                setIsLoading(false);
            }
        };

        fetchWishlist();
    }, [isAuthenticated]);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        if (typeof window === 'undefined') return; // Skip in SSR

        if (wishlist && wishlist.length > 0) {
            try {
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
            } catch (error) {
                console.error('Error saving wishlist to localStorage:', error);
            }
        }
    }, [wishlist]);

    const addToWishlist = (product: Product) => {
        setWishlist(current => {
            // Handle case where current might be undefined
            const currentWishlist = current || [];

            // Check if product already exists in wishlist
            if (currentWishlist.some(item => item.id === product.id)) {
                return currentWishlist;
            }

            // Add new product to wishlist
            return [...currentWishlist, product];
        });
    };

    const removeFromWishlist = (productId: string) => {
        setWishlist(current => {
            // Handle case where current might be undefined
            const currentWishlist = current || [];
            return currentWishlist.filter(item => item.id !== productId);
        });

        // If wishlist is empty after removal, remove from localStorage
        if (wishlist && wishlist.length === 1 && typeof window !== 'undefined') {
            try {
                localStorage.removeItem('wishlist');
            } catch (error) {
                console.error('Error removing wishlist from localStorage:', error);
            }
        }
    };

    const isInWishlist = (productId: string) => {
        // Ensure wishlist is an array and handle the case where it might be undefined
        return Array.isArray(wishlist) && wishlist.some(item => item && item.id === productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist: wishlist || [],
                isLoading,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    // This check should never trigger now with the default context value
    if (context === undefined) {
        console.error('useWishlist must be used within a WishlistProvider');
        return defaultContextValue;
    }
    return context;
} 