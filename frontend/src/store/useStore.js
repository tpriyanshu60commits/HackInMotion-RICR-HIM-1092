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
      
      currentAQI: 50, // mock value
      setCurrentAQI: (aqi) => set({ currentAQI: aqi }),
      
      currentTemp: 25, // mock value
      setCurrentTemp: (temp) => set({ currentTemp: temp }),
      
      // Health Profile State
      userName: '',
      setUserName: (name) => set({ userName: name }),
      
      userAge: '',
      setUserAge: (age) => set({ userAge: age }),
      
      diagnosedConditions: [],
      setDiagnosedConditions: (conditions) => set({ diagnosedConditions: conditions }),
      
      prescribedMedication: [],
      setPrescribedMedication: (meds) => set({ prescribedMedication: meds }),
      
      lastCheckupDate: '',
      setLastCheckupDate: (date) => set({ lastCheckupDate: date }),
      
      wearableConnected: false,
      setWearableConnected: (connected) => set({ wearableConnected: connected }),
      
      isMuted: false,
      setIsMuted: (isMuted) => set({ isMuted }),
      
      voiceAlertsEnabled: false,
      setVoiceAlertsEnabled: (enabled) => set({ voiceAlertsEnabled: enabled }),
      
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      
      temperatureUnit: 'celsius',
      setTemperatureUnit: (unit) => set({ temperatureUnit: unit }),
      
      location: null,
      setLocation: (location) => set({ location }),
      
      savedLocations: [],
      addSavedLocation: (loc) => set((state) => ({ savedLocations: [...state.savedLocations, loc] })),
      removeSavedLocation: (id) => set((state) => ({ savedLocations: state.savedLocations.filter(l => l.id !== id) })),
      
      alerts: [],
      addAlert: (alert) => set((state) => ({ 
        alerts: [{ ...alert, read: false, id: Date.now().toString() }, ...state.alerts] 
      })),
      markAlertRead: (id) => set((state) => ({
        alerts: state.alerts.map(a => a.id === id ? { ...a, read: true } : a)
      })),
      markAllAlertsRead: () => set((state) => ({
        alerts: state.alerts.map(a => ({ ...a, read: true }))
      })),
      clearAllAlerts: () => set({ alerts: [] }),
    }),
    {
      name: 'env-storage',
    }
  )
);

export default useStore;
