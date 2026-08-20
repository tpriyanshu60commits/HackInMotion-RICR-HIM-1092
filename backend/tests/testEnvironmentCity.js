import dotenv from 'dotenv';
dotenv.config();
import { getAirQualityByCity } from '../services/airQualityService.js';
import { geocodeCity } from '../services/geocodingService.js';

async function test() {
  console.log('Testing geocodeCity for Mumbai...');
  try {
    const geo = await geocodeCity('Mumbai');
    console.log('Geocode result for Mumbai:', geo);
  } catch (err) {
    console.error('Geocode error:', err);
  }

  console.log('Testing getAirQualityByCity for Mumbai...');
  try {
    const data = await getAirQualityByCity('Mumbai');
    console.log('Air quality for Mumbai:', data);
  } catch (err) {
    console.error('Air quality error:', err);
  }
}

test();
