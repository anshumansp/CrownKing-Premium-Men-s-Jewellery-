import { Address } from '@/types';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

export const addressService = {
  async getAddresses(): Promise<Address[]> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/users/addresses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch addresses');
    }

    // Parse the response and ensure it's an array
    const data = await response.json();
    
    // Check if the API returns data directly or nested in another object
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object') {
      // Check for common patterns like data.data or data.addresses
      if (Array.isArray(data.data)) return data.data;
      if (Array.isArray(data.addresses)) return data.addresses;
      
      // If it's an object but not in expected format, return as an array with single item
      // or empty array depending on if it looks like an address
      if (data.id && data.type) return [data];
    }
    
    // Default to empty array if nothing matches
    return [];
  },

  async getAddress(id: string): Promise<Address> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/users/addresses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch address');
    }

    return response.json();
  },

  async createAddress(addressData: Omit<Address, 'id' | 'userId'>): Promise<Address> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/users/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create address');
    }

    return response.json();
  },

  async updateAddress(id: string, addressData: Partial<Address>): Promise<Address> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/users/addresses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update address');
    }

    return response.json();
  },

  async deleteAddress(id: string): Promise<void> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/users/addresses/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete address');
    }
  },

  async setDefaultAddress(id: string, type: 'shipping' | 'billing'): Promise<Address> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/users/addresses/${id}/default`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to set default address');
    }

    return response.json();
  },
}; 