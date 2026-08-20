import dotenv from 'dotenv';
dotenv.config();
import { getAirQualityByCoordinates, getAirQualityByCity } from '../services/airQualityService.js';
import { reverseGeocode } from '../services/geocodingService.js';

async function test() {
  console.log('--- Testing reverseGeocode for Mumbai (19.07283, 72.88261) ---');
  const rev = await reverseGeocode(19.07283, 72.88261);
  console.log('reverseGeocode result:', rev);

  console.log('\n--- Testing getAirQualityByCoordinates for Mumbai ---');
  const coordData = await getAirQualityByCoordinates(19.07283, 72.88261);
  console.log('coordData city/country/location:', {
    city: coordData.city,
    country: coordData.country,
    latitude: coordData.latitude,
    longitude: coordData.longitude,
  });

  console.log('\n--- Testing getAirQualityByCity for Mumbai ---');
  const cityData = await getAirQualityByCity('Mumbai');
  console.log('cityData city/country/location:', {
    city: cityData.city,
    country: cityData.country,
    latitude: cityData.latitude,
    longitude: cityData.longitude,
  });
}

test();
