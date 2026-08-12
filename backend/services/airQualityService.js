import axios from 'axios';
import { calculateBaseRisk, getPersonalizedRisk } from './riskEngine.js';
import AirQualitySnapshot from '../models/AirQualitySnapshot.js';
import { geocodeCity, reverseGeocode } from './geocodingService.js';

const normalizeOpenMeteoData = (data, locationInfo, healthProfile = null) => {
  const currentAirQuality = data.airQuality.current;
  const currentWeather = data.weather.current;
  const dailyWeather = data.weather.daily;
  
  // Map Open-Meteo European AQI (0-100+) to a standard 0-500 US AQI scale roughly
  // Open-Meteo returns US AQI in the hourly array, but for current we can use pm2.5 to estimate AQI,
  // Or better, OpenMeteo provides US AQI in current if requested.
  // I requested it in the URL below.
  const aqi = currentAirQuality.us_aqi || 50; 
  
  const baseRisk = calculateBaseRisk(aqi);
  const personalizedRisk = getPersonalizedRisk(baseRisk, healthProfile);

  return {
    aqi: aqi,
    pm25: currentAirQuality.pm2_5,
    pm10: currentAirQuality.pm10,
    co: currentAirQuality.carbon_monoxide,
    no2: currentAirQuality.nitrogen_dioxide,
    so2: currentAirQuality.sulphur_dioxide,
    o3: currentAirQuality.ozone,
    temperature: currentWeather.temperature_2m,
    feelsLike: currentWeather.apparent_temperature,
    humidity: currentWeather.relative_humidity_2m,
    wind: currentWeather.wind_speed_10m,
    pressure: currentWeather.surface_pressure,
    precipitation: currentWeather.precipitation,
    weatherCode: currentWeather.weather_code,
    uvIndex: dailyWeather?.uv_index_max?.[0] || 0,
    sunrise: dailyWeather?.sunrise?.[0] || null,
    sunset: dailyWeather?.sunset?.[0] || null,
    risk: personalizedRisk,
    city: locationInfo.city,
    country: locationInfo.country,
    latitude: data.weather.latitude,
    longitude: data.weather.longitude,
    timestamp: new Date(),
  };
};

export const getAirQualityByCoordinates = async (lat, lng, healthProfile = null) => {
  try {
    const locationInfo = await reverseGeocode(lat, lng);

    const [airQualityResponse, weatherResponse] = await Promise.all([
      axios.get(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`),
      axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m&daily=weather_code,sunrise,sunset,uv_index_max&timezone=auto`)
    ]);

    const data = {
      airQuality: airQualityResponse.data,
      weather: weatherResponse.data
    };

    const normalizedData = normalizeOpenMeteoData(data, locationInfo, healthProfile);
    saveSnapshot(normalizedData).catch(console.error);
    return normalizedData;
  } catch (error) {
    console.error('Open-Meteo API Error:', error.message);
    throw new Error('Environmental data currently unavailable for this location.');
  }
};

export const getAirQualityByCity = async (city, healthProfile = null) => {
  try {
    const geo = await geocodeCity(city);
    return await getAirQualityByCoordinates(geo.lat, geo.lng, healthProfile);
  } catch (error) {
    console.error('City lookup error:', error.message);
    throw new Error('Environmental data currently unavailable for this city.');
  }
};

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

export const getHistoricalData = async (lat, lng, days = 7) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const history = await AirQualitySnapshot.find({
    latitude: { $gte: lat - 0.1, $lte: lat + 0.1 },
    longitude: { $gte: lng - 0.1, $lte: lng + 0.1 },
    timestamp: { $gte: cutoffDate },
  }).sort({ timestamp: 1 });

  return history;
};
