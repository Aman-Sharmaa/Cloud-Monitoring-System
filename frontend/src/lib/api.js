import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Metrics API
export const metricsAPI = {
  getDashboard: async (provider = 'all') => {
    const response = await api.get(`/metrics/dashboard?provider=${provider}`);
    return response.data;
  },
  getBilling: async (provider, days = 7) => {
    const response = await api.get(`/metrics/${provider}/billing?days=${days}`);
    return response.data;
  },
  getResources: async (provider, days = 7) => {
    const response = await api.get(`/metrics/${provider}/resources?days=${days}`);
    return response.data;
  },
  getPerformance: async (provider, days = 7) => {
    const response = await api.get(`/metrics/${provider}/performance?days=${days}`);
    return response.data;
  },
  getAllMetrics: async (provider, days = 7, type = null) => {
    const typeParam = type ? `&type=${type}` : '';
    const response = await api.get(`/metrics/${provider}/all?days=${days}${typeParam}`);
    return response.data;
  },
  seedMetrics: async () => {
    const response = await api.post('/metrics/seed');
    return response.data;
  },
  clearMetrics: async () => {
    const response = await api.delete('/metrics/clear');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
  updatePassword: async (passwordData) => {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  },
  updateSettings: async (settings) => {
    const response = await api.put('/users/settings', settings);
    return response.data;
  },
  getAlerts: async (resolved = null, limit = 50) => {
    const resolvedParam = resolved !== null ? `?resolved=${resolved}` : '';
    const limitParam = resolvedParam ? `&limit=${limit}` : `?limit=${limit}`;
    const response = await api.get(`/users/alerts${resolvedParam}${limitParam}`);
    return response.data;
  },
  createAlert: async (alertData) => {
    const response = await api.post('/users/alerts', alertData);
    return response.data;
  },
  resolveAlert: async (alertId) => {
    const response = await api.put(`/users/alerts/${alertId}/resolve`);
    return response.data;
  },
  deleteAlert: async (alertId) => {
    const response = await api.delete(`/users/alerts/${alertId}`);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },
};

export default api;

