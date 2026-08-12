import { getAirQualityByCoordinates, getAirQualityByCity, getHistoricalData } from '../services/airQualityService.js';

// @desc    Get current environmental data by coordinates
// @route   GET /api/environment/current
// @access  Private (uses user's health profile)
export const getCurrentEnvironmentByCoords = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      res.status(400);
      throw new Error('Latitude and longitude are required');
    }

    const healthProfile = req.user?.healthProfile || null;
    const data = await getAirQualityByCoordinates(lat, lng, healthProfile);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current environmental data by city
// @route   GET /api/environment/city
// @access  Private
export const getCurrentEnvironmentByCity = async (req, res, next) => {
  try {
    const { city } = req.query;

    if (!city) {
      res.status(400);
      throw new Error('City is required');
    }

    const healthProfile = req.user?.healthProfile || null;
    const data = await getAirQualityByCity(city, healthProfile);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get historical environmental data
// @route   GET /api/environment/history
// @access  Private
export const getHistoricalEnvironment = async (req, res, next) => {
  try {
    const { lat, lng, days = 7 } = req.query;

    if (!lat || !lng) {
      res.status(400);
      throw new Error('Latitude and longitude are required');
    }

    const data = await getHistoricalData(parseFloat(lat), parseFloat(lng), parseInt(days));

    if (data.length === 0) {
      return res.json({
        success: true,
        message: 'Insufficient historical data exists for this location.',
        data: [],
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Compare multiple cities
// @route   GET /api/environment/compare
// @access  Public
export const compareCities = async (req, res, next) => {
  try {
    const { cities } = req.query; // Expecting comma-separated list: "Delhi,Mumbai,Chennai"

    if (!cities) {
      res.status(400);
      throw new Error('Cities query parameter is required');
    }

    const cityList = cities.split(',').map((c) => c.trim()).filter((c) => c);

    if (cityList.length < 2) {
      res.status(400);
      throw new Error('Please provide at least two cities to compare');
    }

    const comparisons = [];
    const healthProfile = req.user?.healthProfile || null;

    for (const city of cityList) {
      try {
        const data = await getAirQualityByCity(city, healthProfile);
        comparisons.push(data);
      } catch (err) {
        comparisons.push({ city, error: 'Data unavailable' });
      }
    }

    res.json({
      success: true,
      data: comparisons,
    });
  } catch (error) {
    next(error);
  }
};
