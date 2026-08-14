import axios from 'axios';

export const geocodeCity = async (city) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: city,
        format: 'json',
        limit: 1,
        'accept-language': 'en',
      },
      headers: {
        // Nominatim requires a valid User-Agent
        'User-Agent': 'VerdantX-Environment-App/1.0',
      },
    });

    if (response.data && response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon),
        name: response.data[0].display_name,
      };
    }
    throw new Error('City not found');
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw new Error('Could not resolve location coordinates');
  }
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: {
        lat,
        lon: lng,
        format: 'json',
        'accept-language': 'en',
      },
      headers: {
        'User-Agent': 'VerdantX-Environment-App/1.0',
      },
    });

    if (response.data) {
      return {
        city:
          response.data.address.city ||
          response.data.address.town ||
          response.data.address.village ||
          'Unknown Location',
        country: response.data.address.country,
      };
    }
    return { city: 'Unknown', country: 'Unknown' };
  } catch (error) {
    console.error('Reverse geocoding error:', error.message);
    return { city: 'Unknown', country: 'Unknown' };
  }
};
