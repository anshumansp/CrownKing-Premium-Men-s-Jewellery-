'use client';

import React, { useState, useCallback, useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import useDebounce from '@/hooks/useDebounce';

interface SearchBarProps {
    alwaysShow?: boolean;
    className?: string;
    onSearch?: (query: string) => void;
    placeholder?: string;
    debounceTime?: number;
}

const SearchBarComponent: React.FC<SearchBarProps> = ({
    alwaysShow = true,
    className = '',
    onSearch,
    placeholder = 'Search for products...',
    debounceTime = 300
}) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedQuery = useDebounce(searchQuery, debounceTime);

    // Memoized form submission handler
    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        if (onSearch) {
            onSearch(searchQuery);
        } else {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    }, [searchQuery, onSearch, router]);

    // Memoized input change handler
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    // Memoize the UI only when necessary props change
    const searchUI = useMemo(() => (
        <div className={`relative ${className}`}>
            <form onSubmit={handleSearch} className="flex items-center">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                </button>
            </form>
        </div>
    ), [searchQuery, className, placeholder, handleSearch, handleInputChange]);

    return searchUI;
};

// Memoize the component to prevent unnecessary re-renders
const SearchBar = memo(SearchBarComponent);
export default SearchBar; 