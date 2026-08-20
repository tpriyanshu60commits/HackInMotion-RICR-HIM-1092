import axios from 'axios';
import { calculateBaseRisk, getPersonalizedRisk } from './riskEngine.js';
import AirQualitySnapshot from '../models/AirQualitySnapshot.js';
import { geocodeCity, reverseGeocode } from './geocodingService.js';

/**
 * Calculate US AQI from PM2.5 using EPA breakpoints.
 */
const calculatePM25_AQI = (pm25) => {
  if (pm25 === undefined || pm25 === null || Number.isNaN(Number(pm25))) {
    return 0;
  }

  const c = Math.floor(Number(pm25) * 10) / 10;

  let IHigh;
  let ILow;
  let CHigh;
  let CLow;

  if (c >= 0 && c <= 12.0) {
    IHigh = 50;
    ILow = 0;
    CHigh = 12.0;
    CLow = 0.0;
  } else if (c >= 12.1 && c <= 35.4) {
    IHigh = 100;
    ILow = 51;
    CHigh = 35.4;
    CLow = 12.1;
  } else if (c >= 35.5 && c <= 55.4) {
    IHigh = 150;
    ILow = 101;
    CHigh = 55.4;
    CLow = 35.5;
  } else if (c >= 55.5 && c <= 150.4) {
    IHigh = 200;
    ILow = 151;
    CHigh = 150.4;
    CLow = 55.5;
  } else if (c >= 150.5 && c <= 250.4) {
    IHigh = 300;
    ILow = 201;
    CHigh = 250.4;
    CLow = 150.5;
  } else if (c >= 250.5 && c <= 350.4) {
    IHigh = 400;
    ILow = 301;
    CHigh = 350.4;
    CLow = 250.5;
  } else if (c >= 350.5 && c <= 500.4) {
    IHigh = 500;
    ILow = 401;
    CHigh = 500.4;
    CLow = 350.5;
  } else {
    return 500;
  }

  return Math.round(((IHigh - ILow) / (CHigh - CLow)) * (c - CLow) + ILow);
};

/**
 * Calculate US AQI from PM10 using EPA breakpoints.
 */
const calculatePM10_AQI = (pm10) => {
  if (pm10 === undefined || pm10 === null || Number.isNaN(Number(pm10))) {
    return 0;
  }

  const c = Math.floor(Number(pm10));

  let IHigh;
  let ILow;
  let CHigh;
  let CLow;

  if (c >= 0 && c <= 54) {
    IHigh = 50;
    ILow = 0;
    CHigh = 54;
    CLow = 0;
  } else if (c >= 55 && c <= 154) {
    IHigh = 100;
    ILow = 51;
    CHigh = 154;
    CLow = 55;
  } else if (c >= 155 && c <= 254) {
    IHigh = 150;
    ILow = 101;
    CHigh = 254;
    CLow = 155;
  } else if (c >= 255 && c <= 354) {
    IHigh = 200;
    ILow = 151;
    CHigh = 354;
    CLow = 255;
  } else if (c >= 355 && c <= 424) {
    IHigh = 300;
    ILow = 201;
    CHigh = 424;
    CLow = 355;
  } else if (c >= 425 && c <= 504) {
    IHigh = 400;
    ILow = 301;
    CHigh = 504;
    CLow = 425;
  } else if (c >= 505 && c <= 604) {
    IHigh = 500;
    ILow = 401;
    CHigh = 604;
    CLow = 505;
  } else {
    return 500;
  }

  return Math.round(((IHigh - ILow) / (CHigh - CLow)) * (c - CLow) + ILow);
};

/**
 * Normalize Open-Meteo environmental data into the application's format.
 */
const normalizeOpenMeteoData = (data, locationInfo, healthProfile = null, uvData = null) => {
  const currentAirQuality = data?.airQuality?.current;
  const currentWeather = data?.weather?.current;
  const dailyWeather = data?.weather?.daily;

  if (!currentAirQuality || !currentWeather) {
    throw new Error('Incomplete environmental data received from Open-Meteo.');
  }

  const calculatedPm25Aqi = calculatePM25_AQI(currentAirQuality.pm2_5);
  const calculatedPm10Aqi = calculatePM10_AQI(currentAirQuality.pm10);

  const openMeteoAqi = Number(currentAirQuality.us_aqi);

  /*
   * Use the highest valid AQI value.
   *
   * PM2.5 and PM10 are independently converted to US AQI.
   * Open-Meteo's provided US AQI is also considered as a fallback/reference.
   */
  const validAqiValues = [
    calculatedPm25Aqi,
    calculatedPm10Aqi,
    Number.isFinite(openMeteoAqi) ? openMeteoAqi : 0,
  ].filter((value) => value > 0);

  const aqi = validAqiValues.length > 0 ? Math.max(...validAqiValues) : 0;

  const baseRisk = calculateBaseRisk(aqi);
  const personalizedRisk = getPersonalizedRisk(baseRisk, healthProfile);

  const externalUvIndex = Number(uvData?.now?.uvi);

  const openMeteoUvIndex = Number(currentWeather?.uv_index);

  let uvIndex = null;

  if (Number.isFinite(externalUvIndex)) {
    uvIndex = externalUvIndex;
  } else if (Number.isFinite(openMeteoUvIndex)) {
    uvIndex = openMeteoUvIndex;
  }

  return {
    aqi,
    pm25: currentAirQuality.pm2_5 ?? null,
    pm10: currentAirQuality.pm10 ?? null,
    co: currentAirQuality.carbon_monoxide ?? null,
    no2: currentAirQuality.nitrogen_dioxide ?? null,
    so2: currentAirQuality.sulphur_dioxide ?? null,
    o3: currentAirQuality.ozone ?? null,

    temperature: currentWeather.temperature_2m ?? null,
    feelsLike: currentWeather.apparent_temperature ?? null,
    humidity: currentWeather.relative_humidity_2m ?? null,
    wind: currentWeather.wind_speed_10m ?? null,
    pressure: currentWeather.surface_pressure ?? null,
    precipitation: currentWeather.precipitation ?? null,

    weatherCode: currentWeather.weather_code ?? null,
    isDay: currentWeather.is_day === 1,

    uvIndex,

    sunrise: dailyWeather?.sunrise?.[0] ?? null,
    sunset: dailyWeather?.sunset?.[0] ?? null,

    risk: personalizedRisk,

    city: locationInfo?.city ?? locationInfo?.name ?? null,
    country: locationInfo?.country ?? null,

    latitude: data?.weather?.latitude ?? null,
    longitude: data?.weather?.longitude ?? null,

    timestamp: new Date(),
  };
};

/**
 * Axios GET request with retry support and exponential backoff.
 * - Does NOT retry on 429 (Too Many Requests) — retrying makes it worse.
 * - Uses exponential backoff with jitter for other transient errors.
 */
const axiosGetWithRetry = async (url, options = {}, retries = 2) => {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await axios.get(url, {
        timeout: 15000,
        ...options,
      });
    } catch (error) {
      lastError = error;

      // Do NOT retry on rate-limit errors — it only makes things worse
      const status = error?.response?.status;
      if (status === 429) {
        console.warn(`Open-Meteo rate limit hit (429). Skipping retries for: ${url.split('?')[0]}`);
        throw error;
      }

      if (attempt < retries) {
        // Exponential backoff with jitter: base * 2^attempt + random ms
        const backoff = 600 * Math.pow(2, attempt) + Math.random() * 300;
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    }
  }

  throw lastError;
};

/**
 * Get current environmental data using latitude and longitude.
 */
export const getAirQualityByCoordinates = async (lat, lng, healthProfile = null) => {
  try {
    const latitude = Number(lat);
    const longitude = Number(lng);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new Error('Invalid latitude or longitude.');
    }

    const locationInfo = await reverseGeocode(latitude, longitude);

    const airQualityUrl =
      `https://air-quality-api.open-meteo.com/v1/air-quality` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone` +
      `&timezone=auto`;

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,is_day` +
      `&daily=weather_code,sunrise,sunset,uv_index_max` +
      `&timezone=auto`;

    const uvUrl =
      `https://currentuvindex.com/api/v1/uvi` + `?latitude=${latitude}&longitude=${longitude}`;

    const [airQualityResult, weatherResult, uvResult] = await Promise.allSettled([
      axiosGetWithRetry(airQualityUrl),
      axiosGetWithRetry(weatherUrl),
      axiosGetWithRetry(uvUrl, {}, 1),
    ]);

    if (airQualityResult.status === 'rejected') {
      throw airQualityResult.reason;
    }

    if (weatherResult.status === 'rejected') {
      throw weatherResult.reason;
    }

    const airQualityResponse = airQualityResult.value;
    const weatherResponse = weatherResult.value;

    const uvData = uvResult.status === 'fulfilled' ? uvResult.value?.data : null;

    const data = {
      airQuality: airQualityResponse.data,
      weather: weatherResponse.data,
    };

    const normalizedData = normalizeOpenMeteoData(data, locationInfo, healthProfile, uvData);

    saveSnapshot(normalizedData).catch((error) => {
      console.error('Snapshot save error:', error.message);
    });

    return normalizedData;
  } catch (error) {
    console.error('Open-Meteo API Error:', error.message);

    throw new Error('Environmental data currently unavailable for this location.');
  }
};

/**
 * Get current environmental data by city name.
 */
export const getAirQualityByCity = async (city, healthProfile = null) => {
  try {
    if (!city || typeof city !== 'string' || !city.trim()) {
      throw new Error('City name is required.');
    }

    const geo = await geocodeCity(city.trim());

    if (!geo?.lat || !geo?.lng) {
      throw new Error(`Unable to locate city: ${city}`);
    }

    const data = await getAirQualityByCoordinates(geo.lat, geo.lng, healthProfile);

    data.city = geo.city || geo.name?.split(',')?.[0]?.trim() || city.trim();

    if (geo.country) {
      data.country = geo.country;
    }

    return data;
  } catch (error) {
    console.error('City lookup error:', error.message);

    throw new Error(`Environmental data currently unavailable for "${city}".`);
  }
};

/**
 * Save the latest environmental snapshot into MongoDB.
 */
const saveSnapshot = async (data, locationId = null) => {
  try {
    if (!data) {
      return;
    }

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

      riskLevel: data.risk?.riskLevel ?? null,

      timestamp: data.timestamp || new Date(),
    });
  } catch (error) {
    console.error('Failed to save snapshot:', error.message);
  }
};

/**
 * Get historical air-quality data for the requested number of days.
 *
 * Open-Meteo returns hourly data. This function converts it
 * into daily averages for AQI, PM2.5 and PM10.
 */
export const getHistoricalData = async (lat, lng, days = 7) => {
  try {
    const latitude = Number(lat);
    const longitude = Number(lng);
    const requestedDays = Math.min(Math.max(Number(days) || 7, 1), 92);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new Error('Invalid latitude or longitude.');
    }

    const url =
      `https://air-quality-api.open-meteo.com/v1/air-quality` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&hourly=us_aqi,pm10,pm2_5` +
      `&past_days=${requestedDays}` +
      `&timezone=auto`;

    const response = await axiosGetWithRetry(url);
    const hourly = response?.data?.hourly;

    if (!hourly?.time) {
      throw new Error('Invalid historical air-quality response.');
    }

    const dailyData = {};

    hourly.time.forEach((timeStr, index) => {
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

      const usAqi = hourly.us_aqi?.[index];
      const pm25 = hourly.pm2_5?.[index];
      const pm10 = hourly.pm10?.[index];

      if (usAqi !== null && usAqi !== undefined) {
        dailyData[dateOnly].aqiSum += Number(usAqi);
        dailyData[dateOnly].aqiCount += 1;
      }

      if (pm25 !== null && pm25 !== undefined) {
        dailyData[dateOnly].pm25Sum += Number(pm25);
        dailyData[dateOnly].pm25Count += 1;
      }

      if (pm10 !== null && pm10 !== undefined) {
        dailyData[dateOnly].pm10Sum += Number(pm10);
        dailyData[dateOnly].pm10Count += 1;
      }
    });

    const result = Object.keys(dailyData)
      .sort()
      .map((dateStr) => {
        const daily = dailyData[dateStr];

        const dateObj = new Date(`${dateStr}T12:00:00Z`);

        const name = dateObj.toLocaleDateString('en-US', {
          weekday: 'short',
          timeZone: 'UTC',
        });

        return {
          name,
          date: dateStr,

          aqi: daily.aqiCount > 0 ? Math.round(daily.aqiSum / daily.aqiCount) : 0,

          pm25: daily.pm25Count > 0 ? Math.round((daily.pm25Sum / daily.pm25Count) * 10) / 10 : 0,

          pm10: daily.pm10Count > 0 ? Math.round((daily.pm10Sum / daily.pm10Count) * 10) / 10 : 0,
        };
      });

    return result;
  } catch (error) {
    console.error('Failed to fetch historical air quality data:', error.message);

    throw new Error('Failed to fetch historical air quality data.');
  }
};
