import axios from 'axios';

const geocodeCache = new Map();
const reverseGeocodeCache = new Map();

/**
 * Resolve coordinates and metadata for a given city name
 */
export const geocodeCity = async (city) => {
  if (!city || typeof city !== 'string' || !city.trim()) {
    throw new Error('City name is required');
  }

  const normalizedKey = city.trim().toLowerCase();
  if (geocodeCache.has(normalizedKey)) {
    return geocodeCache.get(normalizedKey);
  }

  // Tier 1: Open-Meteo Geocoding API (Fast, Free, No rate limit)
  try {
    const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: {
        name: city.trim(),
        count: 1,
        language: 'en',
        format: 'json',
      },
      timeout: 5000,
    });

    if (response.data?.results && response.data.results.length > 0) {
      const item = response.data.results[0];
      const result = {
        lat: parseFloat(item.latitude),
        lng: parseFloat(item.longitude),
        name: `${item.name}${item.admin1 ? ', ' + item.admin1 : ''}${item.country ? ', ' + item.country : ''}`,
        city: item.name,
        country: item.country || '',
      };
      geocodeCache.set(normalizedKey, result);
      return result;
    }
  } catch (err) {
    console.warn(`[geocodeCity] Open-Meteo geocoding attempt failed for "${city}":`, err.message);
  }

  // Tier 2: Geoapify if API key exists
  if (process.env.GEOAPIFY_API_KEY) {
    try {
      const geoapifyRes = await axios.get('https://api.geoapify.com/v1/geocode/search', {
        params: {
          text: city.trim(),
          apiKey: process.env.GEOAPIFY_API_KEY,
          limit: 1,
        },
        timeout: 5000,
      });

      if (geoapifyRes.data?.features && geoapifyRes.data.features.length > 0) {
        const feat = geoapifyRes.data.features[0];
        const result = {
          lat: feat.properties.lat,
          lng: feat.properties.lon,
          name: feat.properties.formatted || feat.properties.city || city,
          city: feat.properties.city || feat.properties.name || city,
          country: feat.properties.country || '',
        };
        geocodeCache.set(normalizedKey, result);
        return result;
      }
    } catch (err) {
      console.warn(`[geocodeCity] Geoapify geocoding attempt failed for "${city}":`, err.message);
    }
  }

  // Tier 3: Nominatim (OSM) with appropriate User-Agent
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: city.trim(),
        format: 'json',
        limit: 1,
        'accept-language': 'en',
      },
      headers: {
        'User-Agent': 'VerdantX-App/1.0 (https://verdantx.com; contact@verdantx.com)',
      },
      timeout: 5000,
    });

    if (response.data && response.data.length > 0) {
      const item = response.data[0];
      const result = {
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        name: item.display_name,
        city: item.display_name.split(',')[0].trim(),
        country: '',
      };
      geocodeCache.set(normalizedKey, result);
      return result;
    }
  } catch (error) {
    console.warn(`[geocodeCity] Nominatim fallback failed for "${city}":`, error.message);
  }

  throw new Error(`Could not resolve location coordinates for "${city}"`);
};

/**
 * Reverse geocode coordinates to City & Country name
 */
export const reverseGeocode = async (lat, lng) => {
  if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
    return { city: 'Unknown', country: 'Unknown' };
  }

  const cacheKey = `${parseFloat(lat).toFixed(4)},${parseFloat(lng).toFixed(4)}`;
  if (reverseGeocodeCache.has(cacheKey)) {
    return reverseGeocodeCache.get(cacheKey);
  }

  // Tier 1: BigDataCloud reverse geocoding API (Fast, Free, Client-friendly)
  try {
    const bdcRes = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', {
      params: {
        latitude: lat,
        longitude: lng,
        localityLanguage: 'en',
      },
      timeout: 4000,
    });

    if (bdcRes.data) {
      const city =
        bdcRes.data.city || bdcRes.data.locality || bdcRes.data.principalSubdivision || '';
      const country = bdcRes.data.countryName || '';

      if (city) {
        const result = { city, country };
        reverseGeocodeCache.set(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    console.warn(`[reverseGeocode] BigDataCloud attempt failed for (${lat}, ${lng}):`, err.message);
  }

  // Tier 2: Nominatim
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon: lng,
        format: 'json',
        'accept-language': 'en',
      },
      headers: {
        'User-Agent': 'VerdantX-App/1.0 (https://verdantx.com; contact@verdantx.com)',
      },
      timeout: 4000,
    });

    if (response.data) {
      const addr = response.data.address || {};
      const result = {
        city:
          addr.city ||
          addr.town ||
          addr.village ||
          addr.county ||
          addr.state ||
          response.data.name ||
          'Unknown Location',
        country: addr.country || 'Unknown',
      };
      reverseGeocodeCache.set(cacheKey, result);
      return result;
    }
  } catch (error) {
    console.warn(`[reverseGeocode] Lookup failed for (${lat}, ${lng}):`, error.message);
  }

  return { city: 'Unknown', country: 'Unknown' };
};

/**
 * Search locations for autocomplete/search dropdown
 */
export const searchLocationsService = async (query) => {
  if (!query || typeof query !== 'string' || query.trim().length < 2) {
    return [];
  }

  const trimmedQuery = query.trim();

  // Tier 1: Open-Meteo Geocoding
  try {
    const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: {
        name: trimmedQuery,
        count: 5,
        language: 'en',
        format: 'json',
      },
      timeout: 5000,
    });

    if (response.data?.results && response.data.results.length > 0) {
      return response.data.results.map((item) => {
        const parts = [item.name, item.admin1, item.country].filter(Boolean);
        return {
          place_id: item.id || `${item.latitude}-${item.longitude}`,
          display_name: parts.join(', '),
          lat: String(item.latitude),
          lon: String(item.longitude),
        };
      });
    }
  } catch (err) {
    console.warn(`[searchLocationsService] Open-Meteo search failed for "${query}":`, err.message);
  }

  // Tier 2: Nominatim search fallback
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: trimmedQuery,
        format: 'json',
        limit: 5,
        addressdetails: 1,
        'accept-language': 'en',
      },
      headers: {
        'User-Agent': 'VerdantX-App/1.0 (https://verdantx.com; contact@verdantx.com)',
      },
      timeout: 5000,
    });

    if (Array.isArray(response.data)) {
      return response.data.map((item) => ({
        place_id: item.place_id,
        display_name: item.display_name,
        lat: String(item.lat),
        lon: String(item.lon),
      }));
    }
  } catch (err) {
    console.warn(`[searchLocationsService] Nominatim search failed for "${query}":`, err.message);
  }

  return [];
};
