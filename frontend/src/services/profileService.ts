import { User, UserProfile } from '@/types';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch profile');
    }

    return response.json().then(data => data.data);
  },

  async updateProfile(profileData: Partial<User>): Promise<User> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return response.json().then(data => data.data);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/users/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change password');
    }
  },
}; 