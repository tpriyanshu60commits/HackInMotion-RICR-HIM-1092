import axios from 'axios';

export const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  // If the user set VITE_API_URL to the root domain, ensure it ends with /api
  if (!url.endsWith('/api')) {
    // Trim trailing slash if present before adding /api
    return `${url.replace(/\/$/, '')}/api`;
  }
  return url;
};

export const API_BASE_URL = getApiBaseUrl();

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register' &&
        window.location.pathname !== '/'
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const locationService = {
  search: (query) => api.get(`/locations/search?q=${query}`),

  getSaved: () => api.get('/locations'),

  save: (data) =>
    api.post('/locations', {
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

  getForecast: (lat, lng) => api.get(`/data/forecast?lat=${lat}&lng=${lng}`),

  getSnapshots: (locationId, range) => api.get(`/snapshots/${locationId}?range=${range}`),

  searchGeocoding: (query) => api.get(`/data/search?q=${encodeURIComponent(query)}`),

  getHistory: async (lat, lng, days) => {
    const response = await api.get('/environment/history', {
      params: {
        lat,
        lng,
        days,
      },
    });

    return response.data;
  },

  compareCities: (cities) => api.get(`/environment/compare?cities=${cities}`),
};

export const profileAPI = {
  getProfile: () => api.get('/v1/profile'),

  updateBasicProfile: (data) => api.put('/v1/profile', data),

  getHealthProfile: () => api.get('/v1/profile/health'),

  updateHealthProfile: (data) => api.put('/v1/profile/health', data),

  getNotificationSettings: () => api.get('/v1/profile/notifications'),

  updateNotificationSettings: (data) => api.put('/v1/profile/notifications', data),

  getPreferences: () => api.get('/v1/profile/preferences'),

  updatePreferences: (data) => api.put('/v1/profile/preferences', data),

  getPrivacySettings: () => api.get('/v1/profile/privacy'),

  updatePrivacySettings: (data) => api.put('/v1/profile/privacy', data),
};

export const aiService = {
  ask: (data) => api.post('/ai/ask', data),

  getHistory: () => api.get('/ai/history'),

  clearHistory: () => api.delete('/ai/history'),
};

// AG07 - Alerts
export const alertService = {
  getAlerts: () => api.get('/alerts'),

  markAsRead: (id) => api.put(`/alerts/${id}/read`),

  deleteAlert: (id) => api.delete(`/alerts/${id}`),
};

// Master - Extended User Profile
export const usersAPI = {
  updateExtendedProfile: (data) => api.patch('/users/profile', data),
  uploadProfileImage: (formData) =>
    api.post('/users/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteAccount: () => api.delete('/users/me'),
};

// Master - Health Reports
export const healthAPI = {
  uploadHealthReport: (formData) =>
    api.post('/health/report', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  downloadReportPDF: () =>
    api.get('/health/report/pdf', {
      responseType: 'blob',
    }),
};

// Master - AI Health Reports
export const aiHealthAPI = {
  saveHealthProfile: (data) => api.post('/ai-health/profile', data),
  getHealthProfile: () => api.get('/ai-health/profile'),
  generateHealthReport: (data) => api.post('/ai-health/report/generate', data),
  getLatestHealthReport: () => api.get('/ai-health/report/latest'),
};

export default api;
