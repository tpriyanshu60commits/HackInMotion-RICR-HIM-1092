import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const locationService = {
  search: (query) => api.get(`/locations/search?q=${query}`),
  getSaved: () => api.get('/locations/saved'),
  save: (data) => api.post('/locations/saved', data),
};

export const airQualityService = {
  getCurrent: (lat, lng) => api.get(`/air-quality/current?lat=${lat}&lng=${lng}`),
  getForecast: (lat, lng) => api.get(`/air-quality/forecast?lat=${lat}&lng=${lng}`),
  getHistory: (lat, lng, range) => api.get(`/air-quality/history?lat=${lat}&lng=${lng}&range=${range}`),
};

export const profileService = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
};

export default api;
