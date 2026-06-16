import axios from 'axios';
import { useStore } from '../store/useStore';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  // Use Zustand store directly or fetch from localStorage
  // Since we are outside React, we get state from the store directly
  const state = useStore.getState();
  const token = state.jwtToken || (typeof window !== 'undefined' ? localStorage.getItem('deepshield_jwt') : null);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data.data || response.data,
  (error) => {
    let message = 'Unknown API Error';
    if (error.response?.data && typeof error.response.data === 'object' && Object.keys(error.response.data).length > 0) {
      message = JSON.stringify(error.response.data);
    } else if (error.response?.data && typeof error.response.data === 'string') {
      message = error.response.data;
    } else if (error.message) {
      message = error.message;
    }
    
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);
