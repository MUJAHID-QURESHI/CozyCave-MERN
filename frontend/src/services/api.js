import axios from 'axios';

// Create basic API service prepared for future backend integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor (e.g. for attaching JWT tokens in the future)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cozycave_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
