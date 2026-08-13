import axios from 'axios';

const GEOAPIFY_API_URL = 'https://api.geoapify.com/v1';
const GEOAPIFY_ROUTING_URL = 'https://api.geoapify.com/v1/routing';
const GEOAPIFY_PLACES_URL = 'https://api.geoapify.com/v2/places';

/**
 * Geocodes a text location to coordinates.
 * @param {string} text - The location text (e.g., "New Delhi")
 * @returns {Promise<{lat: number, lng: number} | null>}
 */
export const geocodeLocation = async (text) => {
  try {
    const response = await axios.get(`${GEOAPIFY_API_URL}/geocode/search`, {
      params: {
        text,
        apiKey: process.env.GEOAPIFY_API_KEY,
        limit: 1,
      },
    });

    if (response.data.features && response.data.features.length > 0) {
      const { lat, lon } = response.data.features[0].properties;
      return { lat, lng: lon };
    }
    return null;
  } catch (error) {
    console.error(`Geocoding error for ${text}:`, error.message);
    throw new Error('Failed to geocode location');
  }
};

/**
 * Fetches route geometry and details between two points.
 * @param {{lat: number, lng: number}} origin
 * @param {{lat: number, lng: number}} destination
 * @returns {Promise<{geometry: number[][], distanceKm: number, durationMin: number}>}
 */
export const getRoute = async (origin, destination) => {
  try {
    const response = await axios.get(GEOAPIFY_ROUTING_URL, {
      params: {
        waypoints: `${origin.lat},${origin.lng}|${destination.lat},${destination.lng}`,
        mode: 'drive',
        apiKey: process.env.GEOAPIFY_API_KEY,
      },
    });

    if (response.data.features && response.data.features.length > 0) {
      const route = response.data.features[0];
      const properties = route.properties;
      
      // Geoapify routing geometry comes as [lon, lat], convert to [lat, lon] for Leaflet
      const rawGeometry = route.geometry.coordinates[0] || [];
      const geometry = rawGeometry.map(coord => [coord[1], coord[0]]);
      
      return {
        geometry,
        distanceKm: properties.distance / 1000,
        durationMin: properties.time / 60,
      };
    }
    throw new Error('No route found');
  } catch (error) {
    console.error('Routing error:', error.message);
    throw new Error('Failed to fetch route');
  }
};

/**
 * Fetches amenities within a radius of a coordinate.
 * @param {number} lat 
 * @param {number} lng 
 * @param {number} radiusMeters 
 * @returns {Promise<{fuelStations: any[], hotels: any[], hospitals: any[]}>}
 */
export const getAmenitiesNearPoint = async (lat, lng, radiusMeters = 2000) => {
  try {
    // Geoapify categories: 
    // service.vehicle.fuel, accommodation.hotel, healthcare.hospital
    const categories = 'service.vehicle.fuel,accommodation.hotel,healthcare.hospital';
    
    const response = await axios.get(GEOAPIFY_PLACES_URL, {
      params: {
        categories,
        filter: `circle:${lng},${lat},${radiusMeters}`,
        limit: 50,
        apiKey: process.env.GEOAPIFY_API_KEY,
      },
    });

    const fuelStations = [];
    const hotels = [];
    const hospitals = [];

    if (response.data.features) {
      response.data.features.forEach(feature => {
        const props = feature.properties;
        const place = {
          place_id: props.place_id,
          name: props.name || props.street || 'Unknown',
          address: props.formatted,
          lat: props.lat,
          lng: props.lon,
        };

        if (props.categories.includes('service.vehicle.fuel')) {
          fuelStations.push(place);
        } else if (props.categories.includes('accommodation.hotel')) {
          hotels.push(place);
        } else if (props.categories.includes('healthcare.hospital')) {
          hospitals.push(place);
        }
      });
    }

    return { fuelStations, hotels, hospitals };
  } catch (error) {
    console.error(`Places error at ${lat},${lng}:`, error.message);
    // Return empty arrays on failure so we don't break the whole request
    return { fuelStations: [], hotels: [], hospitals: [] };
  }
};
