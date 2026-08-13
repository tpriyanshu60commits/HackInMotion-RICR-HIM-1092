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
  getSaved: () => api.get('/locations'),
  save: (data) => api.post('/locations', {
    name: data.name,
    city: data.city,
    area: data.area,
    country: data.country,
    latitude: data.latitude,
    longitude: data.longitude,
    locationType: data.locationType || 'other',
  }),
  delete: (id) => api.delete(`/locations/${id}`),
};

export const environmentService = {
  getCurrentByCoords: (lat, lng) => api.get(`/environment/current?lat=${lat}&lng=${lng}`),
  getCurrentByCity: (city) => api.get(`/environment/city?city=${city}`),
  getHistory: async (lat, lng, days) => {
    const response = await api.get('/environment/history', {
      params: { lat, lng, days }
    });
    return response.data;
  },
  compareCities: (cities) => api.get(`/environment/compare?cities=${cities}`),
};

export const profileService = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
};

export const aiService = {
  ask: (data) => api.post('/ai/ask', data),
  getHistory: () => api.get('/ai/history'),
  clearHistory: () => api.delete('/ai/history'),
};

export default api;
