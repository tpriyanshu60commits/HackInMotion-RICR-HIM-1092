import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),

      user: null,
      isAuthenticated: false,
      isInitializing: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setInitializing: (isInitializing) => set({ isInitializing }),
      logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, isAuthenticated: false });
      },


      weatherCondition: 'clear',
      setWeatherCondition: (condition) => set({ weatherCondition: condition }),
      
      location: null,
      setLocation: (location) => set({ location }),
      
      savedLocations: [],
      addSavedLocation: (loc) => set((state) => ({ savedLocations: [...state.savedLocations, loc] })),
      removeSavedLocation: (id) => set((state) => ({ savedLocations: state.savedLocations.filter(l => l.id !== id) })),
      
      alerts: [],
      addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
      markAlertRead: (id) => set((state) => ({
        alerts: state.alerts.map(a => a.id === id ? { ...a, read: true } : a)
      })),
    }),
    {
      name: 'env-storage',
    }
  )
);

export default useStore;
