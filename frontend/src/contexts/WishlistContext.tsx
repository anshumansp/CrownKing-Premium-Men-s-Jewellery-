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

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();

    // Fetch wishlist when component mounts or when user logs in
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                setIsLoading(true);

                if (!isAuthenticated) {
                    // Try to get wishlist from local storage for non-authenticated users
                    const localWishlist = localStorage.getItem('wishlist');
                    if (localWishlist) {
                        setWishlist(JSON.parse(localWishlist));
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
                const localWishlist = localStorage.getItem('wishlist');
                if (localWishlist) {
                    setWishlist(JSON.parse(localWishlist));
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchWishlist();
    }, [isAuthenticated]);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        if (wishlist.length > 0) {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist]);

    const addToWishlist = (product: Product) => {
        setWishlist(current => {
            // Check if product already exists in wishlist
            if (current.some(item => item.id === product.id)) {
                return current;
            }

            // Add new product to wishlist
            return [...current, product];
        });
    };

    const removeFromWishlist = (productId: string) => {
        setWishlist(current => current.filter(item => item.id !== productId));

        // If wishlist is empty after removal, remove from localStorage
        if (wishlist.length === 1) {
            localStorage.removeItem('wishlist');
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
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
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
} 