import Location from '../models/Location.js';
import User from '../models/User.js';
import { searchLocationsService } from '../services/geocodingService.js';

// @desc    Search locations for autocomplete
// @route   GET /api/locations/search
// @access  Public / Protected
export const searchLocations = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const data = await searchLocationsService(q.trim());
    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all saved locations for a user
// @route   GET /api/locations
// @access  Private
export const getLocations = async (req, res, next) => {
  try {
    if (req.user?.isGuest) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const locations = await Location.find({ user: req.user._id });
    res.json({
      success: true,
      data: locations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save a new location
// @route   POST /api/locations
// @access  Private
export const saveLocation = async (req, res, next) => {
  try {
    const { name, city, area, country, latitude, longitude, locationType } = req.body;

    if (req.user?.isGuest) {
      return res.status(201).json({
        success: true,
        data: {
          _id: 'guest_loc_' + Date.now(),
          name,
          city,
          area,
          country,
          latitude,
          longitude,
          locationType: locationType || 'other',
        },
      });
    }

    const existingLocation = await Location.findOne({ user: req.user._id, name });

    if (existingLocation) {
      res.status(400);
      throw new Error('You already have a saved location with this name');
    }

    const location = await Location.create({
      user: req.user._id,
      name,
      city,
      area,
      country,
      latitude,
      longitude,
      locationType,
    });

    const user = await User.findById(req.user._id);
    if (user) {
      if (!user.savedLocations) {
        user.savedLocations = [];
      }
      user.savedLocations.push(location._id);
      await user.save();
    }

    res.status(201).json({
      success: true,
      data: location,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a saved location
// @route   DELETE /api/locations/:id
// @access  Private
export const deleteLocation = async (req, res, next) => {
  try {
    if (req.user?.isGuest) {
      return res.json({
        success: true,
        message: 'Location removed successfully',
      });
    }

    const location = await Location.findById(req.params.id);

    if (!location) {
      res.status(404);
      throw new Error('Location not found');
    }

    // Check ownership
    if (location.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await location.deleteOne();

    res.json({
      success: true,
      message: 'Location removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
