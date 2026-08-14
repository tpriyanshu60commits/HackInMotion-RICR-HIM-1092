import axios from 'axios';
import { geocodeLocation, getRoute, getAmenitiesNearPoint } from '../services/geoapify.js';
import { sampleRoutePoints } from '../utils/samplePoints.js';
import { calculateBaseRisk } from '../services/riskEngine.js';

export const analyzeRoute = async (req, res, next) => {
  try {
    const { origin, destination } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ success: false, message: 'Origin and destination are required' });
    }

    // 1. Geocode locations
    const originCoords = await geocodeLocation(origin);
    const destCoords = await geocodeLocation(destination);

    if (!originCoords || !destCoords) {
      return res.status(404).json({ success: false, message: 'Could not find coordinates for one or both locations' });
    }

    // 2. Get route
    let routeData;
    try {
      routeData = await getRoute(originCoords, destCoords);
    } catch (e) {
      return res.status(404).json({ success: false, message: 'Could not find a route between these locations' });
    }

    const { geometry, distanceKm, durationMin } = routeData;

    // 3. Sample points (max 15 to keep API calls reasonable)
    const sampledPoints = sampleRoutePoints(geometry, 15);

    // 4. Analyze sampled points concurrently
    let totalAQI = 0;
    let validAQICount = 0;
    let worstPoint = null;
    let maxAQI = -1;

    // Use Maps/Sets to deduplicate amenities by place_id
    const uniqueFuel = new Map();
    const uniqueHotels = new Map();
    const uniqueHospitals = new Map();

    await Promise.all(sampledPoints.map(async (point) => {
      const [lat, lng] = point;
      
      try {
        const [aqiResponse, amenitiesResponse] = await Promise.all([
          axios.get(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi&timezone=auto`),
          getAmenitiesNearPoint(lat, lng)
        ]);

        // Process AQI
        const aqi = aqiResponse.data?.current?.us_aqi;
        if (aqi != null) {
          totalAQI += aqi;
          validAQICount++;
          
          if (aqi > maxAQI) {
            maxAQI = aqi;
            worstPoint = { lat, lng, aqi };
          }
        }

        // Process amenities (deduplicate)
        amenitiesResponse.fuelStations.forEach(p => uniqueFuel.set(p.place_id, p));
        amenitiesResponse.hotels.forEach(p => uniqueHotels.set(p.place_id, p));
        amenitiesResponse.hospitals.forEach(p => uniqueHospitals.set(p.place_id, p));

      } catch (err) {
        // Skip failed points rather than failing whole request
        console.error(`Error processing sampled point ${lat},${lng}:`, err.message);
      }
    }));

    // 5. Aggregate results
    const averageAQI = validAQICount > 0 ? Math.round(totalAQI / validAQICount) : 50;
    const risk = calculateBaseRisk(averageAQI);

    res.status(200).json({
      success: true,
      data: {
        route: {
          geometry,
          distanceKm: Math.round(distanceKm * 10) / 10,
          durationMin: Math.round(durationMin),
        },
        risk: {
          averageAQI,
          riskLevel: risk.level, // e.g. "MODERATE", "UNHEALTHY"
          label: risk.label,     // e.g. "Moderate", "Unhealthy"
          worstPoint,
        },
        amenities: {
          fuelStations: {
            count: uniqueFuel.size,
            list: Array.from(uniqueFuel.values()).slice(0, 10), // Return top 10
          },
          hotels: {
            count: uniqueHotels.size,
            list: Array.from(uniqueHotels.values()).slice(0, 10),
          },
          hospitals: {
            count: uniqueHospitals.size,
            list: Array.from(uniqueHospitals.values()).slice(0, 10),
          }
        }
      }
    });

  } catch (error) {
    console.error('Route Analysis Error:', error);
    next(error);
  }
};
