import dotenv from 'dotenv';
dotenv.config();
import { getAirQualityByCity } from '../services/airQualityService.js';
import { generateAIReport } from '../services/healthReportService.js';

async function test() {
  console.log('Fetching air quality for London...');
  const envData = await getAirQualityByCity('London');
  console.log('Environment data AQI:', envData.aqi, 'City:', envData.location?.city);

  console.log('Generating AI report for guest profile...');
  const profile = {
    primaryCity: 'London',
    ageGroup: 'adult',
    conditions: ['Asthma'],
    sensitivityLevel: 'high',
    outdoorActivity: 'jogging',
  };

  const report = await generateAIReport(profile, envData, '');
  console.log('Generated AI Report:', JSON.stringify(report, null, 2));
}

test().catch(console.error);
