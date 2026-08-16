import axios from 'axios';
import { calculateBaseRisk, getPersonalizedRisk } from './riskEngine.js';
import AirQualitySnapshot from '../models/AirQualitySnapshot.js';
import { geocodeCity, reverseGeocode } from './geocodingService.js';

const normalizeOpenMeteoData = (data, locationInfo, healthProfile = null, uvData = null) => {
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
    isDay: currentWeather.is_day === 1,
    uvIndex: uvData?.now?.uvi !== undefined ? uvData.now.uvi : (currentWeather.uv_index !== undefined ? currentWeather.uv_index : null),
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

    const [airQualityResponse, weatherResponse, uvResponse] = await Promise.all([
      axios.get(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`
      ),
      axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,is_day&daily=weather_code,sunrise,sunset,uv_index_max&timezone=auto`
      ),
      axios.get(
        `https://currentuvindex.com/api/v1/uvi?latitude=${lat}&longitude=${lng}`
      ).catch(() => ({ data: null })), // Fallback gracefully if UV API fails
    ]);

    const data = {
      airQuality: airQualityResponse.data,
      weather: weatherResponse.data,
    };

    const normalizedData = normalizeOpenMeteoData(data, locationInfo, healthProfile, uvResponse.data);
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
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&hourly=us_aqi,pm10,pm2_5&past_days=${days}`;
    const response = await axios.get(url);
    const hourly = response.data.hourly;

    const dailyData = {};

    hourly.time.forEach((timeStr, i) => {
      const dateOnly = timeStr.split('T')[0];

      if (!dailyData[dateOnly]) {
        dailyData[dateOnly] = {
          aqiSum: 0,
          aqiCount: 0,
          pm25Sum: 0,
          pm25Count: 0,
          pm10Sum: 0,
          pm10Count: 0,
        };
      }

      if (hourly.us_aqi[i] != null) {
        dailyData[dateOnly].aqiSum += hourly.us_aqi[i];
        dailyData[dateOnly].aqiCount++;
      }
      if (hourly.pm2_5[i] != null) {
        dailyData[dateOnly].pm25Sum += hourly.pm2_5[i];
        dailyData[dateOnly].pm25Count++;
      }
      if (hourly.pm10[i] != null) {
        dailyData[dateOnly].pm10Sum += hourly.pm10[i];
        dailyData[dateOnly].pm10Count++;
      }
    });

    const result = Object.keys(dailyData).map((dateStr) => {
      const data = dailyData[dateStr];
      const dateObj = new Date(dateStr + 'T12:00:00Z'); // Safe mid-day UTC parsing
      const name = dateObj.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });

      return {
        name,
        date: dateStr,
        aqi: data.aqiCount > 0 ? Math.round(data.aqiSum / data.aqiCount) : 0,
        pm25: data.pm25Count > 0 ? Math.round(data.pm25Sum / data.pm25Count) : 0,
        pm10: data.pm10Count > 0 ? Math.round(data.pm10Sum / data.pm10Count) : 0,
      };
    });

    return result;
  } catch (error) {
    console.error('Failed to fetch historical air quality data:', error.message);
    throw new Error('Failed to fetch historical air quality data');
  }
};
