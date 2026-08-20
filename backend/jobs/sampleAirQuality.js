import cron from 'node-cron';
import User from '../models/User.js';
import AirQualitySnapshot from '../models/AirQualitySnapshot.js';
import { getAirQualityByCoordinates } from '../services/airQualityService.js';

import { getIO } from '../utils/socket.js';

export const startSampleAirQualityJob = () => {
  // Run every 6 hours: '0 */6 * * *'
  cron.schedule('0 */6 * * *', async () => {
    try {
      console.log('Running Air Quality Sampling Cron Job...');

      const users = await User.find({ savedLocations: { $exists: true, $not: { $size: 0 } } })
        .populate('savedLocations');

      const uniqueLocations = new Map();

      users.forEach(user => {
        user.savedLocations.forEach(loc => {
          if (loc.latitude && loc.longitude) {
            uniqueLocations.set(`${loc.latitude},${loc.longitude}`, loc);
          }
        });
      });

      // Helper to pause execution
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      for (const [coordStr, loc] of uniqueLocations) {
        try {
          // Wait 2 seconds before each location to respect Open-Meteo API rate limits
          await delay(2000);
          
          const { latitude, longitude, city } = loc;
          const aqiData = await getAirQualityByCoordinates(latitude, longitude, null);

          if (aqiData) {
            const snapshot = await AirQualitySnapshot.create({
              locationId: loc._id,
              city: city || 'Unknown',
              latitude,
              longitude,
              aqi: aqiData.aqi || 0,
              pm25: aqiData.pollutants?.pm25,
              pm10: aqiData.pollutants?.pm10,
              co: aqiData.pollutants?.co,
              no2: aqiData.pollutants?.no2,
              so2: aqiData.pollutants?.so2,
              o3: aqiData.pollutants?.o3,
              temperature: aqiData.weather?.temperature,
              humidity: aqiData.weather?.humidity,
              wind: aqiData.weather?.windSpeed,
              weather: aqiData.weather?.condition,
              riskLevel: aqiData.riskLevel || 'MODERATE',
            });

            // Emit to all users that have this location saved
            users.forEach(user => {
              if (user.savedLocations.some(sl => sl._id.toString() === loc._id.toString())) {
                try {
                  getIO().to(user._id.toString()).emit('location:update', {
                    locationId: loc._id,
                    data: snapshot
                  });
                } catch {
                  // Ignore if Socket.IO is not initialized.
                } 
              }
            });
          }
        } catch (err) {
          console.error(`Failed to sample AQI for ${coordStr}:`, err);
        }
      }
      console.log(`Completed sampling for ${uniqueLocations.size} unique locations`);
    } catch (error) {
      console.error('Error in Air Quality Sampling Job:', error);
    }
  });
};
