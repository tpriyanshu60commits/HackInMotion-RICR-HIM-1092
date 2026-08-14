import { useState, useCallback, useEffect } from 'react';
import { locationService, environmentService } from '../services/api';
import useStore from '../store/useStore';
import { io } from 'socket.io-client';

const getWeatherInfo = (code) => {
  if (code === 0) return { condition: 'Clear', icon: 'Sun' };
  if (code > 0 && code <= 3) return { condition: 'Cloudy', icon: 'Cloud' };
  if (code === 45 || code === 48) return { condition: 'Haze', icon: 'CloudFog' };
  if (code >= 51 && code <= 67) return { condition: 'Rain', icon: 'CloudRain' };
  if (code >= 71 && code <= 77) return { condition: 'Snow', icon: 'Cloud' };
  if (code >= 80 && code <= 99) return { condition: 'Storm', icon: 'CloudRain' };
  return { condition: 'Unknown', icon: 'Cloud' };
};

const getAqiStatus = (aqi) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

export function useSavedLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useStore((state) => state.user);

  useEffect(() => {
    if (!user?._id) return;

    const socket = io(
      import.meta.env.VITE_API_BASE_URL
        ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
        : 'http://localhost:5000',
      {
        withCredentials: true,
      }
    );

    socket.emit('join', user._id);

    socket.on('location:update', ({ locationId, data }) => {
      setLocations((prevLocs) =>
        prevLocs.map((loc) => {
          if (loc.id === locationId || loc.id === locationId.toString()) {
            return {
              ...loc,
              aqi: data.aqi,
              status: getAqiStatus(data.aqi),
              temperature: data.temperature ? Math.round(data.temperature) : loc.temperature,
              condition: data.weather || loc.condition,
            };
          }
          return loc;
        })
      );
    });

    return () => socket.disconnect();
  }, [user?._id]);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch saved locations from DB
      const dbRes = await locationService.getSaved();
      // Handle standard response shapes: dbRes.data.data is used by our backend controllers
      const savedLocs = dbRes.data?.data || dbRes.data || [];

      // 2. Fetch live data for each location
      const enrichedLocs = await Promise.all(
        savedLocs.map(async (loc) => {
          try {
            const envRes = await environmentService.getCurrentByCoords(loc.latitude, loc.longitude);
            const envData = envRes.data?.data || envRes.data || {};

            const weather = getWeatherInfo(envData.weatherCode || 0);

            return {
              id: loc._id || loc.id,
              name: loc.name,
              city: loc.city,
              country: loc.country,
              locationType: loc.locationType,
              latitude: loc.latitude,
              longitude: loc.longitude,
              aqi: envData.aqi || 0,
              status: getAqiStatus(envData.aqi || 0),
              temperature: Math.round(envData.temperature || 0),
              condition: weather.condition,
              icon: weather.icon,
            };
          } catch (err) {
            console.error(`Failed to fetch live data for ${loc.name}`, err);
            // Return fallback if live data fails so the location still renders
            return {
              id: loc._id || loc.id,
              name: loc.name,
              city: loc.city,
              country: loc.country,
              locationType: loc.locationType,
              latitude: loc.latitude,
              longitude: loc.longitude,
              aqi: 0,
              status: 'Unknown',
              temperature: 0,
              condition: 'Unknown',
              icon: 'Cloud',
            };
          }
        })
      );

      setLocations(enrichedLocs);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch saved locations');
    } finally {
      setLoading(false);
    }
  }, []);

  const addLocation = async (data) => {
    setLoading(true);
    try {
      const res = await locationService.save(data);
      if (res.data) {
        await fetchLocations(); // Re-fetch all to get live data for the new one
        return { success: true, data: res.data };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save location';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const removeLocation = async (id) => {
    setLoading(true);
    try {
      await locationService.delete(id);
      await fetchLocations();
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete location';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    locations,
    loading,
    error,
    fetchLocations,
    addLocation,
    removeLocation,
  };
}
