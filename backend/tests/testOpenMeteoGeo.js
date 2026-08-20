import axios from 'axios';

async function testGeocoding() {
  console.log('Testing Open-Meteo Geocoding API for Mumbai...');
  try {
    const res = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: { name: 'Mumbai', count: 1, language: 'en', format: 'json' },
    });
    console.log('Open-Meteo Geocoding result for Mumbai:', res.data.results[0]);
  } catch (err) {
    console.error('Open-Meteo error:', err.message);
  }

  console.log('Testing Open-Meteo Geocoding API for Bhopal...');
  try {
    const res = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: { name: 'Bhopal', count: 1, language: 'en', format: 'json' },
    });
    console.log('Open-Meteo Geocoding result for Bhopal:', res.data.results[0]);
  } catch (err) {
    console.error('Open-Meteo error for Bhopal:', err.message);
  }
}

testGeocoding();
