import axios from 'axios';
import { calculateBaseRisk, getPersonalizedRisk } from './riskEngine.js';
import AirQualitySnapshot from '../models/AirQualitySnapshot.js';

/**
 * Normalizes WAQI data into our standardized format
 */
const normalizeWaqiData = (data, healthProfile = null) => {
  const iaqi = data.iaqi || {};
  const aqi = data.aqi;
  
  const baseRisk = calculateBaseRisk(aqi);
  const personalizedRisk = getPersonalizedRisk(baseRisk, healthProfile);

  return {
    aqi: aqi,
    pm25: iaqi.pm25 ? iaqi.pm25.v : null,
    pm10: iaqi.pm10 ? iaqi.pm10.v : null,
    co: iaqi.co ? iaqi.co.v : null,
    no2: iaqi.no2 ? iaqi.no2.v : null,
    so2: iaqi.so2 ? iaqi.so2.v : null,
    o3: iaqi.o3 ? iaqi.o3.v : null,
    temperature: iaqi.t ? iaqi.t.v : null,
    humidity: iaqi.h ? iaqi.h.v : null,
    wind: iaqi.w ? iaqi.w.v : null,
    risk: personalizedRisk,
    city: data.city.name,
    latitude: data.city.geo[0],
    longitude: data.city.geo[1],
    timestamp: data.time ? new Date(data.time.iso) : new Date(),
  };
};

/**
 * Get current air quality by coordinates
 */
export const getAirQualityByCoordinates = async (lat, lng, healthProfile = null) => {
  try {
    const token = process.env.ENVIRONMENT_API_KEY;
    const baseUrl = process.env.ENVIRONMENT_API_BASE_URL || 'https://api.waqi.info/';
    
    // WAQI endpoint: /feed/geo:lat;lng/?token=
    const response = await axios.get(`${baseUrl}feed/geo:${lat};${lng}/?token=${token}`);
    
    if (response.data.status !== 'ok') {
      throw new Error(response.data.data || 'Failed to fetch environmental data');
    }

    const normalizedData = normalizeWaqiData(response.data.data, healthProfile);
    
    // Optionally save snapshot in background
    saveSnapshot(normalizedData).catch(console.error);

    return normalizedData;
  } catch (error) {
    console.error('Air Quality API Error:', error.message);
    throw new Error('Environmental data currently unavailable for this location.');
  }
};

/**
 * Get current air quality by city name
 */
export const getAirQualityByCity = async (city, healthProfile = null) => {
  try {
    const token = process.env.ENVIRONMENT_API_KEY;
    const baseUrl = process.env.ENVIRONMENT_API_BASE_URL || 'https://api.waqi.info/';
    
    const response = await axios.get(`${baseUrl}feed/${encodeURIComponent(city)}/?token=${token}`);
    
    if (response.data.status !== 'ok') {
      throw new Error(response.data.data || 'Failed to fetch environmental data');
    }

    const normalizedData = normalizeWaqiData(response.data.data, healthProfile);
    
    saveSnapshot(normalizedData).catch(console.error);

    return normalizedData;
  } catch (error) {
    console.error('Air Quality API Error:', error.message);
    throw new Error('Environmental data currently unavailable for this city.');
  }
};

/**
 * Save snapshot to database
 */
const saveSnapshot = async (data, locationId = null) => {
  try {
    await AirQualitySnapshot.create({
      locationId,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      aqi: data.aqi,
      pm25: data.pm25,
      pm10: data.pm10,
      co: data.co,
      no2: data.no2,
      so2: data.so2,
      o3: data.o3,
      temperature: data.temperature,
      humidity: data.humidity,
      wind: data.wind,
      riskLevel: data.risk.riskLevel,
      timestamp: data.timestamp,
    });
  } catch (error) {
    console.error('Failed to save snapshot:', error.message);
  }
};

/**
 * Get Historical Data (Dummy for now, normally queries AirQualitySnapshot)
 * In a real scenario with AQICN, historical data requires an enterprise plan or we rely on our own collected snapshots.
 */
export const getHistoricalData = async (lat, lng, days = 7) => {
  // Since we might not have enough snapshots initially, return what we have
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const history = await AirQualitySnapshot.find({
    latitude: { $gte: lat - 0.1, $lte: lat + 0.1 },
    longitude: { $gte: lng - 0.1, $lte: lng + 0.1 },
    timestamp: { $gte: cutoffDate },
  }).sort({ timestamp: 1 });

  return history;
};
