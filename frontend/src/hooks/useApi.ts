import { useState, useEffect, useCallback } from 'react';
import { handleApiError, AppError, logError } from '@/utils/errorHandler';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  cacheTime?: number;
  requiresAuth?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
}

const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second

export function useApi<T>(url: string, options: ApiOptions = {}): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  const fetchWithRetry = useCallback(async (retryCount: number): Promise<T> => {
    try {
      // Check cache first
      if (options.method === 'GET' && options.cacheTime) {
        const cacheKey = `api-cache:${url}`;
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTimestamp = localStorage.getItem(`${cacheKey}:timestamp`);

        if (cachedData && cacheTimestamp) {
          const timestamp = parseInt(cacheTimestamp);
          if (Date.now() - timestamp < options.cacheTime) {
            return JSON.parse(cachedData);
          }
        }
      }

      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Add auth token if required
      if (options.requiresAuth) {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new AppError('Authentication required', 'AUTHENTICATION_ERROR');
        }
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Make API request
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        credentials: 'include', // Include cookies for CSRF
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw errorData;
      }

      const responseData = await response.json();

      // Update cache for GET requests
      if (options.method === 'GET' && options.cacheTime) {
        const cacheKey = `api-cache:${url}`;
        localStorage.setItem(cacheKey, JSON.stringify(responseData));
        localStorage.setItem(`${cacheKey}:timestamp`, Date.now().toString());
      }

      return responseData;
    } catch (err) {
      // Handle network errors
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        if (retryCount > 0) {
          await new Promise(resolve => 
            setTimeout(resolve, options.retryDelay || DEFAULT_RETRY_DELAY)
          );
          return fetchWithRetry(retryCount - 1);
        }
        throw new AppError('Network error', 'NETWORK_ERROR');
      }

      // Handle other errors
      throw handleApiError(err);
    }
  }, [url, options]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchWithRetry(
        options.retryCount || DEFAULT_RETRY_COUNT
      );
      setData(result);
    } catch (err) {
      const appError = err instanceof AppError ? err : handleApiError(err);
      setError(appError);
      logError(appError, { url, options });
    } finally {
      setLoading(false);
    }
  }, [fetchWithRetry]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
} 